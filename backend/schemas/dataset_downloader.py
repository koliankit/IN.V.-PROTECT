"""
Dataset Downloader & Raw Storage Schema.
Defines schemas for reproducible public dataset downloads, raw file provenance,
cryptographic SHA-256 checksum verification, and download audit manifests.
"""
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class DownloadStatus(str, Enum):
    SUCCESS = "success"
    CACHED = "cached"
    FAILED = "failed"
    SKIPPED = "skipped"


class DatasetDownloadRecord(BaseModel):
    dataset_id: str = Field(..., description="Unique dataset identifier matching approved registry")
    source_url: str = Field(..., description="Origin URL from which dataset was acquired")
    raw_file_path: str = Field(..., description="Path to raw persisted file")
    file_size_bytes: int = Field(..., ge=0, description="Size of file in bytes")
    sha256_checksum: str = Field(..., description="Cryptographic SHA-256 checksum of raw file")
    downloaded_at: str = Field(..., description="ISO 8601 UTC timestamp of download event")
    status: DownloadStatus = Field(..., description="Result status of download operation")
    is_verified: bool = Field(False, description="Affirmative verification against expected checksum or license")
    error_message: Optional[str] = Field(None, description="Details of failure if download failed")
