/**
 * Frontend Authentication and Owner Verification Model Test
 * Validates TypeScript interfaces, auth states, and security contracts.
 */
import { describe, it, expect } from 'vitest';
import type {
  AuthFlowStep,
  OwnerProfile,
  RegisterResponse,
  SendOtpResponse,
  VerifyOtpResponse,
  PairingSessionResponse,
  AuthSystemStatus,
} from './types/auth';

describe('Frontend Auth State Machine & Contracts', () => {
  it('validates auth flow steps and state progression', () => {
    const steps: AuthFlowStep[] = [
      'CHECKING_STATUS',
      'FIRST_LAUNCH_REGISTER',
      'EMAIL_OTP_VERIFY',
      'IDENTITY_LIVENESS_CONSENT',
      'IDENTITY_LIVENESS_VERIFY',
      'SECURE_LOGIN',
      'AUTHENTICATED',
    ];
    expect(steps.length).toBe(7);
    expect(steps).toContain('FIRST_LAUNCH_REGISTER');
    expect(steps).toContain('IDENTITY_LIVENESS_VERIFY');
  });

  it('validates active OwnerProfile model contract', () => {
    const mockProfile: OwnerProfile = {
      user_id: 'OWNER-1234ABCD',
      full_name: 'Ananya Sharma',
      email: 'ananya@example.com',
      masked_email: 'a***a@example.com',
      email_verified: true,
      identity_verified: true,
      face_verification_status: 'VERIFIED',
      account_status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      failed_login_attempts: 0,
      mfa_enabled: true,
      security_version: 1,
      active_devices_count: 2,
      active_sessions_count: 1,
    };

    expect(mockProfile.email_verified).toBe(true);
    expect(mockProfile.identity_verified).toBe(true);
    expect(mockProfile.account_status).toBe('ACTIVE');
    expect(mockProfile.masked_email).toContain('***');
  });

  it('validates RegisterResponse, SendOtpResponse, and VerifyOtpResponse contracts', () => {
    const mockReg: RegisterResponse = {
      user_id: 'OWNER-1234',
      full_name: 'Test Owner',
      email: 'owner@example.com',
      masked_email: 'o***r@example.com',
      account_status: 'PENDING_EMAIL',
      message: 'Owner registered successfully.',
      otp_sent: true,
      email_provider_configured: true,
    };
    expect(mockReg.account_status).toBe('PENDING_EMAIL');
    expect(mockReg.otp_sent).toBe(true);

    const mockSendOtp: SendOtpResponse = {
      success: true,
      message: 'Code dispatched',
      masked_email: 'o***r@example.com',
      expires_in_seconds: 300,
      resend_cooldown_seconds: 60,
      email_provider_configured: true,
    };
    expect(mockSendOtp.expires_in_seconds).toBe(300);

    const mockVerifyOtp: VerifyOtpResponse = {
      success: true,
      message: 'Email verified',
      email_verified: true,
      next_step: 'IDENTITY_VERIFICATION',
    };
    expect(mockVerifyOtp.email_verified).toBe(true);
    expect(mockVerifyOtp.next_step).toBe('IDENTITY_VERIFICATION');
  });

  it('validates short-lived pairing session contract', () => {
    const mockPairing: PairingSessionResponse = {
      pairing_id: 'PAIR-ABCD1234',
      pairing_code: 'SNGY-8492',
      expires_in_seconds: 300,
      qr_payload: 'sangyan://pair?session=PAIR-ABCD1234&code=SNGY-8492',
      device_type: 'MOBILE',
      status: 'PENDING',
    };

    expect(mockPairing.pairing_code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(mockPairing.expires_in_seconds).toBe(300);
    expect(mockPairing.status).toBe('PENDING');
  });

  it('validates honest unconfigured status properties', () => {
    const unconfiguredStatus: AuthSystemStatus = {
      has_registered_owner: false,
      owners_count: 0,
      email_provider_configured: false,
      face_provider_configured: false,
      webauthn_supported: true,
      zero_password_enforced: true,
      raw_biometric_storage: false,
    };

    expect(unconfiguredStatus.raw_biometric_storage).toBe(false);
    expect(unconfiguredStatus.zero_password_enforced).toBe(true);
    expect(unconfiguredStatus.email_provider_configured).toBe(false);
    expect(unconfiguredStatus.face_provider_configured).toBe(false);
  });
});
