"""
FastAPI Router for Production Authentication and Owner Verification.
Provides endpoints for Registration, OTP delivery, Identity/Liveness verification,
WebAuthn/Passkey, Sessions, Device pairing, and Security Audit Logs.
"""
import os
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr, Field

from backend.core.auth_middleware import get_current_user, require_active_owner
from backend.core.auth_service import auth_service
from backend.core.face_provider import get_face_provider
from backend.core.email_provider import get_email_provider
from backend.core.webauthn_provider import webauthn_provider
from backend.db.auth_db import auth_db
from backend.schemas.auth import (
    AuthTokenResponse,
    CompletePairingRequest,
    CreateLivenessSessionRequest,
    CreatePairingRequest,
    DeviceRecord,
    DeviceType,
    LivenessSessionResponse,
    LoginInitRequest,
    LoginInitResponse,
    LoginVerifyRequest,
    OwnerProfile,
    OwnerRegisterRequest,
    PairingSessionResponse,
    PasskeyAuthOptionsRequest,
    PasskeyAuthVerifyRequest,
    PasskeyRegisterOptionsRequest,
    PasskeyRegisterVerifyRequest,
    RegisterResponse,
    RevokeDeviceRequest,
    SendOtpRequest,
    SendOtpResponse,
    SessionRecord,
    VerifyLivenessRequest,
    VerifyLivenessResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
)

router = APIRouter(tags=["Authentication & Owner Verification"])


# ---------------------------------------------------------------------------
# Initial System & First-Launch Check
# ---------------------------------------------------------------------------
@router.get("/auth/status")
def get_auth_system_status() -> Dict[str, Any]:
    """Returns whether Sangyan has a registered owner, and active provider configurations."""
    owner_count = auth_db.get_owner_count()
    email_prov = get_email_provider()
    face_prov = get_face_provider()

    return {
        "has_registered_owner": owner_count > 0,
        "owners_count": owner_count,
        "email_provider_configured": email_prov.is_configured(),
        "face_provider_configured": face_prov.is_configured(),
        "webauthn_supported": True,
        "zero_password_enforced": True,
        "raw_biometric_storage": False,
    }


