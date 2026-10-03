"""
Claim Extraction Schemas for User-Submitted Content.
Defines models for factual assertions, spans, confidence scores, and structured extraction results.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ClaimType(str, Enum):
    GUARANTEED_RETURNS = "guaranteed_returns"
    OFFICIAL_ENDORSEMENT = "official_endorsement"
    REGISTRATION_CLAIM = "registration_claim"
    URGENCY_DEADLINE = "urgency_deadline"
    FEE_PAYMENT_DEMAND = "fee_payment_demand"
    ACCOUNT_BLOCKING = "account_blocking"
    INVESTMENT_TIPS = "investment_tips"
    CREDENTIAL_REQUEST = "credential_request"
    GENERIC_FACTUAL = "generic_factual"


class ClaimSpan(BaseModel):
    start: int = Field(..., ge=0, description="0-indexed start character offset in raw submission")
    end: int = Field(..., gt=0, description="0-indexed end character offset in raw submission")


class ExtractedClaim(BaseModel):
    claim_id: str = Field(..., description="Unique deterministic identifier for the extracted claim")
    claim_text: str = Field(..., min_length=1, description="Cleaned, normalized statement of the claim")
    raw_fragment: str = Field(..., min_length=1, description="Exact raw text segment corresponding to the span")
    span: ClaimSpan = Field(..., description="Start and end character offsets in the original input")
    claim_type: ClaimType = Field(default=ClaimType.GENERIC_FACTUAL, description="Classification of the claim")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score in the extraction")
    is_verifiable: bool = Field(default=True, description="Whether this assertion can be fact-checked or checked against rules")
    extracted_entities: List[str] = Field(default_factory=list, description="Keywords, numbers, entities captured in this claim")


class UserSubmission(BaseModel):
    submission_id: str = Field(..., description="Identifier for this user submission or message")
    text: str = Field(..., min_length=1, description="Raw user-submitted text from WhatsApp, Telegram, SMS, or OCR")
    source_channel: Optional[str] = Field(default="unspecified", description="Channel where message was seen (e.g. telegram, whatsapp, ocr)")
    submitted_at: Optional[str] = Field(default=None, description="ISO timestamp of submission")


class ClaimExtractionResult(BaseModel):
    submission_id: str = Field(..., description="Identifier of the processed submission")
    original_text_length: int = Field(..., ge=0)
    claims: List[ExtractedClaim] = Field(default_factory=list)
    total_claims: int = Field(..., ge=0)
    discourse_units_count: int = Field(..., ge=0, description="Number of candidate segments evaluated")
    processing_time_ms: float = Field(..., ge=0.0)
    metadata: Dict[str, Any] = Field(default_factory=dict)
