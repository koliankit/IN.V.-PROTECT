"""
Cryptographic Security Utilities for Sangyan AI Investor Shield.
Provides cryptographically secure random OTP generation, salted HMAC-SHA256 hashing,
timing-safe verification, JWT access/refresh token management, and email masking.
Zero plaintext storage of passwords, OTPs, or authentication tokens.
"""
import hashlib
import hmac
import os
import secrets
import string
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple

import jwt

# Fallback internal secret key if not provided via environment
_DEFAULT_SECRET = "sangyan-investor-shield-production-secret-key-change-in-env-9921"


class SecurityCrypto:
    def __init__(self, secret_key: Optional[str] = None):
        self.secret_key = secret_key or os.getenv("JWT_SECRET_KEY", _DEFAULT_SECRET)
        self.jwt_algorithm = "HS256"

    # -----------------------------------------------------------------------
    # Cryptographic OTP Generation & Salting
    # -----------------------------------------------------------------------
    @staticmethod
    def generate_secure_otp(length: int = 6) -> str:
        """Generates a cryptographically secure random numerical OTP using OS entropy."""
        digits = string.digits
        return "".join(secrets.choice(digits) for _ in range(length))

    @staticmethod
    def generate_salt(length: int = 32) -> str:
        """Generates a cryptographically secure hex salt."""
        return secrets.token_hex(length // 2)

    def hash_otp(self, otp: str, salt: str) -> str:
        """Hashes an OTP with a unique salt using HMAC-SHA256."""
        key = (self.secret_key + salt).encode("utf-8")
        return hmac.new(key, otp.strip().encode("utf-8"), hashlib.sha256).hexdigest()

    def verify_otp_hash(self, candidate_otp: str, salt: str, expected_hash: str) -> bool:
        """Performs a constant-time comparison of the candidate OTP hash against expected hash."""
        computed_hash = self.hash_otp(candidate_otp, salt)
        return hmac.compare_digest(computed_hash, expected_hash)

    # -----------------------------------------------------------------------
    # Hash for Tokens & Pairing Codes
    # -----------------------------------------------------------------------
    @staticmethod
    def hash_token(raw_token: str) -> str:
        """Hashes a session token or pairing code for secure DB storage."""
        return hashlib.sha256(raw_token.strip().encode("utf-8")).hexdigest()

    @staticmethod
    def generate_random_token(bytes_count: int = 32) -> str:
        """Generates a URL-safe cryptographically secure random token."""
        return secrets.token_urlsafe(bytes_count)

    @staticmethod
    def generate_pairing_code() -> str:
        """Generates an 8-character human-friendly alphanumeric pairing code (e.g. 'SNGY-8492')."""
        chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        part1 = "".join(secrets.choice(chars) for _ in range(4))
        part2 = "".join(secrets.choice(chars) for _ in range(4))
        return f"{part1}-{part2}"

    # -----------------------------------------------------------------------
    # JWT Access & Refresh Token Management
    # -----------------------------------------------------------------------
    def create_access_token(
        self,
        user_id: str,
        email: str,
        session_id: str,
        device_id: str,
        expires_delta_minutes: int = 60,
    ) -> str:
        """Issues a signed JWT access token for API authorization."""
        now = datetime.now(timezone.utc)
        expire = now + timedelta(minutes=expires_delta_minutes)
        payload = {
            "sub": user_id,
            "email": email,
            "session_id": session_id,
            "device_id": device_id,
            "type": "access",
            "jti": secrets.token_hex(8),
            "iat": int(now.timestamp()),
            "exp": int(expire.timestamp()),
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.jwt_algorithm)

    def create_refresh_token(
        self,
        user_id: str,
        session_id: str,
        expires_delta_days: int = 14,
    ) -> str:
        """Issues a signed JWT refresh token for session rotation."""
        now = datetime.now(timezone.utc)
        expire = now + timedelta(days=expires_delta_days)
        payload = {
            "sub": user_id,
            "session_id": session_id,
            "type": "refresh",
            "jti": secrets.token_hex(8),
            "iat": int(now.timestamp()),
            "exp": int(expire.timestamp()),
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.jwt_algorithm)

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validates and decodes a signed JWT token; returns None if invalid or expired."""
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.jwt_algorithm])
        except (jwt.PyJWTError, Exception):
            return None

    # -----------------------------------------------------------------------
    # Privacy & Email Masking
    # -----------------------------------------------------------------------
    @staticmethod
    def mask_email(email: str) -> str:
        """Masks an email for safe display (e.g. investor@example.com -> i***r@example.com)."""
        if not email or "@" not in email:
            return "******@unknown.com"
        parts = email.split("@")
        name, domain = parts[0], parts[1]
        if len(name) <= 2:
            masked_name = name[0] + "***"
        else:
            masked_name = name[0] + "***" + name[-1]
        return f"{masked_name}@{domain}"


# Singleton crypto helper
security_crypto = SecurityCrypto()
