"""
Validation Test for Layer 032: Dataset downloader.
Verifies reproducible downloading of approved public datasets, separate raw storage,
SHA-256 checksum computation and verification, traversal protection, and manifest auditing.
"""
import hashlib
import io
import os
import shutil
import tempfile
import unittest
from typing import Any
from unittest.mock import MagicMock, patch

from backend.core.dataset_downloader import DatasetDownloader
from backend.core.dataset_license import DatasetLicenseVerifier
from backend.schemas.dataset_downloader import DownloadStatus
from backend.schemas.dataset_license import DatasetLicenseRecord
from scripts.download_datasets import run_downloader


class TestLayer032DatasetDownloader(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.mkdtemp()
        self.raw_dir = os.path.join(self.temp_dir, "raw")
        self.manifest_path = os.path.join(self.temp_dir, "manifests", "dataset_downloads.json")
        self.license_manifest = os.path.join(self.temp_dir, "manifests", "dataset_licenses.json")
        os.makedirs(os.path.dirname(self.license_manifest), exist_ok=True)

        # Mock approved licenses manifest
        approved = [
            {
                "dataset_id": "TEST_APPROVED_01",
                "dataset_name": "Test Approved Dataset",
                "license_type": "CC-BY-4.0",
                "is_commercial_use_allowed": True,
                "is_research_allowed": True,
                "attribution_required": False,
                "provenance_url": "https://data.example.org/test.csv",
                "record_structure": {"text": "string", "label": "string"},
                "permitted_uses": ["baseline_classifier"],
                "license_verified": True,
                "verification_notes": "Verified",
            },
            {
                "dataset_id": "TEST_UNVERIFIED_02",
                "dataset_name": "Test Unverified Dataset",
                "license_type": "Proprietary",
                "is_commercial_use_allowed": False,
                "is_research_allowed": False,
                "attribution_required": False,
                "provenance_url": "https://data.example.org/unverified.csv",
                "record_structure": {"text": "string"},
                "permitted_uses": ["evaluation_only"],
                "license_verified": False,
                "verification_notes": "Unverified",
            },
        ]
        import json
        with open(self.license_manifest, "w", encoding="utf-8") as f:
            json.dump(approved, f)

        self.license_verifier = DatasetLicenseVerifier(self.license_manifest)
        self.downloader = DatasetDownloader(
            raw_dir=self.raw_dir,
            manifest_path=self.manifest_path,
            license_verifier=self.license_verifier,
        )

    def tearDown(self) -> None:
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_compute_and_verify_sha256(self) -> None:
        sample_file = os.path.join(self.temp_dir, "sample.txt")
        content = b"Sangyan AI Investor Shield Checksum Test Data"
        expected_hash = hashlib.sha256(content).hexdigest()

        with open(sample_file, "wb") as f:
            f.write(content)

        calculated = self.downloader.compute_sha256(sample_file)
        self.assertEqual(calculated, expected_hash)
        self.assertTrue(self.downloader.verify_checksum(sample_file, expected_hash))
        self.assertTrue(self.downloader.verify_checksum(sample_file, f"sha256:{expected_hash}"))
        self.assertFalse(self.downloader.verify_checksum(sample_file, "bad_hash_value"))

    @patch("urllib.request.urlopen")
    def test_successful_download_and_storage(self, mock_urlopen: Any) -> None:
        payload = b"col1,col2\nval1,val2\n"
        mock_resp = MagicMock()
        mock_resp.read.side_effect = [payload, b""]
        mock_resp.__enter__.return_value = mock_resp
        mock_urlopen.return_value = mock_resp

        expected_hash = hashlib.sha256(payload).hexdigest()
        rec = self.downloader.download_file(
            url="https://example.org/data.csv",
            target_filename="data.csv",
            dataset_id="TEST_DATASET",
            expected_hash=expected_hash,
        )

        self.assertEqual(rec.status, DownloadStatus.SUCCESS)
        self.assertEqual(rec.sha256_checksum, expected_hash)
        self.assertEqual(rec.file_size_bytes, len(payload))
        self.assertTrue(os.path.isfile(os.path.join(self.raw_dir, "data.csv")))

        # Check manifest recorded
        manifest = self.downloader.get_manifest()
        self.assertEqual(len(manifest), 1)
        self.assertEqual(manifest[0].dataset_id, "TEST_DATASET")

    @patch("urllib.request.urlopen")
    def test_checksum_mismatch_fails_and_removes_temp_file(self, mock_urlopen: Any) -> None:
        payload = b"some actual downloaded bytes"
        mock_resp = MagicMock()
        mock_resp.read.side_effect = [payload, b""]
        mock_resp.__enter__.return_value = mock_resp
        mock_urlopen.return_value = mock_resp

        rec = self.downloader.download_file(
            url="https://example.org/bad_data.csv",
            target_filename="bad_data.csv",
            dataset_id="TEST_BAD",
            expected_hash="0000000000000000000000000000000000000000000000000000000000000000",
        )

        self.assertEqual(rec.status, DownloadStatus.FAILED)
        self.assertIn("Checksum mismatch", rec.error_message or "")
        self.assertFalse(os.path.isfile(os.path.join(self.raw_dir, "bad_data.csv")))

    def test_caching_skips_download_when_checksum_matches(self) -> None:
        dest_file = os.path.join(self.raw_dir, "cached.csv")
        content = b"already downloaded content"
        file_hash = hashlib.sha256(content).hexdigest()
        with open(dest_file, "wb") as f:
            f.write(content)

        rec = self.downloader.download_file(
            url="https://example.org/cached.csv",
            target_filename="cached.csv",
            dataset_id="TEST_CACHED",
            expected_hash=file_hash,
            force=False,
        )

        self.assertEqual(rec.status, DownloadStatus.CACHED)
        self.assertEqual(rec.sha256_checksum, file_hash)

    def test_sanitize_filename_prevents_traversal(self) -> None:
        clean = self.downloader._sanitize_filename("path/to/nested/safe.csv")
        self.assertEqual(clean, "safe.csv")

        clean_traversal = self.downloader._sanitize_filename("../../etc/passwd")
        self.assertEqual(clean_traversal, "passwd")

        with self.assertRaises(ValueError):
            self.downloader._sanitize_filename("..")

    def test_download_approved_dataset_gating(self) -> None:
        # 1. Unregistered dataset is rejected
        rec_unregistered = self.downloader.download_approved_dataset(
            dataset_id="NON_EXISTENT_DATASET",
            target_filename="none.csv",
        )
        self.assertEqual(rec_unregistered.status, DownloadStatus.FAILED)
        self.assertIn("not registered", rec_unregistered.error_message or "")

        # 2. Unverified license dataset is rejected
        rec_unverified = self.downloader.download_approved_dataset(
            dataset_id="TEST_UNVERIFIED_02",
            target_filename="unverified.csv",
        )
        self.assertEqual(rec_unverified.status, DownloadStatus.FAILED)
        self.assertIn("license verification status is False", rec_unverified.error_message or "")

    def test_cli_dry_run_executes_cleanly(self) -> None:
        exit_code = run_downloader(
            dataset_id=None,
            download_all=True,
            dry_run=True,
            force=False,
        )
        self.assertEqual(exit_code, 0)


if __name__ == "__main__":
    unittest.main()
