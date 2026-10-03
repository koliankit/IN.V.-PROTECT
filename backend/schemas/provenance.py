"""
Provenance Registry Schema and Models.
Enforces strict provenance tracking: source_id, publisher, title, url, license,
publication_date, retrieved_at, content_hash, source_type, and allowed_use.
"""
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class SourceType(str, Enum):
    OFFICIAL_ADVISORY = "official_advisory"
    OFFICIAL_PORTAL = "official_portal"
    OFFICIAL_CIRCULAR = "official_circular"
    PUBLIC_DATASET = "public_dataset"
    COMMUNITY_DATASET = "community_dataset"
    OPEN_GOVERNMENT_DATA = "open_government_data"


class AllowedUse(str, Enum):
    RAG_EVIDENCE_RULES = "RAG_evidence_rules"
    VERIFICATION_GRIEVANCE = "verification_grievance"
    IMPACT_CONTEXT = "impact_context"
    BASELINE_CLASSIFIER = "baseline_classifier"
    EVALUATION_ONLY = "evaluation_only"


class ProvenanceRecord(BaseModel):
    source_id: str = Field(..., description="Unique source identifier, e.g. SRC001")
    publisher: str = Field(..., min_length=2, description="Authoritative publisher name")
    title: str = Field(..., min_length=3, description="Official title")
    url: str = Field(..., description="Canonical URL")
    license: str = Field(..., min_length=2, description="Access terms / license")
    publication_date: Optional[str] = Field(None, description="ISO date YYYY-MM-DD or None")
    retrieved_at: str = Field(..., description="ISO 8601 retrieval timestamp")
    content_hash: str = Field(..., description="Cryptographic SHA-256 hash formatted as sha256:<64 hex chars>")
    source_type: SourceType = Field(..., description="Categorical type of source")
    allowed_use: AllowedUse = Field(..., description="Sanctioned pipeline use")
    source_name: Optional[str] = Field(None, description="Official registry repository name")
    authority: Optional[str] = Field(None, description="Statutory authority (e.g. SEBI, RBI, I4C, CERT-In)")
    official_domain: Optional[str] = Field(None, description="Official authorized domain, e.g. sebi.gov.in")
    last_verified: Optional[str] = Field(None, description="ISO timestamp of last verification audit")
    description: Optional[str] = Field(None, description="Overview of authoritative coverage and scope")
    supported_claim_types: Optional[list[str]] = Field(default_factory=list, description="Claim types verifiable against this source")

    @field_validator("content_hash")
    @classmethod
    def validate_hash_format(cls, v: str) -> str:
        if not v.startswith("sha256:") or len(v) != 71:
            raise ValueError("content_hash must be formatted as 'sha256:<64 hex characters>'")
        hex_part = v.split("sha256:")[1]
        if not all(c in "0123456789abcdefABCDEF" for c in hex_part):
            raise ValueError("content_hash contains invalid hexadecimal characters")
        return v.lower()

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("URL must start with http:// or https://")
        return v
