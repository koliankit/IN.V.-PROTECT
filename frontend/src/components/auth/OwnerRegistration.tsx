import React, { useState } from 'react';
import { Shield, Mail, User, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
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
        backgroundColor: '#070a12',
        padding: '24px',
        color: '#f8fafc',
      }}
    >
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
        {/* Left Security Branding Panel */}
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
              First-Launch Owner Registration
            </p>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
              Establish your personal security layer. Your identity is verified with cryptographic anti-spoofing before access is unlocked.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                <span>Zero banking/broker passwords collected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                <span>Authoritative official regulatory source cross-checks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
                <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10b981', flexShrink: 0 }} />
                <span>Hardware-backed liveness or platform passkey</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '11px', color: '#64748b' }}>
            SANGYAN 2026 • Digital Fraud & Scam Resilience
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: '#ffffff' }}>
              Register Owner Account
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Set up your primary workstation identity.
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
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
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Ananya Sharma"
                  style={{ width: '100%', paddingLeft: '38px', fontSize: '13px' }}
                />
              </div>
            </div>

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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Activation Code
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound
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
                  type="text"
                  required
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder="SANGYAN-2026"
                  style={{ width: '100%', paddingLeft: '38px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Default: <code>SANGYAN-2026</code>
              </span>
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
              {loading ? 'Registering...' : 'Continue to Verification'}
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Already set up on this device?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
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
                Sign In
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
