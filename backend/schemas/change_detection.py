"""
Source Change Detection Schema.
Defines schemas for monitoring official regulatory document modifications,
generating immutable revision lineages, and auditing version increments.
"""
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class ChangeDetectionStatus(str, Enum):
    NO_CHANGE = "no_change"
    INITIAL_VERSION = "initial_version"
    VERSION_INCREMENTED = "version_incremented"
    FETCH_FAILED = "fetch_failed"


class ChangeDiffSummary(BaseModel):
    byte_delta: int = Field(..., description="Difference in bytes between new and previous version")
    previous_hash: str = Field(..., description="SHA-256 hash of previous version")
    current_hash: str = Field(..., description="SHA-256 hash of newly detected version")
    previous_version: int = Field(..., ge=1, description="Previous version number")
    new_version: int = Field(..., ge=2, description="Newly created version number")
    change_note: Optional[str] = Field(None, description="Human or algorithmic note on nature of change")


class SourceChangeRecord(BaseModel):
    change_id: str = Field(..., description="Unique UUID or event identifier")
    source_id: str = Field(..., description="Canonical source ID matching official registry")
    status: ChangeDetectionStatus = Field(..., description="Result of change evaluation")
    previous_snapshot_id: Optional[str] = Field(None, description="Snapshot ID of previous version if applicable")
    new_snapshot_id: Optional[str] = Field(None, description="Snapshot ID of newly created version if applicable")
    diff_summary: Optional[ChangeDiffSummary] = Field(None, description="Detailed diff metrics if changed")
    evaluated_at: str = Field(..., description="ISO 8601 UTC timestamp of evaluation")
