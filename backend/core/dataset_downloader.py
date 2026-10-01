"""
Dataset Downloader Engine.
Provides reproducible, verified downloading of approved public datasets.
Stores raw files separately under data/raw/ and immutably records SHA-256 checksums
in the download manifest.
"""
from datetime import datetime, timezone
import hashlib
import json
import os
import shutil
import tempfile
from typing import Any, Dict, List, Optional
import urllib.error
import urllib.request

from backend.core.dataset_license import DatasetLicenseVerifier
from backend.schemas.dataset_downloader import DatasetDownloadRecord, DownloadStatus


class DatasetDownloader:
    def __init__(
        self,
        raw_dir: Optional[str] = None,
        manifest_path: Optional[str] = None,
        license_verifier: Optional[DatasetLicenseVerifier] = None,
    ):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.raw_dir = raw_dir or os.path.join(base_dir, "data", "raw")
        self.manifest_path = manifest_path or os.path.join(
            base_dir, "data", "manifests", "dataset_downloads.json"
        )
        self.license_verifier = license_verifier or DatasetLicenseVerifier()
        os.makedirs(self.raw_dir, exist_ok=True)
        self._ensure_manifest()

    def _ensure_manifest(self) -> None:
        os.makedirs(os.path.dirname(self.manifest_path), exist_ok=True)
        if not os.path.isfile(self.manifest_path):
            with open(self.manifest_path, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    @staticmethod
    def compute_sha256(file_path: str) -> str:
        """Computes SHA-256 hash in 64KB chunks."""
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def verify_checksum(self, file_path: str, expected_hash: str) -> bool:
        if not os.path.isfile(file_path):
            return False
        computed = self.compute_sha256(file_path)
        clean_expected = expected_hash.strip().lower()
        if clean_expected.startswith("sha256:"):
            clean_expected = clean_expected[7:]
        return computed.lower() == clean_expected

    def get_manifest(self) -> List[DatasetDownloadRecord]:
        if not os.path.isfile(self.manifest_path):
            return []
        try:
            with open(self.manifest_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            return [DatasetDownloadRecord(**item) for item in data]
        except Exception:
            return []

    def record_download(self, record: DatasetDownloadRecord) -> None:
        current = self.get_manifest()
        # Replace existing entry for same dataset_id & raw_file_path or append
        updated = [
            item
            for item in current
            if not (
                item.dataset_id == record.dataset_id
                and item.raw_file_path == record.raw_file_path
            )
        ]
        updated.append(record)
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump([item.model_dump() for item in updated], f, indent=2)

    def _sanitize_filename(self, filename: str) -> str:
        clean = os.path.basename(filename.strip().replace("\\", "/"))
        if not clean or clean in (".", ".."):
            raise ValueError(f"Invalid or unsafe target filename: '{filename}'")
        return clean

    def download_file(
        self,
        url: str,
        target_filename: str,
        dataset_id: str,
        expected_hash: Optional[str] = None,
        force: bool = False,
        timeout: int = 20,
    ) -> DatasetDownloadRecord:
        """
        Downloads a file from url to self.raw_dir/target_filename with streaming SHA-256 calculation.
        """
        clean_filename = self._sanitize_filename(target_filename)
        dest_path = os.path.join(self.raw_dir, clean_filename)
        now_iso = datetime.now(timezone.utc).isoformat()

        # Check caching if file already exists
        if os.path.isfile(dest_path) and not force:
            existing_hash = self.compute_sha256(dest_path)
            file_size = os.path.getsize(dest_path)
            if expected_hash is None or self.verify_checksum(dest_path, expected_hash):
                record = DatasetDownloadRecord(
                    dataset_id=dataset_id,
                    source_url=url,
                    raw_file_path=os.path.relpath(dest_path, os.path.dirname(self.raw_dir)),
                    file_size_bytes=file_size,
                    sha256_checksum=existing_hash,
                    downloaded_at=now_iso,
                    status=DownloadStatus.CACHED,
                    is_verified=True,
                )
                self.record_download(record)
                return record

        # Streaming download to temporary file
        temp_fd, temp_path = tempfile.mkstemp(prefix="sangyan_raw_", dir=self.raw_dir)
        hasher = hashlib.sha256()
        bytes_written = 0

        req = urllib.request.Request(
            url,
            headers={"User-Agent": "SangyanAI-InvestorShield-Downloader/1.0"},
        )

        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                with os.fdopen(temp_fd, "wb") as f_out:
                    for chunk in iter(lambda: response.read(65536), b""):
                        hasher.update(chunk)
                        f_out.write(chunk)
                        bytes_written += len(chunk)

            calculated_hash = hasher.hexdigest()

            # Hash verification if expected_hash was provided
            if expected_hash is not None:
                clean_exp = expected_hash.strip().lower()
                if clean_exp.startswith("sha256:"):
                    clean_exp = clean_exp[7:]
                if calculated_hash.lower() != clean_exp:
                    if os.path.isfile(temp_path):
                        os.remove(temp_path)
                    failed_rec = DatasetDownloadRecord(
                        dataset_id=dataset_id,
                        source_url=url,
                        raw_file_path=os.path.relpath(dest_path, os.path.dirname(self.raw_dir)),
                        file_size_bytes=bytes_written,
                        sha256_checksum=calculated_hash,
                        downloaded_at=now_iso,
                        status=DownloadStatus.FAILED,
                        is_verified=False,
                        error_message=f"Checksum mismatch: expected '{clean_exp}' but got '{calculated_hash}'",
                    )
                    self.record_download(failed_rec)
                    return failed_rec

            # Move atomically to final destination
            if os.path.isfile(dest_path):
                os.remove(dest_path)
            shutil.move(temp_path, dest_path)

            success_rec = DatasetDownloadRecord(
                dataset_id=dataset_id,
                source_url=url,
                raw_file_path=os.path.relpath(dest_path, os.path.dirname(self.raw_dir)),
                file_size_bytes=bytes_written,
                sha256_checksum=calculated_hash,
                downloaded_at=now_iso,
                status=DownloadStatus.SUCCESS,
                is_verified=True,
            )
            self.record_download(success_rec)
            return success_rec

        except Exception as e:
            if os.path.isfile(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass
            failed_rec = DatasetDownloadRecord(
                dataset_id=dataset_id,
                source_url=url,
                raw_file_path=os.path.relpath(dest_path, os.path.dirname(self.raw_dir)),
                file_size_bytes=bytes_written,
                sha256_checksum="",
                downloaded_at=now_iso,
                status=DownloadStatus.FAILED,
                is_verified=False,
                error_message=f"Network or I/O error during download: {str(e)}",
            )
            self.record_download(failed_rec)
            return failed_rec

    def download_approved_dataset(
        self,
        dataset_id: str,
        target_filename: str,
        direct_url: Optional[str] = None,
        expected_hash: Optional[str] = None,
        force: bool = False,
    ) -> DatasetDownloadRecord:
        """
        Validates approval and license compliance before downloading.
        """
        license_rec = self.license_verifier.get_record(dataset_id)
        if not license_rec:
            now_iso = datetime.now(timezone.utc).isoformat()
            return DatasetDownloadRecord(
                dataset_id=dataset_id,
                source_url=direct_url or "",
                raw_file_path="",
                file_size_bytes=0,
                sha256_checksum="",
                downloaded_at=now_iso,
                status=DownloadStatus.FAILED,
                is_verified=False,
                error_message=f"Dataset '{dataset_id}' is not registered in approved license registry.",
            )

        if not license_rec.license_verified:
            now_iso = datetime.now(timezone.utc).isoformat()
            return DatasetDownloadRecord(
                dataset_id=dataset_id,
                source_url=direct_url or license_rec.provenance_url,
                raw_file_path="",
                file_size_bytes=0,
                sha256_checksum="",
                downloaded_at=now_iso,
                status=DownloadStatus.FAILED,
                is_verified=False,
                error_message=f"Dataset '{dataset_id}' license verification status is False.",
            )

        url_to_use = direct_url or license_rec.provenance_url
        return self.download_file(
            url=url_to_use,
            target_filename=target_filename,
            dataset_id=dataset_id,
            expected_hash=expected_hash,
            force=force,
        )
