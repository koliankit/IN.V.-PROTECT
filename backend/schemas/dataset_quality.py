"""
Dataset Quality Gate Schema.
Defines schemas for candidate datasets, rejection reason codes, quality gate decisions,
and audit trail records for rejecting unvetted, dirty, or unverified datasets.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class QualityGateDecision(str, Enum):
    PASSED = "passed"
    REJECTED = "rejected"


class RejectionReasonCode(str, Enum):
    UNCLEAR_PROVENANCE = "unclear_provenance"
    UNCLEAR_LICENSING = "unclear_licensing"
    EXCESSIVE_DUPLICATION = "excessive_duplication"
    UNVERIFIABLE_LABELS = "unverifiable_labels"
    SUSPICIOUS_RECORDS = "suspicious_records"


class DatasetCandidate(BaseModel):
    dataset_id: str = Field(..., description="Unique dataset identifier")
    dataset_name: str = Field(..., min_length=2, description="Name of the candidate dataset")
    provenance_url: Optional[str] = Field(None, description="Direct URL to original source repository")
    license_type: Optional[str] = Field(None, description="Stated license identifier")
    license_verified: bool = Field(False, description="Whether license was affirmatively checked")
    records: List[Dict[str, Any]] = Field(default_factory=list, description="Records contained in candidate dataset")
    label_field: str = Field("label", description="Key where label is stored in each record")
    text_field: str = Field("text", description="Key where text payload is stored in each record")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional candidate metadata")


class QualityGateAuditLog(BaseModel):
    audit_id: str = Field(..., description="Unique audit record identifier")
    dataset_id: str = Field(..., description="Target dataset ID evaluated")
    dataset_name: str
    decision: QualityGateDecision
    rejection_reasons: List[RejectionReasonCode] = Field(default_factory=list)
    rejection_details: List[str] = Field(default_factory=list)
    total_records: int
    duplicate_count: int
    duplication_rate: float
    unverifiable_label_count: int
    suspicious_record_count: int
    evaluated_at: str
    provenance_url: Optional[str] = None
    license_type: Optional[str] = None
