"""
Source Snapshot Manager.
Enforces cryptographic immutability, prevents silent overwrites of modified
official documents, and manages the auditable snapshot ledger.
"""
from datetime import datetime, timezone
import hashlib
import json
import os
import stat
from typing import Any, Dict, List, Optional, Tuple

from backend.schemas.source_snapshot import (
    ImmutableSourceSnapshot,
    SnapshotIntegrityStatus,
)


class SnapshotCollisionError(Exception):
    """Raised when an attempt is made to silently overwrite an existing snapshot with divergent content."""
    pass


class SourceSnapshotManager:
    def __init__(
        self,
        snapshots_dir: Optional[str] = None,
        ledger_path: Optional[str] = None,
    ):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.base_dir = base_dir
        self.snapshots_dir = snapshots_dir or os.path.join(base_dir, "data", "snapshots")
        self.ledger_path = ledger_path or os.path.join(
            base_dir, "data", "manifests", "source_snapshots_ledger.json"
        )
        os.makedirs(self.snapshots_dir, exist_ok=True)
        self._ensure_ledger()

    def _ensure_ledger(self) -> None:
        os.makedirs(os.path.dirname(self.ledger_path), exist_ok=True)
        if not os.path.isfile(self.ledger_path):
            with open(self.ledger_path, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    @staticmethod
    def compute_sha256(data: bytes) -> str:
        return hashlib.sha256(data).hexdigest()

    def list_snapshots(self, source_id: Optional[str] = None) -> List[ImmutableSourceSnapshot]:
        if not os.path.isfile(self.ledger_path):
            return []
        try:
            with open(self.ledger_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            records = [ImmutableSourceSnapshot(**item) for item in raw]
            if source_id:
                return [r for r in records if r.source_id == source_id]
            return records
        except Exception:
            return []

    def get_latest_snapshot(self, source_id: str) -> Optional[ImmutableSourceSnapshot]:
        snapshots = self.list_snapshots(source_id=source_id)
        if not snapshots:
            return None
        return max(snapshots, key=lambda s: s.version)

    def verify_snapshot_integrity(self, snapshot_id: str) -> SnapshotIntegrityStatus:
        all_snaps = self.list_snapshots()
        match = next((s for s in all_snaps if s.snapshot_id == snapshot_id), None)
        if not match:
            return SnapshotIntegrityStatus.TAMPER_DETECTED

        if os.path.isabs(match.storage_path):
            full_path = match.storage_path
        else:
            full_path = os.path.join(self.base_dir, match.storage_path)

        if not os.path.isfile(full_path):
            return SnapshotIntegrityStatus.TAMPER_DETECTED

        with open(full_path, "rb") as f:
            actual_bytes = f.read()

        actual_hash = self.compute_sha256(actual_bytes)
        expected_clean = match.content_hash.lower().replace("sha256:", "")
        if actual_hash.lower() == expected_clean:
            return SnapshotIntegrityStatus.INTACT
        return SnapshotIntegrityStatus.TAMPER_DETECTED

    def create_snapshot(
        self,
        source_id: str,
        content_bytes: bytes,
        file_extension: str = "dat",
        metadata: Optional[Dict[str, Any]] = None,
        allow_collision: bool = False,
    ) -> Tuple[ImmutableSourceSnapshot, SnapshotIntegrityStatus]:
        """
        Creates an immutable snapshot.
        If content matches latest snapshot: returns INTACT without re-saving.
        If content differs from latest snapshot and not explicitly handled: raises SnapshotCollisionError (no silent overwrites).
        """
        content_hash = self.compute_sha256(content_bytes)
        clean_ext = file_extension.lstrip(".").lower()
        latest = self.get_latest_snapshot(source_id)

        if latest is not None:
            latest_clean_hash = latest.content_hash.lower().replace("sha256:", "")
            if latest_clean_hash == content_hash.lower():
                # Content is identical, idempotent return
                return latest, SnapshotIntegrityStatus.INTACT

            # Content differs! Silent overwrite is strictly prohibited!
            if not allow_collision:
                raise SnapshotCollisionError(
                    f"Silent overwrite prohibited: New content for source '{source_id}' has hash "
                    f"'{content_hash[:12]}...', which differs from registered snapshot "
                    f"'{latest.snapshot_id}' (hash: '{latest_clean_hash[:12]}...'). "
                    f"To record changed content, a new version must be explicitly created."
                )

        new_version = 1 if latest is None else latest.version + 1
        hash_prefix = content_hash[:8]
        snapshot_id = f"SNAP_{source_id}_v{new_version}_{hash_prefix}"

        # Target storage location
        source_subfolder = os.path.join(self.snapshots_dir, source_id)
        os.makedirs(source_subfolder, exist_ok=True)
        filename = f"v{new_version}_{hash_prefix}.{clean_ext}"
        full_storage_path = os.path.join(source_subfolder, filename)

        # Write immutable payload
        with open(full_storage_path, "wb") as f_out:
            f_out.write(content_bytes)

        # Make file read-only on disk where possible
        try:
            os.chmod(full_storage_path, stat.S_IREAD | stat.S_IRGRP | stat.S_IROTH)
        except Exception:
            pass

        try:
            rel_path = os.path.relpath(full_storage_path, self.base_dir)
        except ValueError:
            rel_path = full_storage_path

        now_iso = datetime.now(timezone.utc).isoformat()

        snapshot = ImmutableSourceSnapshot(
            snapshot_id=snapshot_id,
            source_id=source_id,
            version=new_version,
            content_hash=f"sha256:{content_hash}",
            storage_path=rel_path,
            byte_size=len(content_bytes),
            created_at=now_iso,
            is_frozen=True,
            metadata=metadata or {},
        )

        # Append to immutable ledger
        ledger = self.list_snapshots()
        ledger.append(snapshot)
        with open(self.ledger_path, "w", encoding="utf-8") as f:
            json.dump([s.model_dump() for s in ledger], f, indent=2)

        return snapshot, SnapshotIntegrityStatus.NEW_SNAPSHOT
