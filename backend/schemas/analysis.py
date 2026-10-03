"""
Pydantic Data Schemas for Sangyan AI Investor Shield Result Contract.
Enforces validation for risk level, uncertainty, detected signals, claims, evidence, and official links.
"""
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    LOW_CONCERN = "Low Concern"
    NEEDS_VERIFICATION = "Needs Verification"
    HIGH_CONCERN = "High Concern"


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MODERATE = "moderate"
    UNCERTAIN = "uncertain"


class ConfidenceOrUncertainty(BaseModel):
    level: ConfidenceLevel = Field(
        ..., description="Qualitative confidence rating: high, moderate, or uncertain."
    )
    score: Optional[float] = Field(
        None, ge=0.0, le=1.0, description="Optional calibrated score between 0.0 and 1.0."
    )
    uncertainty_note: Optional[str] = Field(
        None, description="Explicit disclaimer when evidence is incomplete or inconclusive."
    )


class DetectedSignal(BaseModel):
    id: str = Field(..., description="Unique signal identifier (e.g. SIG_GUARANTEED_RETURN).")
    name: str = Field(..., description="Human-readable signal title.")
    severity: str = Field(..., description="Severity level: low, medium, high, critical.")
    rule_id: Optional[str] = Field(None, description="Identifier of triggering rule if applicable.")
    description: str = Field(..., description="Explanation of why this indicator represents risk.")
    evidence_text: Optional[str] = Field(None, description="Exact phrase or excerpt triggering the signal.")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Confidence score for this signal.")
    rule_source: Optional[str] = Field(None, description="Regulatory advisory or statutory reference.")


class ExtractedClaim(BaseModel):
    claim_text: str = Field(..., description="Extracted factual assertion.")
    claim_type: str = Field(
        ...,
        description="Category: guaranteed_return, registration_claim, urgency, payment_request, official_endorsement, tip.",
    )
    entity: Optional[str] = Field(None, description="Associated named entity if identified.")


class EvidenceItem(BaseModel):
    source_id: str = Field(..., description="Registered source ID (e.g., SRC001).")
    publisher: str = Field(..., description="Authoritative publisher: SEBI, RBI, I4C, CERT-In.")
    title: str = Field(..., description="Official document or advisory title.")
    url: str = Field(..., description="Verifiable canonical URL of the official source.")
    passage: str = Field(..., description="Exact relevant regulatory passage.")
    relevance_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    source_name: Optional[str] = Field(None, description="Official statutory repository name.")
    source_type: Optional[str] = Field("official_advisory", description="Categorical type: official_advisory, official_portal, official_circular.")
    summary: Optional[str] = Field(None, description="Relevant evidence summary.")
    verification_status: Optional[str] = Field("Verified from official statutory register", description="Retrieval/verification status.")


class OfficialSourceLink(BaseModel):
    title: str = Field(..., description="Name of the official portal or register.")
    url: str = Field(..., description="Direct HTTPS link to the statutory resource.")
    description: str = Field(..., description="Purpose: e.g. Intermediary Verification or Fraud Reporting.")
    category: str = Field(..., description="Category: verification, reporting, grievance, awareness.")


class AnalysisResponse(BaseModel):
    risk_level: RiskLevel = Field(..., description="Assessed risk level.")
    confidence_or_uncertainty: ConfidenceOrUncertainty = Field(
        ..., description="Calibrated confidence or explicit uncertainty."
    )
    detected_signals: List[DetectedSignal] = Field(
        default_factory=list, description="Array of triggered fraud or safety signals."
    )
    extracted_claims: List[ExtractedClaim] = Field(
        default_factory=list, description="Extracted factual claims from user input."
    )
    evidence: List[EvidenceItem] = Field(
        default_factory=list, description="Retrieved authoritative evidence passages."
    )
    explanation: str = Field(
        ..., description="Clear evidence-grounded explanation of findings."
    )
    safe_next_steps: List[str] = Field(
        default_factory=list, description="Actionable recommendations for the investor."
    )
    official_source_links: List[OfficialSourceLink] = Field(
        default_factory=list, description="Authoritative external verification and reporting links."
    )
    protection_tier: Optional[str] = Field(
        default=None, description="Assigned 3-tier protection bucket: Trusted / Important, Review / Verify, Quarantined / High Risk."
    )
    claim_verifications: List[Dict[str, Any]] = Field(
        default_factory=list, description="Detailed verification status (Supported, Contradicted, Unverified) for extracted claims."
    )
    detected_language: Optional[str] = Field(
        default="English", description="Detected language of incoming communication (English, Hindi, Hinglish, etc.)."
    )
    pii_redacted_stats: Optional[Dict[str, int]] = Field(
        default_factory=dict, description="Count of masked PII and confidential credentials."
    )