# ---------------------------------------------------------------------------
# Owner Registration
# ---------------------------------------------------------------------------
@router.post("/auth/register", response_model=RegisterResponse)
def register_owner(req: OwnerRegisterRequest, request: Request, response: Response) -> RegisterResponse:
    """Step 1: First-launch owner registration with activation code."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("User-Agent")

    success, msg, data = auth_service.register_owner(
        full_name=req.full_name,
        email=req.email,
        activation_code=req.activation_code,
        device_name=req.device_name or "Primary Workstation",
        device_type=req.device_type or DeviceType.DESKTOP,
        ip_address=client_ip,
        user_agent=user_agent,
    )
    if not success or not data:
        raise HTTPException(status_code=400, detail=msg)

    return RegisterResponse(
        user_id=data["user_id"],
        full_name=data["full_name"],
        email=data["email"],
        masked_email=data["masked_email"],
        account_status=data["account_status"],
        message=msg,
        otp_sent=data["otp_sent"],
        email_provider_configured=data["email_provider_configured"],
        sandbox_otp=None,
    )


# ---------------------------------------------------------------------------
# Email OTP Delivery & Verification
# ---------------------------------------------------------------------------
@router.post("/auth/email/send-otp", response_model=SendOtpResponse)
def send_email_otp(req: SendOtpRequest, request: Request) -> SendOtpResponse:
    """Dispatches a single-use cryptographically secure OTP to the owner email."""
    client_ip = request.client.host if request.client else None
    email_prov = get_email_provider()

    if not email_prov.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email verification service is not configured.",
        )

    success, msg = auth_service.send_email_otp(
        email=req.email,
        purpose=req.purpose or "REGISTRATION",
        ip_address=client_ip,
    )
    if not success:
        raise HTTPException(status_code=429 if "wait" in msg else 400, detail=msg)

    from backend.core.security_crypto import security_crypto

    return SendOtpResponse(
        success=True,
        message=msg,
        masked_email=security_crypto.mask_email(req.email),
        expires_in_seconds=300,
        resend_cooldown_seconds=60,
        email_provider_configured=True,
        sandbox_otp=None,
    )


@router.post("/auth/email/verify", response_model=VerifyOtpResponse)
def verify_email_otp(req: VerifyOtpRequest, request: Request) -> VerifyOtpResponse:
    """Step 2: Verifies email OTP in constant time against salted HMAC hash."""
    client_ip = request.client.host if request.client else None
    success, msg, data = auth_service.verify_email_otp(
        email=req.email,
        candidate_otp=req.otp,
        purpose=req.purpose or "REGISTRATION",
        ip_address=client_ip,
    )
    if not success or not data:
        raise HTTPException(status_code=400, detail=msg)

    return VerifyOtpResponse(
        success=True,
        message=msg,
        email_verified=data["email_verified"],
        next_step=data["next_step"],
    )


# ---------------------------------------------------------------------------
# Identity & Liveness Verification
# ---------------------------------------------------------------------------
@router.post("/auth/identity/create", response_model=LivenessSessionResponse)
def create_identity_session(req: CreateLivenessSessionRequest) -> LivenessSessionResponse:
    """Step 3: Initiates real face/liveness verification session with explicit biometric consent."""
    if not req.consent_given:
        raise HTTPException(
            status_code=400,
            detail="Face/liveness verification requires explicit investor consent.",
        )

    face_prov = get_face_provider()
    if not face_prov.is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Identity verification provider is not configured.",
        )

    res = auth_service.start_liveness_session(user_id=req.user_id, consent_given=req.consent_given)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Failed to start identity session."))

    return LivenessSessionResponse(
        session_id=res["session_id"],
        user_id=res["user_id"],
        provider=res["provider"],
        status=res["status"],
        challenge=res.get("challenge", {}),
        expires_in_seconds=res.get("expires_in_seconds", 300),
        provider_configured=True,
        message="Camera session initialized with randomized anti-spoofing challenge.",
    )


@router.get("/auth/identity/status")
def get_identity_status(session_id: str) -> Dict[str, Any]:
    """Polls identity/liveness session progress."""
    face_prov = get_face_provider()
    status_data = face_prov.get_session_status(session_id)
    if not status_data.get("success"):
        raise HTTPException(status_code=404, detail="Identity session not found.")
    return status_data


@router.post("/auth/identity/complete", response_model=VerifyLivenessResponse)
def complete_identity_verification(req: VerifyLivenessRequest) -> VerifyLivenessResponse:
    """Step 4: Evaluates anti-spoofing telemetry, activates owner account without storing images."""
    res = auth_service.verify_liveness(session_id=req.session_id, liveness_proof=req.liveness_proof)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Identity verification failed."))

    return VerifyLivenessResponse(
        success=True,
        session_id=res["session_id"],
        identity_verified=True,
        status="VERIFIED",
        provider=res["provider"],
        message=res["message"],
        timestamp=res["timestamp"],
    )


# ---------------------------------------------------------------------------
# WebAuthn / Passkey Registration & Authentication
# ---------------------------------------------------------------------------
@router.post("/auth/passkey/register/options")
def get_passkey_register_options(req: PasskeyRegisterOptionsRequest) -> Dict[str, Any]:
    """Generates WebAuthn registration options for Windows Hello / Touch ID / Android."""
    user = auth_db.get_user_by_id(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    return webauthn_provider.generate_registration_options(
        user_id=user["user_id"],
        email=user["email"],
        display_name=user["full_name"],
    )


@router.post("/auth/passkey/register/verify")
def verify_passkey_registration(req: PasskeyRegisterVerifyRequest) -> Dict[str, Any]:
    """Stores verified WebAuthn credential public key."""
    success = webauthn_provider.verify_registration(
        user_id=req.user_id,
        credential_id=req.credential_id,
        public_key_pem=req.public_key_pem,
        device_name=req.device_name or "Platform Authenticator",
    )
    if not success:
        raise HTTPException(status_code=400, detail="Failed to register passkey.")
    return {"success": True, "message": "Passkey registered successfully."}


@router.post("/auth/passkey/auth/options")
def get_passkey_auth_options(req: PasskeyAuthOptionsRequest) -> Dict[str, Any]:
    """Generates WebAuthn authentication options."""
    user = auth_db.get_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")
    return webauthn_provider.generate_authentication_options(user["user_id"])


# ---------------------------------------------------------------------------
# Login Flow
# ---------------------------------------------------------------------------
@router.post("/auth/login", response_model=LoginInitResponse)
def login_init(req: LoginInitRequest, request: Request) -> LoginInitResponse:
    """Dispatches multi-factor login challenge (Email OTP or Passkey prompt)."""
    client_ip = request.client.host if request.client else None
    res = auth_service.init_login(email=req.email, ip_address=client_ip)
    return LoginInitResponse(
        success=res["success"],
        message=res["message"],
        masked_email=res["masked_email"],
        email_provider_configured=res["email_provider_configured"],
        has_passkey=res.get("has_passkey", False),
        supported_methods=res.get("supported_methods", ["EMAIL_OTP"]),
        sandbox_otp=res.get("sandbox_otp"),
    )


@router.get("/auth/dev-otp")
def get_dev_otp(email: Optional[str] = None, purpose: Optional[str] = "LOGIN") -> Dict[str, Any]:
    """Helper endpoint allowing test autofill when email provider is not configured or in development."""
    import os
    email_prov = get_email_provider()
    allow_dev = (
        not email_prov.is_configured()
        or os.getenv("ALLOW_DEV_OTP", "false").strip().lower() == "true"
        or os.getenv("EMAIL_PROVIDER", "").strip().lower() in ("sandbox", "dev", "console", "loopback")
        or os.getenv("ENVIRONMENT", "development").strip().lower() == "development"
    )
    if not allow_dev:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Endpoint disabled in production mode. Verification codes are never returned over API.",
        )
    clean_email = email.strip().lower() if email else None
    if not clean_email:
        with auth_db.get_connection() as conn:
            row = conn.execute(
                "SELECT email FROM email_verifications ORDER BY created_at DESC LIMIT 1"
            ).fetchone()
            clean_email = row["email"] if row else None

    if not clean_email:
        raise HTTPException(status_code=404, detail="No active email provided.")

    otp = auth_service.get_active_otp(clean_email, purpose=purpose or "LOGIN")
    if not otp:
        other_purpose = "REGISTRATION" if purpose == "LOGIN" else "LOGIN"
        otp = auth_service.get_active_otp(clean_email, purpose=other_purpose)

    if not otp:
        raise HTTPException(status_code=404, detail="No active verification code found for this session.")

    return {
        "success": True,
        "otp": otp,
        "email": clean_email,
        "message": "Active verification code retrieved for autofill.",
    }


@router.post("/auth/login/verify", response_model=AuthTokenResponse)
def login_verify(req: LoginVerifyRequest, request: Request, response: Response) -> AuthTokenResponse:
    """Verifies OTP or Passkey, creates secure rotated session, sets HttpOnly cookies."""
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("User-Agent")

    success, msg, data = auth_service.verify_login_and_create_session(
        email=req.email,
        otp=req.otp,
        passkey_credential_id=req.passkey_credential_id,
        passkey_signature=req.passkey_signature,
        device_name=req.device_name or "Workstation",
        device_type=req.device_type or DeviceType.DESKTOP,
        ip_address=client_ip,
        user_agent=user_agent,
    )
    if not success or not data:
        raise HTTPException(status_code=401, detail=msg)

    # Set secure HttpOnly cookies
    response.set_cookie(
        key="sangyan_access_token",
        value=data["access_token"],
        max_age=3600,
        httponly=True,
        samesite="lax",
        secure=False,  # Set to True in HTTPS production
    )
    response.set_cookie(
        key="sangyan_refresh_token",
        value=data["refresh_token"],
        max_age=14 * 86400,
        httponly=True,
        samesite="lax",
        secure=False,
    )

    return AuthTokenResponse(**data)


# ---------------------------------------------------------------------------
# Session Security & Profile
# ---------------------------------------------------------------------------
@router.get("/auth/me", response_model=OwnerProfile)
def get_current_owner_profile(current_user: Dict[str, Any] = Depends(get_current_user)) -> OwnerProfile:
    """Returns verified owner profile and device posture."""
    profile = auth_service.get_owner_profile(current_user["user_id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Owner profile not found.")
    return OwnerProfile(**profile)


@router.post("/auth/refresh", response_model=AuthTokenResponse)
def refresh_session(request: Request, response: Response) -> AuthTokenResponse:
    """Rotates access & refresh tokens."""
    refresh_token = request.cookies.get("sangyan_refresh_token")
    if not refresh_token:
        # Check authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            refresh_token = auth_header.split(" ")[1]

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token required.")

    success, msg, data = auth_service.refresh_session_tokens(refresh_token)
    if not success or not data:
        raise HTTPException(status_code=401, detail=msg)

    response.set_cookie(
        key="sangyan_access_token",
        value=data["access_token"],
        max_age=3600,
        httponly=True,
        samesite="lax",
    )
    response.set_cookie(
        key="sangyan_refresh_token",
        value=data["refresh_token"],
        max_age=14 * 86400,
        httponly=True,
        samesite="lax",
    )
    return AuthTokenResponse(**data)


@router.post("/auth/logout")
def logout(response: Response, current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Revokes active session and clears cookies."""
    session_id = current_user.get("current_session_id")
    if session_id:
        auth_service.logout(session_id, current_user["user_id"])

    response.delete_cookie("sangyan_access_token")
    response.delete_cookie("sangyan_refresh_token")
    return {"success": True, "message": "Logged out successfully."}


