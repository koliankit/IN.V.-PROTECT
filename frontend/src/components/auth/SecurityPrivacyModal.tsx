import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, X, AlertTriangle } from 'lucide-react';
import { OwnerProfile, SessionRecord } from '../../types/auth';

interface SecurityPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerProfile: OwnerProfile | null;
  onLogout: () => void;
}

export const SecurityPrivacyModal: React.FC<SecurityPrivacyModalProps> = ({
  isOpen,
  onClose,
  ownerProfile,
  onLogout,
}) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    try {
      const resp = await fetch('/api/auth/sessions');
      if (resp.ok) {
        const data = await resp.json();
        setSessions(data);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const resp = await fetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
      if (resp.ok) {
        setActionMessage('Session revoked.');
        fetchSessions();
      }
    } catch (e) {
      // Ignore
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm('Revoke all sessions across all registered devices? You will be logged out immediately.')) return;
    try {
      await fetch('/api/auth/logout-all', { method: 'POST' });
      onLogout();
    } catch (e) {
      onLogout();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        backgroundColor: '#0d1322',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '28px',
        color: '#f8fafc',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(56, 189, 248, 0.12)', borderRadius: '10px', color: '#38bdf8' }}>
              <ShieldCheck style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '0.04em' }}>
                SECURITY & PRIVACY
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Owner verification posture and session telemetry
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {actionMessage && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#6ee7b7' }}>
            {actionMessage}
          </div>
        )}

        {/* Security Posture Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Identity Verification</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              {ownerProfile?.identity_verified ? 'Verified' : 'Pending'}
            </div>
          </div>

          <div style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Email Address</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              {ownerProfile?.email_verified ? 'Verified' : 'Pending'}
            </div>
          </div>

          <div style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Protected Devices</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>
              {ownerProfile?.active_devices_count || 1} Active
            </div>
          </div>

          <div style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Active Sessions</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>
              {sessions.length || ownerProfile?.active_sessions_count || 1} Active
            </div>
          </div>
        </div>

        {/* Biometric Privacy Card */}
        <div style={{
          backgroundColor: '#080d1a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '20px',
          fontSize: '12px',
        }}>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> Biometric Processing
          </div>
          <div style={{ color: '#94a3b8', lineHeight: 1.4 }}>
            Provider-managed / zero raw frame storage. Sangyan AI does not retain webcam frames, face photographs, or biometric templates in the application database.
          </div>
        </div>

        {/* Active Sessions Management */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
            Active Sessions ({sessions.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map((ses) => (
              <div
                key={ses.session_id}
                style={{
                  backgroundColor: '#080d1a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>
                    {ses.device_name} {ses.is_current && <span style={{ color: '#38bdf8', fontSize: '11px' }}>(Current)</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    IP: {ses.ip_address} • Platform: {ses.platform}
                  </div>
                </div>

                {!ses.is_current && (
                  <button
                    onClick={() => handleRevokeSession(ses.session_id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                  >
                    REVOKE
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={handleLogoutAll}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#f87171',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle style={{ width: '14px', height: '14px' }} />
            REVOKE ALL SESSIONS
          </button>

          <button
            onClick={onClose}
            style={{
              backgroundColor: '#1e293b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
