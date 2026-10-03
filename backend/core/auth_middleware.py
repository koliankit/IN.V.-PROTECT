"""
FastAPI Security Middleware and Dependencies for Owner Authentication.
Enforces session security via Bearer tokens or HttpOnly cookies.
Zero access to protected financial shields without active verified identity.
"""
from typing import Any, Dict, Optional
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.core.security_crypto import security_crypto
from backend.db.auth_db import auth_db
from backend.schemas.auth import AccountStatus

bearer_scheme = HTTPBearer(auto_error=False)


def extract_token_from_request(request: Request, creds: Optional[HTTPAuthorizationCredentials]) -> Optional[str]:
    """Retrieves session token from Authorization header or HttpOnly cookie."""
    if creds and creds.credentials:
        return creds.credentials
    # Fallback to cookie
    return request.cookies.get("sangyan_access_token")


async def get_current_user(
    request: Request,
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Dict[str, Any]:
    """
    Validates token signature and verifies session in database.
    Raises 401 Unauthorized if invalid or revoked.
    """
    token = extract_token_from_request(request, creds)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = security_crypto.decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please authenticate again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    session_id = payload.get("session_id")

    # Verify session active in database
    token_hash = security_crypto.hash_token(token)
    session = auth_db.get_session_by_token_hash(token_hash)
    if not session or session["is_revoked"] or session["session_id"] != session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been revoked or logged out. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = auth_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
        )

    # Check lockout / suspension
    if user["account_status"] in (AccountStatus.LOCKED.value, AccountStatus.SUSPENDED.value):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account access is currently {user['account_status'].lower()}.",
        )

    # Update session activity
    auth_db.update_session_activity(session_id)

    # Attach session metadata
    user_dict = dict(user)
    user_dict["current_session_id"] = session_id
    user_dict["current_device_id"] = session["device_id"]
    return user_dict


async def require_active_owner(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Enforces that the owner has completed Email OTP and Identity Verification."""
    if not user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification pending. Complete email OTP verification first.",
        )
    if not user.get("identity_verified"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Owner identity verification required before accessing protected platform data.",
        )
    if user.get("account_status") != AccountStatus.ACTIVE.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not fully active.",
        )
    return user


async def optional_current_user(
    request: Request,
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Optional[Dict[str, Any]]:
    """Safe optional user dependency for dual-mode or demo endpoints."""
    try:
        return await get_current_user(request, creds)
    except HTTPException:
        return None
