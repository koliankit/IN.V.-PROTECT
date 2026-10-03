"""
Sangyan AI Investor Shield - Security Hub & Personal Protection Layer Schemas.
Models for device hub, multi-source communication ingestion, three-tier message protection,
claim verification statuses, incident response, privacy center, and integrations.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.schemas.analysis import RiskLevel, DetectedSignal, EvidenceItem, ExtractedClaim


class ProtectionTier(str, Enum):
    TRUSTED_IMPORTANT = "Trusted / Important"
    REVIEW_VERIFY = "Review / Verify"
    QUARANTINED_HIGH_RISK = "Quarantined / High Risk"
    # Aliases for developer ergonomics
    IMPORTANT = "Trusted / Important"
    REVIEW = "Review / Verify"
    QUARANTINE = "Quarantined / High Risk"


class ClaimVerificationStatus(str, Enum):
    SUPPORTED = "Supported"
    CONTRADICTED = "Contradicted"
    UNVERIFIED = "Unverified"
    PARTIALLY_SUPPORTED = "Partially Supported"


class VerifiedClaimItem(BaseModel):
    claim_id: str
    claim_text: str
    claim_type: str
    verification_status: ClaimVerificationStatus
    verification_notes: str
    authoritative_source: Optional[str] = None
    source_url: Optional[str] = None


class DeviceType(str, Enum):
    PC = "PC / Desktop"
    MOBILE = "Mobile Smartphone"
    SMARTWATCH = "Smartwatch Companion"


class DeviceStatus(BaseModel):
    device_id: str
    name: str
    device_type: DeviceType
    os: str
    status: str = Field(..., description="PROTECTED, CONNECTED, NOT_CONNECTED")
    last_sync: str
    role_description: str
    capabilities: List[str]
    is_alert_endpoint: bool = False


class IntegrationStatus(str, Enum):
    CONNECTED = "CONNECTED"
    AVAILABLE = "AVAILABLE"
    NOT_CONNECTED = "NOT CONNECTED"
    DEMO = "DEMO / SIMULATED"


class IntegrationSource(BaseModel):
    id: str
    name: str
    category: str = Field(..., description="BANK, BROKER, PAYMENT, EMAIL, MESSAGING, BROWSER, DEVICE")
    status: IntegrationStatus
    description: str
    supported_channels: List[str]
    data_access_level: str
    security_guarantee: str
    is_real: bool = False
    notes: Optional[str] = None


class SecureMessage(BaseModel):
    id: str
    sender: str
    sender_identifier: str
    source_channel: str = Field(..., description="SMS, Email, WhatsApp, Telegram, Bank Alert, Broker, Browser")
    timestamp: str
    content: str
    snippet: str
    risk_level: RiskLevel
    protection_tier: ProtectionTier
    status: str = Field(default="ACTIVE", description="ACTIVE, QUARANTINED, RELEASED, DELETED, MARKED_SAFE")
    detected_signals: List[DetectedSignal] = Field(default_factory=list)
    claims: List[VerifiedClaimItem] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    safe_next_steps: List[str] = Field(default_factory=list)
    explanation: str
    quarantine_reason: Optional[str] = None
    is_demo: bool = False


class IncidentRecord(BaseModel):
    incident_id: str
    title: str
    timestamp: str
    severity: str = Field(..., description="CRITICAL, HIGH, MEDIUM, LOW")
    sender: str
    source_channel: str
    suspicious_url: Optional[str] = None
    risk_level: RiskLevel
    detected_signals: List[str]
    claims_summary: List[str]
    evidence_sources: List[str]
    recommended_action: str
    official_reporting_channels: List[Dict[str, str]]
    evidence_package: Dict[str, Any]
    status: str = Field(default="OPEN", description="OPEN, REPORTED, RESOLVED, DISMISSED")


class SecurityOverview(BaseModel):
    digital_security_status: str
    devices_protected: int
    connected_sources: int
    messages_analysed: int
    high_risk_messages: int
    needs_verification: int
    verified_important: int
    recent_threats: List[Dict[str, str]]
    connected_sources_summary: List[Dict[str, str]]
    device_statuses: List[DeviceStatus]


class PrivacyStatus(BaseModel):
    encryption_standard: str = "AES-256 (Local / At-Rest & TLS 1.3 In-Transit)"
    password_storage: str = "NEVER STORED (Zero-Knowledge Architecture)"
    otp_storage: str = "NEVER STORED (Immediate Memory Scrubbing)"
    pin_storage: str = "NEVER STORED"
    data_minimization: bool = True
    local_processing_supported: bool = True
    evidence_retention_days: int = 30
    user_data_deletion_supported: bool = True
    audit_logging_enabled: bool = True
    privacy_policy_url: str = "/privacy"


class ProtectionLevel(str, Enum):
    STANDARD = "STANDARD"
    ENHANCED = "ENHANCED"
    STRICT = "STRICT"


class SecuritySettings(BaseModel):
    protection_level: ProtectionLevel = ProtectionLevel.ENHANCED
    onboarding_completed: bool = True
    notifications_enabled: bool = True
    watch_haptics_enabled: bool = True
    desktop_alerts_enabled: bool = True
    evidence_retention_days: int = 30
    local_processing_only: bool = False
    connected_device_ids: List[str] = Field(default_factory=lambda: ["DEV-PC-01", "DEV-MOB-01", "DEV-WCH-01"])
    active_connector_ids: List[str] = Field(default_factory=lambda: ["INT-SMS", "INT-BROWSER", "INT-EMAIL"])
    no_auto_delete_guarantee: str = "ENFORCED: Sangyan AI never automatically deletes messages."
