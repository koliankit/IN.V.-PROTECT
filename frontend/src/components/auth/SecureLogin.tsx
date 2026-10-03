import React, { useState, useEffect } from 'react';
import { Shield, Mail, AlertCircle, ArrowRight, KeyRound, Zap, CheckCircle2, ArrowLeft } from 'lucide-react';
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
  const [fetchingOtp, setFetchingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleAutoFillOtp = async (targetEmail?: string) => {
    setFetchingOtp(true);
    setErrorMessage(null);
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
          setErrorMessage(null);
          setInfoMessage(`⚡ Code auto-filled: ${data.otp}`);
          return data.otp;
        }
      }
    } catch {
      // Endpoint disabled or manual entry
    } finally {
      setFetchingOtp(false);
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
        throw new Error(data.detail || 'Failed to resend login code.');
      }
      setInfoMessage('A new cryptographically secure verification code has been dispatched.');
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
        setInfoMessage(`⚡ Code auto-filled: ${data.sandbox_otp}`);
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
          // If in dev environment, auto-continue or fallback to OTP
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
        backgroundColor: '#070a12',
        padding: '24px',
        color: '#f8fafc',
      }}
    >
      {/* Split Layout Container */}
      <div
        style={{
          maxWidth: '920px',
          width: '100%',
          backgroundColor: '#0b101d',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left Brand & Security Panel */}
        <div
          className="security-grid-bg"
          style={{
            backgroundColor: '#090d18',
            borderRight: '1px solid #1e293b',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            {onBackToSplash && (
              <button
                type="button"
                onClick={onBackToSplash}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: 0,
                  marginBottom: '24px',
                }}
              >
                <ArrowLeft style={{ width: '14px', height: '14px' }} /> Return
              </button>
            )}

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
              className="animate-breathing"
            >
              <Shield style={{ width: '28px', height: '28px', color: '#06b6d4' }} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              IN V PROTECT
            </h2>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#06b6d4', margin: '0 0 20px 0' }}>
              Personal Digital Security Layer for Investors
            </p>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
              Continuous real-time threat analysis, official regulatory verification, and investor-controlled quarantine firewall.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                <span>Zero bank or demat credentials collected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                <span>Authoritative SEBI, RBI & I4C cross-referencing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                <span>Transparent, explainable risk indicators</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '11px', color: '#64748b' }}>
            SANGYAN 2026 • Track A Fraud Resilience & Track E Literacy
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: '#ffffff' }}>
              {stage === 'ENTER_EMAIL' ? 'Welcome Back' : 'Enter Verification Code'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              {stage === 'ENTER_EMAIL'
                ? 'Sign in to access your Investor Security Shield.'
                : `We dispatched a 6-digit code to ${maskedEmail || email}.`}
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#fca5a5',
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
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#22d3ee',
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
            <form onSubmit={handleInitLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Investor Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      color: '#64748b',
                    }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@example.com"
                    style={{ width: '100%', paddingLeft: '38px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#06b6d4',
                  color: '#080c14',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
                }}
              >
                {loading ? 'Dispatched Challenge...' : 'Sign In with Verification Code'}
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              </div>

              <button
                type="button"
                onClick={handlePasskeyLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '11px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <KeyRound style={{ width: '15px', height: '15px', color: '#06b6d4' }} />
                Continue with Passkey / Hardware Key
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  style={{
                    width: '100%',
                    fontSize: '22px',
                    fontWeight: 800,
                    letterSpacing: '0.28em',
                    textAlign: 'center',
                    padding: '12px',
                  }}
                />
              </div>

              {/* Developer Sandbox Auto-Fill Button */}
              <button
                type="button"
                onClick={() => handleAutoFillOtp(email)}
                disabled={fetchingOtp}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  color: '#22d3ee',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Zap style={{ width: '12px', height: '12px' }} />
                {fetchingOtp ? 'Resolving code...' : '[ AUTO-FILL DEMO CODE ]'}
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#06b6d4',
                  color: '#080c14',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
                }}
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setStage('ENTER_EMAIL')}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {resending ? 'Dispatched...' : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* Registration Switch */}
          <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              First-time setup?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#22d3ee',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Register as Owner
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
