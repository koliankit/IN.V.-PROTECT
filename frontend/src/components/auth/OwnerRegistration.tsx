import React, { useState } from 'react';
import { Shield, Mail, User, KeyRound, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { RegisterResponse } from '../../types/auth';

interface OwnerRegistrationProps {
  onSuccess: (data: RegisterResponse) => void;
  onSwitchToLogin: () => void;
}

export const OwnerRegistration: React.FC<OwnerRegistrationProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [activationCode, setActivationCode] = useState('SANGYAN-2026');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !activationCode.trim()) {
      setErrorMessage('Please fill in all registration fields.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          activation_code: activationCode.trim(),
          device_name: 'Primary Workstation',
          device_type: 'DESKTOP',
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
        throw new Error(data.detail || data.message || 'Registration failed.');
      }

      onSuccess(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during registration.');
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
        backgroundColor: '#171717',
        padding: '24px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Edge cyber network background */}
      <div className="cyber-network-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div
        className="glass-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '44px 38px',
          borderRadius: '18px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          type="button"
          onClick={onSwitchToLogin}
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
          <ArrowLeft style={{ width: '14px', height: '14px' }} /> Return to Login
        </button>

        {/* Shield Emblem */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'rgba(2, 195, 154, 0.08)',
            border: '1px solid rgba(2, 195, 154, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(2, 195, 154, 0.15)',
          }}
          className="animate-breathing"
        >
          <Shield style={{ width: '26px', height: '26px', color: '#02C39A' }} />
        </div>

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
            color: '#02C39A',
            letterSpacing: '0.01em',
            marginBottom: '6px',
          }}
        >
          First-Launch Owner Registration
        </div>

        <p
          style={{
            fontSize: '13px',
            color: '#A7A7A7',
            margin: '0 0 28px 0',
            lineHeight: 1.5,
          }}
        >
          Establish your verified device workstation identity with zero credentials collected.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User
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
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Ananya Sharma"
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
                  e.currentTarget.style.borderColor = '#02C39A';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(2, 195, 154, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

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
              Investor Email Address
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@example.com"
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
                  e.currentTarget.style.borderColor = '#02C39A';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(2, 195, 154, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

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
              Activation Code
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
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
                type="text"
                required
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="SANGYAN-2026"
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
                  e.currentTarget.style.borderColor = '#02C39A';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(2, 195, 154, 0.25)';
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
              backgroundColor: '#02C39A',
              color: '#171717',
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
              boxShadow: '0 4px 18px rgba(2, 195, 154, 0.35)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em',
              marginTop: '6px',
            }}
          >
            <span>{loading ? 'Registering Workstation...' : 'Continue to Verification'}</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </form>

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
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#02C39A',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Sign In with Email OTP
          </button>
        </div>
      </div>
    </div>
  );
};