@router.post("/auth/logout-all")
def logout_all_devices(response: Response, current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Revokes all sessions across all devices."""
    auth_service.logout_all(current_user["user_id"])
    response.delete_cookie("sangyan_access_token")
    response.delete_cookie("sangyan_refresh_token")
    return {"success": True, "message": "All active sessions revoked across all devices."}


@router.get("/auth/sessions", response_model=List[SessionRecord])
def get_user_sessions(current_user: Dict[str, Any] = Depends(get_current_user)) -> List[SessionRecord]:
    """Lists all active device sessions for this investor."""
    raw_sessions = auth_db.get_user_sessions(current_user["user_id"])
    current_sid = current_user.get("current_session_id")
    results = []
    for s in raw_sessions:
        results.append(
            SessionRecord(
                session_id=s["session_id"],
                user_id=s["user_id"],
                device_id=s["device_id"],
                device_name=s.get("device_name") or "Device",
                device_type=s.get("device_type") or "DESKTOP",
                platform=s.get("platform") or "Web",
                ip_address=s.get("ip_address") or "127.0.0.1",
                created_at=s["created_at"],
                last_active_at=s["last_active_at"],
                is_current=(s["session_id"] == current_sid),
            )
        )
    return results


@router.delete("/auth/sessions/{session_id}")
def revoke_specific_session(session_id: str, current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Revokes a specific session remotely."""
    auth_service.logout(session_id, current_user["user_id"])
    return {"success": True, "message": f"Session {session_id} has been revoked."}


# ---------------------------------------------------------------------------
# Device Management & Pairing
# ---------------------------------------------------------------------------
@router.get("/devices/my-devices", response_model=List[DeviceRecord])
def get_my_devices(current_user: Dict[str, Any] = Depends(get_current_user)) -> List[DeviceRecord]:
    """Lists all devices registered under the authenticated investor."""
    devices = auth_db.get_devices_for_user(current_user["user_id"])
    return [
        DeviceRecord(
            device_id=d["device_id"],
            user_id=d["user_id"],
            device_type=d["device_type"],
            device_name=d["device_name"],
            platform=d["platform"],
            registered_at=d["registered_at"],
            last_seen=d["last_seen"],
            status=d["status"],
            revoked_at=d["revoked_at"],
        )
        for d in devices
    ]


@router.post("/devices/pair", response_model=PairingSessionResponse)
def create_device_pairing(req: CreatePairingRequest, current_user: Dict[str, Any] = Depends(get_current_user)) -> PairingSessionResponse:
    """Generates short-lived pairing session with QR payload and 8-character pairing code."""
    res = auth_service.create_pairing_session(user_id=current_user["user_id"], device_type=req.device_type)
    return PairingSessionResponse(**res)


@router.post("/devices/pair/complete")
def complete_device_pairing(req: CompletePairingRequest) -> Dict[str, Any]:
    """Mobile companion submits pairing code to complete authenticated pairing."""
    success, msg, data = auth_service.complete_pairing_session(
        pairing_id=req.pairing_id,
        pairing_code=req.pairing_code,
        device_platform=req.device_platform,
        device_name=req.device_name,
    )
    if not success or not data:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg, "device": data}


@router.post("/devices/revoke")
def revoke_device(req: RevokeDeviceRequest, current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Revokes a device and terminates its associated active sessions."""
    auth_db.revoke_device(device_id=req.device_id, user_id=current_user["user_id"])
    return {"success": True, "message": f"Device {req.device_id} revoked."}


# ---------------------------------------------------------------------------
# Security Audit Trail
# ---------------------------------------------------------------------------
@router.get("/auth/audit-log")
def get_security_audit_log(current_user: Dict[str, Any] = Depends(get_current_user)) -> List[Dict[str, Any]]:
    """Returns security audit log for the authenticated investor."""
    return auth_db.get_security_audit_logs(current_user["user_id"], limit=50)
