/**
 * Authentication and Owner Verification Types for Sangyan AI Investor Shield.
 */

export type AuthFlowStep =
  | 'CHECKING_STATUS'
  | 'FIRST_LAUNCH_REGISTER'
  | 'EMAIL_OTP_VERIFY'
  | 'IDENTITY_LIVENESS_CONSENT'
  | 'IDENTITY_LIVENESS_VERIFY'
  | 'SECURE_LOGIN'
  | 'AUTHENTICATED';

export type AccountStatus =
  | 'PENDING_EMAIL'
  | 'PENDING_IDENTITY'
  | 'ACTIVE'
  | 'LOCKED'
  | 'SUSPENDED'
  | 'DEACTIVATED';

export interface OwnerProfile {
  user_id: string;
  full_name: string;
  email: string;
  masked_email: string;
  email_verified: boolean;
  identity_verified: boolean;
  face_verification_status: string;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  failed_login_attempts: number;
  locked_until?: string;
  mfa_enabled: boolean;
  security_version: number;
  active_devices_count: number;
  active_sessions_count: number;
}

export interface RegisterResponse {
  user_id: string;
  full_name: string;
  email: string;
  masked_email: string;
  account_status: AccountStatus;
  message: string;
  otp_sent: boolean;
  email_provider_configured: boolean;
  sandbox_otp?: string | null;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  masked_email: string;
  expires_in_seconds: number;
  resend_cooldown_seconds: number;
  email_provider_configured: boolean;
  sandbox_otp?: string | null;
}

export interface LoginInitResponse {
  success: boolean;
  message: string;
  masked_email: string;
  email_provider_configured: boolean;
  has_passkey: boolean;
  supported_methods: string[];
  sandbox_otp?: string | null;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  email_verified: boolean;
  next_step: string;
}

export interface LivenessSessionResponse {
  session_id: string;
  user_id: string;
  provider: string;
  status: string;
  challenge: {
    challenge_id?: string;
    required_gesture?: string;
    timeout_seconds?: number;
    min_lighting_score?: number;
  };
  expires_in_seconds: number;
  provider_configured: boolean;
  message?: string;
}

export interface VerifyLivenessResponse {
  success: boolean;
  session_id: string;
  identity_verified: boolean;
  status: string;
  provider: string;
  message: string;
  timestamp: string;
}

export interface DeviceRecord {
  device_id: string;
  user_id: string;
  device_type: 'DESKTOP' | 'MOBILE' | 'SMARTWATCH' | 'BROWSER_EXTENSION';
  device_name: string;
  platform: string;
  registered_at: string;
  last_seen: string;
  status: 'ACTIVE' | 'REVOKED' | 'PENDING';
  revoked_at?: string;
}

export interface SessionRecord {
  session_id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  platform: string;
  ip_address: string;
  created_at: string;
  last_active_at: string;
  is_current: boolean;
}

export interface PairingSessionResponse {
  pairing_id: string;
  pairing_code: string;
  expires_in_seconds: number;
  qr_payload: string;
  device_type: string;
  status: string;
}

export interface AuthSystemStatus {
  has_registered_owner: boolean;
  owners_count: number;
  email_provider_configured: boolean;
  face_provider_configured: boolean;
  webauthn_supported: boolean;
  zero_password_enforced: boolean;
  raw_biometric_storage: boolean;
}
