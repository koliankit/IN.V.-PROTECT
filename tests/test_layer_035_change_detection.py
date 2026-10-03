"""
Validation Test for Layer 035: Change detection.
Verifies source-change detection, version incrementation on modification,
full historical version retention, and change audit logging.
"""
import json
import os
import shutil
import stat
import tempfile
import unittest

from backend.core.change_detection import SourceChangeDetector
from backend.core.source_snapshot import SourceSnapshotManager
from backend.schemas.change_detection import ChangeDetectionStatus
from scripts.detect_source_changes import run_change_detection


class TestLayer035ChangeDetection(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.mkdtemp()
        self.snapshots_dir = os.path.join(self.temp_dir, "snapshots")
        self.ledger_path = os.path.join(self.temp_dir, "source_snapshots_ledger.json")
        self.change_log_path = os.path.join(self.temp_dir, "source_change_log.json")

        self.snapshot_manager = SourceSnapshotManager(
            snapshots_dir=self.snapshots_dir,
            ledger_path=self.ledger_path,
        )
        self.detector = SourceChangeDetector(
            snapshot_manager=self.snapshot_manager,
            change_log_path=self.change_log_path,
        )

    def tearDown(self) -> None:
        for root, dirs, files in os.walk(self.temp_dir):
            for f in files:
                p = os.path.join(root, f)
                try:
                    os.chmod(p, stat.S_IWRITE)
                except Exception:
                    pass
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_initial_version_creation(self) -> None:
        content = b"SEBI Initial Advisory Feb 2024"
        res = self.detector.detect_and_version(
            source_id="SRC001",
            current_content=content,
            file_extension="pdf",
        )

        self.assertEqual(res.status, ChangeDetectionStatus.INITIAL_VERSION)
        self.assertIsNotNone(res.new_snapshot_id)
        self.assertIn("v1", res.new_snapshot_id or "")

        lineage = self.detector.get_version_lineage("SRC001")
        self.assertEqual(len(lineage), 1)
        self.assertEqual(lineage[0].version, 1)

    def test_identical_content_returns_no_change(self) -> None:
        content = b"Static Statutory Advisory Text"
        self.detector.detect_and_version("SRC002", content, "html")

        # Second check with identical content
        res2 = self.detector.detect_and_version("SRC002", content, "html")
        self.assertEqual(res2.status, ChangeDetectionStatus.NO_CHANGE)
        self.assertEqual(res2.previous_snapshot_id, res2.new_snapshot_id)

        # Version remains 1
        lineage = self.detector.get_version_lineage("SRC002")
        self.assertEqual(len(lineage), 1)

    def test_changed_content_increments_version_and_retains_previous(self) -> None:
        v1_bytes = b"Circular Version 1: Original list of unauthorized apps"
        v2_bytes = b"Circular Version 2: Added 15 new unauthorized trading apps and mule accounts"

        res1 = self.detector.detect_and_version("SRC003", v1_bytes, "pdf")
        self.assertEqual(res1.status, ChangeDetectionStatus.INITIAL_VERSION)

        res2 = self.detector.detect_and_version("SRC003", v2_bytes, "pdf")
        self.assertEqual(res2.status, ChangeDetectionStatus.VERSION_INCREMENTED)
        self.assertIsNotNone(res2.diff_summary)
        self.assertEqual(res2.diff_summary.previous_version, 1) # type: ignore
        self.assertEqual(res2.diff_summary.new_version, 2) # type: ignore
        self.assertNotEqual(res2.diff_summary.previous_hash, res2.diff_summary.current_hash) # type: ignore

        # Lineage retention: both v1 and v2 exist!
        lineage = self.detector.get_version_lineage("SRC003")
        self.assertEqual(len(lineage), 2)
        self.assertEqual(lineage[0].version, 1)
        self.assertEqual(lineage[1].version, 2)

    def test_change_log_records_diff_summary(self) -> None:
        self.detector.detect_and_version("SRC004", b"Text A", "txt")
        self.detector.detect_and_version("SRC004", b"Text A", "txt")
        self.detector.detect_and_version("SRC004", b"Text B Updated", "txt")

        history = self.detector.get_change_history("SRC004")
        self.assertEqual(len(history), 3)
        self.assertEqual(history[0].status, ChangeDetectionStatus.INITIAL_VERSION)
        self.assertEqual(history[1].status, ChangeDetectionStatus.NO_CHANGE)
        self.assertEqual(history[2].status, ChangeDetectionStatus.VERSION_INCREMENTED)

    def test_cli_dry_run_executes_cleanly(self) -> None:
        exit_code = run_change_detection(
            source_id=None,
            all_sources=True,
            dry_run=True,
        )
        self.assertEqual(exit_code, 0)


if __name__ == "__main__":
    unittest.main()
