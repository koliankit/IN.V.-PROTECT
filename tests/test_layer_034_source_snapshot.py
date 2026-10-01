"""
Validation Test for Layer 034: Source snapshot.
Verifies creation of immutable source snapshots with content hashes, prevention
of silent overwrites for changed official documents, and snapshot integrity auditing.
"""
import hashlib
import json
import os
import shutil
import stat
import tempfile
import unittest

from backend.core.source_snapshot import (
    SnapshotCollisionError,
    SourceSnapshotManager,
)
from backend.schemas.source_snapshot import SnapshotIntegrityStatus


class TestLayer034SourceSnapshot(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.snapshots_dir = os.path.join(self.temp_dir, "snapshots")
        self.ledger_path = os.path.join(self.temp_dir, "source_snapshots_ledger.json")
        self.manager = SourceSnapshotManager(
            snapshots_dir=self.snapshots_dir,
            ledger_path=self.ledger_path,
        )

    def tearDown(self):
        # Restore write permissions before cleanup if read-only was set
        for root, dirs, files in os.walk(self.temp_dir):
            for f in files:
                p = os.path.join(root, f)
                try:
                    os.chmod(p, stat.S_IWRITE)
                except Exception:
                    pass
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_create_initial_snapshot(self):
        content = b"SEBI Investor Advisory on Telegram VIP Groups - Feb 2024"
        expected_hash = hashlib.sha256(content).hexdigest()

        snapshot, status = self.manager.create_snapshot(
            source_id="SRC001",
            content_bytes=content,
            file_extension="pdf",
            metadata={"publisher": "SEBI Investor"},
        )

        self.assertEqual(status, SnapshotIntegrityStatus.NEW_SNAPSHOT)
        self.assertEqual(snapshot.version, 1)
        self.assertEqual(snapshot.source_id, "SRC001")
        self.assertEqual(snapshot.content_hash, f"sha256:{expected_hash}")
        self.assertTrue(snapshot.is_frozen)

        # Check ledger recorded
        ledger = self.manager.list_snapshots("SRC001")
        self.assertEqual(len(ledger), 1)
        self.assertEqual(ledger[0].snapshot_id, snapshot.snapshot_id)

    def test_idempotent_recreation_returns_intact(self):
        content = b"Static unchanged circular text"
        snap1, status1 = self.manager.create_snapshot("SRC002", content, "html")
        self.assertEqual(status1, SnapshotIntegrityStatus.NEW_SNAPSHOT)

        # Call again with identical content
        snap2, status2 = self.manager.create_snapshot("SRC002", content, "html")
        self.assertEqual(status2, SnapshotIntegrityStatus.INTACT)
        self.assertEqual(snap1.snapshot_id, snap2.snapshot_id)

        # Ledger length remains 1
        self.assertEqual(len(self.manager.list_snapshots("SRC002")), 1)

    def test_silent_overwrite_is_strictly_blocked(self):
        original_content = b"Original Circular Content Version 1.0"
        self.manager.create_snapshot("SRC003", original_content, "pdf")

        changed_content = b"Modified Circular Content with Altered Modus Operandi"

        # Attempting to snapshot modified content without explicit version permission must fail!
        with self.assertRaises(SnapshotCollisionError) as ctx:
            self.manager.create_snapshot("SRC003", changed_content, "pdf")

        self.assertIn("Silent overwrite prohibited", str(ctx.exception))
        self.assertIn("SRC003", str(ctx.exception))

    def test_explicit_versioning_preserves_both_revisions(self):
        v1_bytes = b"Circular v1 text"
        v2_bytes = b"Circular v2 amended guidance"

        snap1, _ = self.manager.create_snapshot("SRC005", v1_bytes, "pdf")
        snap2, status2 = self.manager.create_snapshot(
            "SRC005", v2_bytes, "pdf", allow_collision=True
        )

        self.assertEqual(status2, SnapshotIntegrityStatus.NEW_SNAPSHOT)
        self.assertEqual(snap1.version, 1)
        self.assertEqual(snap2.version, 2)
        self.assertNotEqual(snap1.content_hash, snap2.content_hash)

        # Both records are preserved in ledger
        snaps = self.manager.list_snapshots("SRC005")
        self.assertEqual(len(snaps), 2)

        # Latest snapshot returns v2
        latest = self.manager.get_latest_snapshot("SRC005")
        self.assertIsNotNone(latest)
        self.assertEqual(latest.version, 2)

    def test_verify_snapshot_integrity_detects_tampering(self):
        content = b"Evidence Payload"
        snap, _ = self.manager.create_snapshot("SRC006", content, "txt")

        # Initial check passes
        self.assertEqual(
            self.manager.verify_snapshot_integrity(snap.snapshot_id),
            SnapshotIntegrityStatus.INTACT,
        )

        # Simulate tampering on disk
        if os.path.isabs(snap.storage_path):
            full_path = snap.storage_path
        else:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            full_path = os.path.join(base_dir, snap.storage_path)
        try:
            os.chmod(full_path, stat.S_IWRITE)
        except Exception:
            pass

        with open(full_path, "wb") as f:
            f.write(b"Tampered unauthorized bytes injected!")

        # Integrity check detects tampering
        self.assertEqual(
            self.manager.verify_snapshot_integrity(snap.snapshot_id),
            SnapshotIntegrityStatus.TAMPER_DETECTED,
        )


if __name__ == "__main__":
    unittest.main()
