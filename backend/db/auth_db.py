"""
Database Repository for Authentication, Verification, Devices, and Sessions.
Implements parameterized SQLite queries, transactional commits, and audit logging.
"""
from contextlib import contextmanager
import json
import os
import sqlite3
from typing import Any, Dict, Generator, List, Optional
from datetime import datetime, timezone

from backend.schemas.auth import (
    AccountStatus,
    DeviceRecord,
    DeviceStatusEnum,
    DeviceType,
    OwnerProfile,
    SessionRecord,
)


class AuthDatabaseManager:
    def __init__(self, db_path: Optional[str] = None):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        source_db = os.path.join(base_dir, "data", "sangyan_auth.db")
        if os.getenv("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
            default_db_dir = "/tmp"
            tmp_db = os.path.join(default_db_dir, "sangyan_auth.db")
            if not os.path.exists(tmp_db) and os.path.exists(source_db):
                import shutil
                try:
                    shutil.copy2(source_db, tmp_db)
                except Exception:
                    pass
            self.db_path = db_path or os.getenv("SANGYAN_AUTH_DB_PATH") or tmp_db
        else:
            self.db_path = db_path or os.getenv("SANGYAN_AUTH_DB_PATH") or source_db
        self.schema_path = os.path.join(base_dir, "backend", "db", "auth_schema.sql")
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.init_db()

    @contextmanager
    def get_connection(self) -> Generator[sqlite3.Connection, None, None]:
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def init_db(self) -> None:
        if os.path.isfile(self.schema_path):
            with open(self.schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            with self.get_connection() as conn:
                conn.executescript(schema_sql)

    # -----------------------------------------------------------------------
    # Users
    # -----------------------------------------------------------------------
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
            return dict(row) if row else None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),)).fetchone()
            return dict(row) if row else None

    def get_owner_count(self) -> int:
        with self.get_connection() as conn:
            row = conn.execute("SELECT COUNT(*) as cnt FROM users").fetchone()
            return int(row["cnt"]) if row else 0

    def create_user(
        self,
        user_id: str,
        full_name: str,
        email: str,
        account_status: str = "PENDING_EMAIL",
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO users (
                    user_id, full_name, email, email_verified, identity_verified,
                    face_verification_status, account_status, failed_login_attempts,
                    locked_until, mfa_enabled, security_version, created_at, updated_at, last_login_at
                ) VALUES (?, ?, ?, 0, 0, 'NOT_STARTED', ?, 0, NULL, 1, 1, ?, ?, NULL)
                """,
                (user_id, full_name.strip(), email.strip().lower(), account_status, now, now),
            )
        return self.get_user_by_id(user_id)  # type: ignore

    def update_user_status(
        self,
        user_id: str,
        account_status: Optional[str] = None,
        email_verified: Optional[bool] = None,
        identity_verified: Optional[bool] = None,
        face_status: Optional[str] = None,
        last_login_at: Optional[str] = None,
        failed_attempts: Optional[int] = None,
        locked_until: Optional[str] = None,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        updates = ["updated_at = ?"]
        params: List[Any] = [now]

        if account_status is not None:
            updates.append("account_status = ?")
            params.append(account_status)
        if email_verified is not None:
            updates.append("email_verified = ?")
            params.append(1 if email_verified else 0)
        if identity_verified is not None:
            updates.append("identity_verified = ?")
            params.append(1 if identity_verified else 0)
        if face_status is not None:
            updates.append("face_verification_status = ?")
            params.append(face_status)
        if last_login_at is not None:
            updates.append("last_login_at = ?")
            params.append(last_login_at)
        if failed_attempts is not None:
            updates.append("failed_login_attempts = ?")
            params.append(failed_attempts)
        if locked_until is not None:
            updates.append("locked_until = ?")
            params.append(locked_until)

        params.append(user_id)
        query = f"UPDATE users SET {', '.join(updates)} WHERE user_id = ?"
        with self.get_connection() as conn:
            conn.execute(query, tuple(params))

    # -----------------------------------------------------------------------
    # Email Verifications / OTPs
    # -----------------------------------------------------------------------
    def create_email_verification(
        self,
        verif_id: str,
        user_id: str,
        email: str,
        otp_hash: str,
        salt: str,
        expires_at: str,
        resend_available_at: str,
        purpose: str = "REGISTRATION",
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO email_verifications (
                    id, user_id, email, purpose, otp_hash, salt, attempts_count,
                    max_attempts, expires_at, resend_available_at, verified_at, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, 0, 5, ?, ?, NULL, ?)
                """,
                (verif_id, user_id, email.lower(), purpose, otp_hash, salt, expires_at, resend_available_at, now),
            )

    def get_latest_email_verification(self, email: str, purpose: str = "REGISTRATION") -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute(
                """
                SELECT * FROM email_verifications
                WHERE LOWER(email) = LOWER(?) AND purpose = ?
                ORDER BY created_at DESC LIMIT 1
                """,
                (email.strip(), purpose),
            ).fetchone()
            return dict(row) if row else None

    def increment_otp_attempts(self, verif_id: str) -> int:
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE email_verifications SET attempts_count = attempts_count + 1 WHERE id = ?",
                (verif_id,),
            )
            row = conn.execute("SELECT attempts_count FROM email_verifications WHERE id = ?", (verif_id,)).fetchone()
            return int(row["attempts_count"]) if row else 1

    def mark_email_verified(self, verif_id: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute("UPDATE email_verifications SET verified_at = ? WHERE id = ?", (now, verif_id))

    # -----------------------------------------------------------------------
    # Identity & Liveness Sessions
    # -----------------------------------------------------------------------
    def create_identity_session(
        self,
        session_id: str,
        user_id: str,
        provider: str,
        biometric_consent_given: bool = True,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO identity_verifications (
                    session_id, user_id, provider, status, liveness_score,
                    biometric_consent_given, failure_reason, created_at, completed_at
                ) VALUES (?, ?, ?, 'PENDING', 0.0, ?, NULL, ?, NULL)
                """,
                (session_id, user_id, provider, 1 if biometric_consent_given else 0, now),
            )

    def update_identity_session(
        self,
        session_id: str,
        status: str,
        liveness_score: float = 1.0,
        failure_reason: Optional[str] = None,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                UPDATE identity_verifications
                SET status = ?, liveness_score = ?, failure_reason = ?, completed_at = ?
                WHERE session_id = ?
                """,
                (status, liveness_score, failure_reason, now, session_id),
            )

    def get_identity_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM identity_verifications WHERE session_id = ?", (session_id,)).fetchone()
            return dict(row) if row else None

    # -----------------------------------------------------------------------
    # Devices
    # -----------------------------------------------------------------------
    def register_device(
        self,
        device_id: str,
        user_id: str,
        device_type: str,
        device_name: str,
        platform: str,
        status: str = "ACTIVE",
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO devices (
                    device_id, user_id, device_type, device_name, platform,
                    registered_at, last_seen, status, revoked_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)
                """,
                (device_id, user_id, device_type, device_name, platform, now, now, status),
            )

    def get_devices_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM devices WHERE user_id = ? ORDER BY registered_at DESC",
                (user_id,),
            ).fetchall()
            return [dict(r) for r in rows]

    def revoke_device(self, device_id: str, user_id: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE devices SET status = 'REVOKED', revoked_at = ? WHERE device_id = ? AND user_id = ?",
                (now, device_id, user_id),
            )
            # Invalidate any active sessions for this device
            conn.execute(
                "UPDATE sessions SET is_revoked = 1 WHERE device_id = ? AND user_id = ?",
                (device_id, user_id),
            )

    # -----------------------------------------------------------------------
    # Sessions
    # -----------------------------------------------------------------------
    def create_session(
        self,
        session_id: str,
        user_id: str,
        device_id: str,
        token_hash: str,
        refresh_token_hash: str,
        expires_at: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO sessions (
                    session_id, user_id, device_id, token_hash, refresh_token_hash,
                    ip_address, user_agent, created_at, expires_at, last_active_at, is_revoked
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
                """,
                (session_id, user_id, device_id, token_hash, refresh_token_hash, ip_address, user_agent, now, expires_at, now),
            )

    def get_session_by_token_hash(self, token_hash: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute(
                "SELECT * FROM sessions WHERE token_hash = ? AND is_revoked = 0",
                (token_hash,),
            ).fetchone()
            return dict(row) if row else None

    def get_session_by_refresh_token_hash(self, refresh_token_hash: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute(
                "SELECT * FROM sessions WHERE refresh_token_hash = ? AND is_revoked = 0",
                (refresh_token_hash,),
            ).fetchone()
            return dict(row) if row else None

    def update_session_activity(self, session_id: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute("UPDATE sessions SET last_active_at = ? WHERE session_id = ?", (now, session_id))

    def revoke_session(self, session_id: str, user_id: str) -> None:
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE sessions SET is_revoked = 1 WHERE session_id = ? AND user_id = ?",
                (session_id, user_id),
            )

    def revoke_all_sessions(self, user_id: str) -> None:
        with self.get_connection() as conn:
            conn.execute("UPDATE sessions SET is_revoked = 1 WHERE user_id = ?", (user_id,))

    def get_user_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT s.*, d.device_name, d.device_type, d.platform
                FROM sessions s
                LEFT JOIN devices d ON s.device_id = d.device_id
                WHERE s.user_id = ? AND s.is_revoked = 0
                ORDER BY s.last_active_at DESC
                """,
                (user_id,),
            ).fetchall()
            return [dict(r) for r in rows]

    # -----------------------------------------------------------------------
    # Passkeys
    # -----------------------------------------------------------------------
    def register_passkey(self, credential_id: str, user_id: str, public_key_pem: str, device_name: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO passkeys (
                    credential_id, user_id, public_key_pem, sign_count, device_name, created_at
                ) VALUES (?, ?, ?, 0, ?, ?)
                """,
                (credential_id, user_id, public_key_pem, device_name, now),
            )

    def get_passkeys_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM passkeys WHERE user_id = ?", (user_id,)).fetchall()
            return [dict(r) for r in rows]

    def get_passkey_by_id(self, credential_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM passkeys WHERE credential_id = ?", (credential_id,)).fetchone()
            return dict(row) if row else None

    # -----------------------------------------------------------------------
    # Pairing Sessions
    # -----------------------------------------------------------------------
    def create_pairing_session(
        self,
        pairing_id: str,
        user_id: str,
        pairing_code_hash: str,
        device_type: str,
        expires_at: str,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO pairing_sessions (
                    pairing_id, user_id, pairing_code_hash, device_type, status, expires_at, created_at, completed_at
                ) VALUES (?, ?, ?, ?, 'PENDING', ?, ?, NULL)
                """,
                (pairing_id, user_id, pairing_code_hash, device_type, expires_at, now),
            )

    def get_pairing_session(self, pairing_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM pairing_sessions WHERE pairing_id = ?", (pairing_id,)).fetchone()
            return dict(row) if row else None

    def complete_pairing_session(self, pairing_id: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE pairing_sessions SET status = 'COMPLETED', completed_at = ? WHERE pairing_id = ?",
                (now, pairing_id),
            )

    # -----------------------------------------------------------------------
    # Security Audit Log
    # -----------------------------------------------------------------------
    def log_security_event(
        self,
        event_id: str,
        user_id: str,
        event_type: str,
        device_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        meta_json = json.dumps(metadata or {})
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO security_audit_log (
                    event_id, user_id, event_type, timestamp, device_id, ip_address, metadata_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (event_id, user_id, event_type, now, device_id, ip_address, meta_json),
            )

    def get_security_audit_logs(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            rows = conn.execute(
                """
                SELECT * FROM security_audit_log
                WHERE user_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
                """,
                (user_id, limit),
            ).fetchall()
            results = []
            for r in rows:
                d = dict(r)
                if d.get("metadata_json"):
                    try:
                        d["metadata"] = json.loads(d["metadata_json"])
                    except Exception:
                        d["metadata"] = {}
                results.append(d)
            return results

    # -----------------------------------------------------------------------
    # Consents
    # -----------------------------------------------------------------------
    def record_consent(self, consent_id: str, user_id: str, consent_type: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            conn.execute(
                "INSERT INTO consents (consent_id, user_id, consent_type, granted_at, revoked_at) VALUES (?, ?, ?, ?, NULL)",
                (consent_id, user_id, consent_type, now),
            )


auth_db = AuthDatabaseManager()
