"""
Pydantic Schemas for Production User Authentication and Owner Verification.
Covers Owner Registration, Email OTP, Identity/Liveness Verification,
WebAuthn/Passkey, Sessions, Devices, Pairing, and Audit Events.
"""
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class AccountStatus(str, Enum):
    PENDING_EMAIL = "PENDING_EMAIL"
    PENDING_IDENTITY = "PENDING_IDENTITY"
    ACTIVE = "ACTIVE"
    LOCKED = "LOCKED"
    SUSPENDED = "SUSPENDED"
    DEACTIVATED = "DEACTIVATED"


class FaceVerificationStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    BYPASSED_PASSPHRASE = "BYPASSED_PASSPHRASE"


class DeviceType(str, Enum):
    DESKTOP = "DESKTOP"
    MOBILE = "MOBILE"
    SMARTWATCH = "SMARTWATCH"
    BROWSER_EXTENSION = "BROWSER_EXTENSION"


class DeviceStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"
    PENDING = "PENDING"


class IntegrationStatus(str, Enum):
    CONNECTED = "CONNECTED"
    AVAILABLE = "AVAILABLE"
    NOT_CONFIGURED = "NOT_CONFIGURED"
    DEMO = "DEMO"


# ---------------------------------------------------------------------------
# Registration & User Models
# ---------------------------------------------------------------------------

class OwnerRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120, description="Full Legal Name of the Investor")
    email: EmailStr = Field(..., description="Primary Investor Email Address")
    activation_code: str = Field(..., min_length=4, max_length=64, description="Enterprise/Beta Activation Code")
    device_name: Optional[str] = Field("Primary Workstation", description="Name of the initial device")
    device_type: Optional[DeviceType] = Field(DeviceType.DESKTOP, description="Device Type")


class OwnerProfile(BaseModel):
    user_id: str
    full_name: str
    email: str
    masked_email: str
    email_verified: bool
    identity_verified: bool
    face_verification_status: str
    account_status: AccountStatus
    created_at: str
    updated_at: str
    last_login_at: Optional[str] = None
    failed_login_attempts: int = 0
    locked_until: Optional[str] = None
    mfa_enabled: bool = True
    security_version: int = 1
    active_devices_count: int = 1
    active_sessions_count: int = 1


class RegisterResponse(BaseModel):
    user_id: str
    full_name: str
    email: str
    masked_email: str
    account_status: AccountStatus
    message: str
    otp_sent: bool
    email_provider_configured: bool
    sandbox_otp: Optional[str] = None


# ---------------------------------------------------------------------------
# Email OTP Models
# ---------------------------------------------------------------------------

class SendOtpRequest(BaseModel):
    email: EmailStr = Field(..., description="Email address to receive OTP")
    purpose: Optional[str] = Field("REGISTRATION", description="REGISTRATION, LOGIN, or RECOVERY")


class SendOtpResponse(BaseModel):
    success: bool
    message: str
    masked_email: str
    expires_in_seconds: int = 300
    resend_cooldown_seconds: int = 60
    email_provider_configured: bool
    sandbox_otp: Optional[str] = None


class VerifyOtpRequest(BaseModel):
    email: EmailStr = Field(..., description="Investor Email Address")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit cryptographically secure OTP")
    purpose: Optional[str] = Field("REGISTRATION", description="REGISTRATION, LOGIN, or RECOVERY")


class VerifyOtpResponse(BaseModel):
    success: bool
    message: str
    email_verified: bool
    next_step: str
    session_token: Optional[str] = None


# ---------------------------------------------------------------------------
# Identity & Liveness Models
# ---------------------------------------------------------------------------

class CreateLivenessSessionRequest(BaseModel):
    user_id: str = Field(..., description="Owner User ID")
    consent_given: bool = Field(..., description="Explicit biometric verification consent")


class LivenessSessionResponse(BaseModel):
    session_id: str
    user_id: str
    provider: str
    status: str
    challenge: Dict[str, Any]
    expires_in_seconds: int = 300
    provider_configured: bool
    message: Optional[str] = None


class VerifyLivenessRequest(BaseModel):
    session_id: str = Field(..., description="Liveness Verification Session ID")
    liveness_proof: Dict[str, Any] = Field(..., description="Cryptographic proof / anti-spoofing challenge response")


class VerifyLivenessResponse(BaseModel):
    success: bool
    session_id: str
    identity_verified: bool
    status: str
    provider: str
    message: str
    timestamp: str


# ---------------------------------------------------------------------------
# WebAuthn / Passkey Models
# ---------------------------------------------------------------------------

class PasskeyRegisterOptionsRequest(BaseModel):
    user_id: str


class PasskeyRegisterVerifyRequest(BaseModel):
    user_id: str
    credential_id: str
    public_key_pem: str
    device_name: Optional[str] = "Device Authenticator"


class PasskeyAuthOptionsRequest(BaseModel):
    email: EmailStr


class PasskeyAuthVerifyRequest(BaseModel):
    email: EmailStr
    credential_id: str
    signature: str
    client_data_json: str


# ---------------------------------------------------------------------------
# Login & Session Models
# ---------------------------------------------------------------------------

class LoginInitRequest(BaseModel):
    email: EmailStr = Field(..., description="Investor Email Address")


class LoginInitResponse(BaseModel):
    success: bool
    message: str
    masked_email: str
    email_provider_configured: bool
    has_passkey: bool = False
    supported_methods: List[str] = Field(default_factory=lambda: ["EMAIL_OTP", "PASSKEY"])
    sandbox_otp: Optional[str] = None


class LoginVerifyRequest(BaseModel):
    email: EmailStr
    otp: Optional[str] = None
    passkey_credential_id: Optional[str] = None
    passkey_signature: Optional[str] = None
    device_name: Optional[str] = "Workstation"
    device_type: Optional[DeviceType] = DeviceType.DESKTOP


class AuthTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int = 3600
    user: OwnerProfile


class SessionRecord(BaseModel):
    session_id: str
    user_id: str
    device_id: str
    device_name: str
    device_type: str
    platform: str
    ip_address: str
    created_at: str
    last_active_at: str
    is_current: bool = False


# ---------------------------------------------------------------------------
# Devices & Pairing Models
# ---------------------------------------------------------------------------

class DeviceRecord(BaseModel):
    device_id: str
    user_id: str
    device_type: DeviceType
    device_name: str
    platform: str
    registered_at: str
    last_seen: str
    status: DeviceStatusEnum
    revoked_at: Optional[str] = None


class CreatePairingRequest(BaseModel):
    device_type: DeviceType = Field(DeviceType.MOBILE, description="Type of device to pair")
    device_name: Optional[str] = Field("Mobile Companion", description="User-friendly device name")


class PairingSessionResponse(BaseModel):
    pairing_id: str
    pairing_code: str
    expires_in_seconds: int = 300
    qr_payload: str
    device_type: str
    status: str


class CompletePairingRequest(BaseModel):
    pairing_id: str
    pairing_code: str
    device_platform: str = "Android"
    device_name: str = "Personal Mobile Phone"


class RevokeDeviceRequest(BaseModel):
    device_id: str


# ---------------------------------------------------------------------------
# Audit & Security Events
# ---------------------------------------------------------------------------

class SecurityAuditEvent(BaseModel):
    event_id: str
    user_id: str
    event_type: str
    timestamp: str
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
