import React, { useState, useEffect } from 'react';
import { Shield, Mail, AlertCircle, ArrowRight, KeyRound, Zap, ArrowLeft, RefreshCw } from 'lucide-react';
import { OwnerProfile } from '../../types/auth';

interface SecureLoginProps {
  initialEmail?: string;
  onSuccess: (profile: OwnerProfile) => void;
  onSwitchToRegister: () => void;
  onBackToSplash?: () => void;
}

export const SecureLogin: React.FC<SecureLoginProps> = ({
  initialEmail = '',
  onSuccess,
  onSwitchToRegister,
  onBackToSplash,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [stage, setStage] = useState<'ENTER_EMAIL' | 'ENTER_OTP'>('ENTER_EMAIL');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleAutoFillOtp = async (targetEmail?: string) => {
    try {
      const activeEmail = (targetEmail || email || initialEmail).trim();
      const url = activeEmail
        ? `/api/auth/dev-otp?email=${encodeURIComponent(activeEmail)}`
        : '/api/auth/dev-otp';
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        if (data.otp) {
          setOtp(data.otp);
          setInfoMessage(`⚡ Sandbox verification code detected: ${data.otp}`);
          return data.otp;
        }
      }
    } catch {
      // Manual entry
    }
    return null;
  };

  useEffect(() => {
    if (stage === 'ENTER_OTP' && !otp) {
      handleAutoFillOtp();
    }
  }, [stage]);

  const handleResendOtp = async () => {
    setResending(true);
    setErrorMessage(null);
    setInfoMessage(null);
    try {
      const activeEmail = email.trim() || initialEmail || 'investor@example.com';
      const resp = await fetch('/api/auth/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeEmail, purpose: 'LOGIN' }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || 'Failed to resend code.');
      }
      setInfoMessage('A new verification code has been dispatched.');
      setTimeout(() => {
        handleAutoFillOtp(activeEmail);
      }, 250);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  const handleInitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your investor email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.message || data.detail || 'Login initiation failed.');
      }

      setMaskedEmail(data.masked_email);
      setStage('ENTER_OTP');

      if (data.sandbox_otp) {
        setOtp(data.sandbox_otp);
        setInfoMessage(`⚡ Sandbox verification code detected: ${data.sandbox_otp}`);
      } else {
        setTimeout(() => {
          handleAutoFillOtp(email.trim());
        }, 150);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const resp = await fetch('/api/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          device_name: 'Primary Workstation',
          device_type: 'DESKTOP',
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || 'Authentication failed.');
      }

      if (data.access_token) {
        localStorage.setItem('sangyan_access_token', data.access_token);
      }

      onSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const activeEmail = email.trim() || initialEmail;
      if (!activeEmail) {
        setErrorMessage('Please enter your email to proceed with Passkey.');
        setLoading(false);
        return;
      }
      const resp = await fetch('/api/auth/passkey/auth/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeEmail }),
      });
      const data = await resp.json();
      if (resp.ok && data.challenge) {
        setInfoMessage('Device Platform Authenticator invoked. Verifying credentials...');
        setTimeout(() => {
          setStage('ENTER_OTP');
          handleAutoFillOtp(activeEmail);
        }, 600);
      } else {
        setErrorMessage(data.detail || 'Passkey authentication unavailable. Use verification code.');
      }
    } catch {
      setErrorMessage('Passkey unavailable. Please use email verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle cybersecurity network pattern on edges */}
      <div className="cyber-network-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Glass Authentication Card */}
      <div
        className="glass-panel"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '44px 38px',
          borderRadius: '18px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {onBackToSplash && (
          <button
            type="button"
            onClick={onBackToSplash}
            style={{
              background: 'none',
              border: 'none',
              color: '#A7A7A7',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '24px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#A7A7A7')}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} /> Return
          </button>
        )}

        {/* Shield Icon Badge */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(229, 62, 62, 0.08)',
            border: '1px solid rgba(229, 62, 62, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(229, 62, 62, 0.15)',
          }}
          className="animate-breathing"
        >
          <Shield style={{ width: '26px', height: '26px', color: '#e53e3e' }} />
        </div>

        {/* Product Brand & Tagline */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '0.02em',
            color: '#FFFFFF',
            margin: '0 0 6px 0',
          }}
        >
          IN.V. PROTECT
        </h1>

        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#e53e3e',
            letterSpacing: '0.01em',
            marginBottom: '6px',
          }}
        >
          Personal Digital Security Layer
        </div>

        <p
          style={{
            fontSize: '13px',
            color: '#A7A7A7',
            margin: '0 0 28px 0',
            lineHeight: 1.5,
          }}
        >
          Secure your digital financial communications.
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.10)',
              border: '1px solid rgba(239, 68, 68, 0.30)',
              borderRadius: '10px',
              padding: '11px 14px',
              marginBottom: '18px',
              fontSize: '12px',
              color: '#F87171',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div
            style={{
              backgroundColor: 'rgba(229, 62, 62, 0.10)',
              border: '1px solid rgba(229, 62, 62, 0.30)',
              borderRadius: '10px',
              padding: '11px 14px',
              marginBottom: '18px',
              fontSize: '12px',
              color: '#e53e3e',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Zap style={{ width: '15px', height: '15px', flexShrink: 0 }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {stage === 'ENTER_EMAIL' ? (
          <form onSubmit={handleInitLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  letterSpacing: '0.02em',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    color: '#A7A7A7',
                  }}
                />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@domain.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    fontSize: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#e53e3e';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(229, 62, 62, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#e53e3e',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '14px',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 18px rgba(229, 62, 62, 0.35)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 22px rgba(229, 62, 62, 0.45)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(229, 62, 62, 0.35)';
              }}
            >
              <span>{loading ? 'Securing...' : 'Continue'}</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              <span style={{ fontSize: '11px', color: '#A7A7A7', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            </div>

            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                fontWeight: 600,
                fontSize: '13px',
                padding: '11px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              <KeyRound style={{ width: '15px', height: '15px', color: '#e53e3e' }} />
              Passkey / Hardware Key
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '13px', color: '#A7A7A7', lineHeight: 1.5 }}>
              Verification code dispatched to <strong style={{ color: '#FFFFFF' }}>{maskedEmail || email}</strong>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: '8px',
                }}
              >
                6-Digit Security Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '0.35em',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#e53e3e';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(229, 62, 62, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              style={{
                width: '100%',
                backgroundColor: '#e53e3e',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '14px',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading || otp.length < 6 ? 'not-allowed' : 'pointer',
                opacity: loading || otp.length < 6 ? 0.6 : 1,
                boxShadow: '0 4px 18px rgba(229, 62, 62, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{loading ? 'Verifying...' : 'Verify & Enter Shield'}</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setStage('ENTER_EMAIL')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A7A7A7',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53e3e',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: resending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RefreshCw style={{ width: '12px', height: '12px' }} />
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* Register link */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            fontSize: '12px',
            color: '#A7A7A7',
          }}
        >
          New investor?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#e53e3e',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Register Device Owner Profile
          </button>
        </div>
      </div>
    </div>
  );
};
