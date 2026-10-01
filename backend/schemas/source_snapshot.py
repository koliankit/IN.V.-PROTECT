"""
Source Snapshot & Immutability Schema.
Defines schemas for immutable official document snapshots, content hashing,
collision detection, and tamper-evident snapshot ledgers.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SnapshotIntegrityStatus(str, Enum):
    INTACT = "intact"
    NEW_SNAPSHOT = "new_snapshot"
    COLLISION_BLOCKED = "collision_blocked"
    TAMPER_DETECTED = "tamper_detected"


class ImmutableSourceSnapshot(BaseModel):
    snapshot_id: str = Field(..., description="Unique snapshot identifier (e.g. SNAP_SRC001_v1_d8c525)")
    source_id: str = Field(..., description="Canonical source ID matching official registry")
    version: int = Field(1, ge=1, description="Sequential version index for this source")
    content_hash: str = Field(..., description="SHA-256 cryptographic digest of document bytes")
    storage_path: str = Field(..., description="Relative file path to immutable stored snapshot")
    byte_size: int = Field(..., ge=0, description="Size of preserved payload in bytes")
    created_at: str = Field(..., description="ISO 8601 UTC creation timestamp")
    is_frozen: bool = Field(True, description="Immutability flag; frozen records cannot be mutated")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata captured at snapshot time")
