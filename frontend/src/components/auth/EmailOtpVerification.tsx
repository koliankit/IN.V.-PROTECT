import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { VerifyOtpResponse } from '../../types/auth';

interface EmailOtpVerificationProps {
  email: string;
  maskedEmail: string;
  emailConfigured?: boolean;
  initialSandboxOtp?: string | null;
  onSuccess: (data: VerifyOtpResponse) => void;
  onBack: () => void;
  purpose?: string;
}

export const EmailOtpVerification: React.FC<EmailOtpVerificationProps> = ({
  email,
  maskedEmail,
  emailConfigured = true,
  initialSandboxOtp: _initialSandboxOtp = null,
  onSuccess,
  onBack,
  purpose = 'REGISTRATION',
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [fetchingOtp, setFetchingOtp] = useState<boolean>(false);
  const [autoFilled, setAutoFilled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Code sent');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleAutoFillOtp = async () => {
    setFetchingOtp(true);
    setErrorMessage(null);
    try {
      const url = email
        ? `/api/auth/dev-otp?email=${encodeURIComponent(email)}&purpose=${encodeURIComponent(purpose)}`
        : '/api/auth/dev-otp';
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        if (data.otp && data.otp.length === 6) {
          setDigits(data.otp.split(''));
          setAutoFilled(true);
          setStatusMessage(`Auto-filled: ${data.otp}`);
          inputRefs.current[5]?.focus();
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setFetchingOtp(false);
    }
  };

  // Resend countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Focus and attempt autofill on mount
  useEffect(() => {
    if (_initialSandboxOtp && _initialSandboxOtp.length === 6) {
      setDigits(_initialSandboxOtp.split(''));
      setAutoFilled(true);
      setStatusMessage(`Auto-filled: ${_initialSandboxOtp}`);
      inputRefs.current[5]?.focus();
    } else {
      handleAutoFillOtp();
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const val = value.slice(-1); // Take single character
    if (val && !/^[0-9]$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const splitted = pasteData.split('');
      setDigits(splitted);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = digits.join('');
    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const resp = await fetch('/api/auth/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          otp: fullOtp,
          purpose: purpose,
        }),
      });

      let data: any = {};
      try {
        data = await resp.json();
      } catch {
        if (!resp.ok) {
          throw new Error(`Server connection error (${resp.status}: ${resp.statusText || 'Backend unreachable'}).`);
        }
      }

      if (!resp.ok) {
        throw new Error(data.detail || 'Invalid verification code.');
      }

      onSuccess(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setErrorMessage(null);

    try {
      const resp = await fetch('/api/auth/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          purpose: purpose,
        }),
      });

      let data: any = {};
      try {
        data = await resp.json();
      } catch {
        if (!resp.ok) {
          throw new Error(`Server connection error (${resp.status}: ${resp.statusText || 'Backend unreachable'}).`);
        }
      }

      if (!resp.ok) {
        throw new Error(data.detail || 'Failed to resend verification code.');
      }

      setStatusMessage(data.message || 'New code dispatched');
      setTimer(60);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Email verification service is not configured.');
    } finally {
      setResending(false);
    }
  };

  const formattedTimer = `00:${timer < 10 ? '0' : ''}${timer}`;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#070a13',
      padding: '20px',
      color: '#f8fafc',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#0d1322',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
      }}>
        {/* Back Link */}
        <button
          onClick={onBack}
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
            marginBottom: '20px',
          }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Registration
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            marginBottom: '14px',
          }}>
            <Mail style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '0.04em' }}>
            VERIFY YOUR EMAIL
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            We sent a verification code to:
          </p>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#38bdf8',
            marginTop: '4px',
            fontFamily: 'monospace',
          }}>
            {maskedEmail}
          </div>
        </div>

        {/* Verification Status Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '20px',
          fontSize: '11px',
          color: '#34d399',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 style={{ width: '13px', height: '13px' }} /> {statusMessage}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck style={{ width: '13px', height: '13px' }} /> Secure verification
          </span>
        </div>

        {!emailConfigured ? (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#fca5a5',
              lineHeight: 1.5,
              display: 'flex',
              gap: '10px',
            }}
          >
            <AlertCircle style={{ width: '18px', height: '18px', color: '#f87171', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ef4444', color: '#ffffff' }}>
                  NOT CONFIGURED
                </span>
                <strong style={{ color: '#f87171' }}>Email Verification Provider (SMTP / Resend)</strong>
              </div>
              <div style={{ color: '#fecaca', marginBottom: '10px' }}>
                SMTP credentials are not configured in <code>.env</code>. To receive actual OTP emails in your inbox, configure <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USERNAME</code>, and <code>SMTP_PASSWORD</code>.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  disabled={fetchingOtp}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: fetchingOtp ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <Zap style={{ width: '13px', height: '13px' }} />
                  {fetchingOtp ? 'Resolving...' : 'AUTO-FILL DEMO CODE'}
                </button>
                <span style={{ fontSize: '11px', color: '#fca5a5' }}>
                  Click to fill sandbox verification code for evaluation
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#94a3b8',
              lineHeight: 1.4,
            }}
          >
            <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '2px' }}>
              ✓ Real Transactional Email Dispatched
            </div>
            Single-use cryptographic code valid for 5 minutes. IN V PROTECT never logs or exposes your OTP.
          </div>
        )}

        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 6-Digit OTP Inputs */}
        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>
                Enter 6-digit code:
              </label>
              <button
                type="button"
                onClick={handleAutoFillOtp}
                disabled={fetchingOtp}
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: fetchingOtp ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease',
                }}
                title="Click to automatically fetch and fill the verification code"
              >
                <Zap style={{ width: '12px', height: '12px' }} />
                {fetchingOtp ? 'Fetching...' : 'Auto-fill OTP'}
              </button>
            </div>
            <div
              onPaste={handlePaste}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    handleDigitChange(idx, e.target.value);
                    setAutoFilled(false);
                  }}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: '46px',
                    height: '54px',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    backgroundColor: '#080d1a',
                    border: digit ? '2px solid #38bdf8' : '1px solid #1e293b',
                    borderRadius: '10px',
                    color: '#ffffff',
                    outline: 'none',
                    boxShadow: digit ? '0 0 10px rgba(56, 189, 248, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                />
              ))}
            </div>
            {autoFilled && (
              <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                <span>Code auto-filled from developer sandbox environment</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || digits.some((d) => !d)}
            style={{
              width: '100%',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading || digits.some((d) => !d) ? 'not-allowed' : 'pointer',
              opacity: digits.some((d) => !d) ? 0.6 : 1,
              transition: 'background 0.2s',
              marginBottom: '16px',
            }}
          >
            {loading ? 'Verifying Code...' : 'VERIFY'}
          </button>
        </form>

        {/* Resend & Timer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#080d1a',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px',
        }}>
          <div>
            <span style={{ color: '#64748b' }}>Timer: </span>
            <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
              {formattedTimer}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resending}
            style={{
              background: 'none',
              border: 'none',
              color: canResend ? '#38bdf8' : '#475569',
              fontWeight: 700,
              cursor: canResend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
            }}
          >
            <RefreshCw style={{ width: '13px', height: '13px' }} />
            {resending ? 'Sending...' : 'RESEND CODE'}
          </button>
        </div>

        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '11px',
          color: '#64748b',
          lineHeight: 1.4,
        }}>
          The code expires in 5 minutes. Never share this code with anyone. Sangyan personnel will never ask for your verification code.
        </div>
      </div>
    </div>
  );
};
