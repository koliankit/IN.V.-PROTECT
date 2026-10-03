-- ============================================================================
-- SANGYAN AI INVESTOR SHIELD — PRODUCTION AUTHENTICATION & OWNER VERIFICATION
-- Relational SQLite / PostgreSQL compatible DDL Schema
-- Enforces zero plain-text passwords, zero raw OTPs, zero raw biometric storage.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Owner & User Accounts
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT 0,
    identity_verified BOOLEAN NOT NULL DEFAULT 0,
    face_verification_status VARCHAR(64) NOT NULL DEFAULT 'NOT_STARTED',
    account_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_EMAIL',
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    mfa_enabled BOOLEAN NOT NULL DEFAULT 1,
    security_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(account_status);

-- 2. Cryptographic Salted & Hashed Email Verifications (OTPs)
CREATE TABLE IF NOT EXISTS email_verifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    purpose VARCHAR(32) NOT NULL DEFAULT 'REGISTRATION',
    otp_hash VARCHAR(128) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    attempts_count INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    expires_at TIMESTAMP NOT NULL,
    resend_available_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_verif_user ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verif_email ON email_verifications(email);

-- 3. Minimized Identity & Liveness Verification Sessions (Zero Raw Biometrics)
CREATE TABLE IF NOT EXISTS identity_verifications (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    liveness_score REAL DEFAULT 0.0,
    biometric_consent_given BOOLEAN NOT NULL DEFAULT 0,
    failure_reason TEXT,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ident_verif_user ON identity_verifications(user_id);

-- 4. Protected Investor Devices
CREATE TABLE IF NOT EXISTS devices (
    device_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    device_type VARCHAR(32) NOT NULL,
    device_name VARCHAR(128) NOT NULL,
    platform VARCHAR(64) NOT NULL,
    registered_at TIMESTAMP NOT NULL,
    last_seen TIMESTAMP NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);

-- 5. Active Protected Sessions with Rotation
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    device_id VARCHAR(64) NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    refresh_token_hash VARCHAR(128) NOT NULL,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_active_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);

-- 6. Passkeys / WebAuthn Credentials
CREATE TABLE IF NOT EXISTS passkeys (
    credential_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    public_key_pem TEXT NOT NULL,
    sign_count INTEGER NOT NULL DEFAULT 0,
    device_name VARCHAR(128) NOT NULL DEFAULT 'Device Authenticator',
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_passkeys_user ON passkeys(user_id);

-- 7. Secure Ephemeral Device Pairing Sessions
CREATE TABLE IF NOT EXISTS pairing_sessions (
    pairing_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    pairing_code_hash VARCHAR(128) NOT NULL,
    device_type VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pairing_user ON pairing_sessions(user_id);

-- 8. Tamper-Evident Security Audit Log
CREATE TABLE IF NOT EXISTS security_audit_log (
    event_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    device_id VARCHAR(64),
    ip_address VARCHAR(64),
    metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_sec_audit_user ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sec_audit_event ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_sec_audit_time ON security_audit_log(timestamp);

-- 9. Explicit Investor Consents
CREATE TABLE IF NOT EXISTS consents (
    consent_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    consent_type VARCHAR(64) NOT NULL,
    granted_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 10. Connected External Financial & Communication Channels
CREATE TABLE IF NOT EXISTS connected_integrations (
    integration_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NOT_CONFIGURED',
    provider_name VARCHAR(128) NOT NULL,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conn_int_user ON connected_integrations(user_id);
