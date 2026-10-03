"""
Source Change Detection Engine.
Monitors statutory regulatory sources for modifications.
When content changes, it generates a new immutable snapshot version while
strictly preserving all previous versions and maintaining a full audit trail.
"""
from datetime import datetime, timezone
import hashlib
import json
import os
from typing import List, Optional
import uuid

from backend.core.source_snapshot import SourceSnapshotManager
from backend.schemas.change_detection import (
    ChangeDetectionStatus,
    ChangeDiffSummary,
    SourceChangeRecord,
)
from backend.schemas.source_snapshot import (
    ImmutableSourceSnapshot,
    SnapshotIntegrityStatus,
)


class SourceChangeDetector:
    def __init__(
        self,
        snapshot_manager: Optional[SourceSnapshotManager] = None,
        change_log_path: Optional[str] = None,
    ) -> None:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.snapshot_manager = snapshot_manager or SourceSnapshotManager()
        self.change_log_path = change_log_path or os.path.join(
            base_dir, "data", "manifests", "source_change_log.json"
        )
        self._ensure_change_log()

    def _ensure_change_log(self) -> None:
        os.makedirs(os.path.dirname(self.change_log_path), exist_ok=True)
        if not os.path.isfile(self.change_log_path):
            with open(self.change_log_path, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    def get_change_history(self, source_id: Optional[str] = None) -> List[SourceChangeRecord]:
        if not os.path.isfile(self.change_log_path):
            return []
        try:
            with open(self.change_log_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            records = [SourceChangeRecord(**item) for item in raw]
            if source_id:
                return [r for r in records if r.source_id == source_id]
            return records
        except Exception:
            return []

    def _record_change(self, record: SourceChangeRecord) -> None:
        history = self.get_change_history()
        history.append(record)
        with open(self.change_log_path, "w", encoding="utf-8") as f:
            json.dump([r.model_dump() for r in history], f, indent=2)

    def get_version_lineage(self, source_id: str) -> List[ImmutableSourceSnapshot]:
        snaps = self.snapshot_manager.list_snapshots(source_id=source_id)
        return sorted(snaps, key=lambda s: s.version)

    def detect_and_version(
        self,
        source_id: str,
        current_content: bytes,
        file_extension: str = "pdf",
        change_note: Optional[str] = None,
    ) -> SourceChangeRecord:
        """
        Evaluates current content against latest snapshot.
        If changed: creates a new version snapshot and retains previous version.
        If unchanged: preserves current version without modifying storage.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        content_hash = hashlib.sha256(current_content).hexdigest()
        latest = self.snapshot_manager.get_latest_snapshot(source_id)

        # 1. No previous snapshot exists -> Initial version
        if latest is None:
            new_snap, status = self.snapshot_manager.create_snapshot(
                source_id=source_id,
                content_bytes=current_content,
                file_extension=file_extension,
                metadata={"change_note": change_note or "Initial ingestion"},
                allow_collision=False,
            )
            rec = SourceChangeRecord(
                change_id=str(uuid.uuid4()),
                source_id=source_id,
                status=ChangeDetectionStatus.INITIAL_VERSION,
                previous_snapshot_id=None,
                new_snapshot_id=new_snap.snapshot_id,
                diff_summary=None,
                evaluated_at=now_iso,
            )
            self._record_change(rec)
            return rec

        latest_clean_hash = latest.content_hash.lower().replace("sha256:", "")

        # 2. Content is identical -> No change detected
        if latest_clean_hash == content_hash.lower():
            rec = SourceChangeRecord(
                change_id=str(uuid.uuid4()),
                source_id=source_id,
                status=ChangeDetectionStatus.NO_CHANGE,
                previous_snapshot_id=latest.snapshot_id,
                new_snapshot_id=latest.snapshot_id,
                diff_summary=None,
                evaluated_at=now_iso,
            )
            self._record_change(rec)
            return rec

        # 3. Content differs -> Create new version while retaining previous version
        new_snap, _ = self.snapshot_manager.create_snapshot(
            source_id=source_id,
            content_bytes=current_content,
            file_extension=file_extension,
            metadata={"change_note": change_note or "Content change detected"},
            allow_collision=True,
        )

        diff = ChangeDiffSummary(
            byte_delta=len(current_content) - latest.byte_size,
            previous_hash=latest.content_hash,
            current_hash=f"sha256:{content_hash}",
            previous_version=latest.version,
            new_version=new_snap.version,
            change_note=change_note or "Detected modification in official document payload",
        )

        rec = SourceChangeRecord(
            change_id=str(uuid.uuid4()),
            source_id=source_id,
            status=ChangeDetectionStatus.VERSION_INCREMENTED,
            previous_snapshot_id=latest.snapshot_id,
            new_snapshot_id=new_snap.snapshot_id,
            diff_summary=diff,
            evaluated_at=now_iso,
        )
        self._record_change(rec)
        return rec
