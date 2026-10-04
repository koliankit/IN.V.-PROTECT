import React, { useState } from 'react';
import {
  Mail,
  Smartphone,
  Bell,
  Globe,
  Camera,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Lock,
  Radio,
} from 'lucide-react';
import { IntegrationSource } from '../../types';

interface ConnectedSourcesViewProps {
  sources: IntegrationSource[];
  onRefresh: () => void;
  onConnect: (sourceId: string, accountIdentifier?: string) => Promise<void>;
  onDisconnect: (sourceId: string) => Promise<void>;
  onOpenSimulateModal: () => void;
}

export const ConnectedSourcesView: React.FC<ConnectedSourcesViewProps> = ({
  sources,
  onRefresh,
  onConnect,
  onDisconnect,
  onOpenSimulateModal,
}) => {
  const [_connectingId, setConnectingId] = useState<string | null>(null);
  const [showEmailOAuthModal, setShowEmailOAuthModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('investor.portfolio@gmail.com');
  const [showSmsPairModal, setShowSmsPairModal] = useState<boolean>(false);

  const getSourceIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('email')) return <Mail style={{ width: '20px', height: '20px' }} />;
    if (c.includes('sms')) return <Smartphone style={{ width: '20px', height: '20px' }} />;
    if (c.includes('notification')) return <Bell style={{ width: '20px', height: '20px' }} />;
    if (c.includes('browser')) return <Globe style={{ width: '20px', height: '20px' }} />;
    if (c.includes('screenshot')) return <Camera style={{ width: '20px', height: '20px' }} />;
    if (c.includes('financial') || c.includes('alert')) return <DollarSign style={{ width: '20px', height: '20px' }} />;
    return <ShieldCheck style={{ width: '20px', height: '20px' }} />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return {
          label: '● CONNECTED',
          color: '#02C39A',
          bg: 'rgba(2, 195, 154, 0.12)',
          border: 'rgba(2, 195, 154, 0.3)',
        };
      case 'CONNECTING':
        return {
          label: '● CONNECTING',
          color: '#fbbf24',
          bg: 'rgba(251, 191, 36, 0.12)',
          border: 'rgba(251, 191, 36, 0.3)',
        };
      case 'NOT CONFIGURED':
        return {
          label: '● NOT CONFIGURED',
          color: 'var(--text-muted)',
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'var(--border-color)',
        };
      case 'DISCONNECTED':
        return {
          label: '● DISCONNECTED',
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'DEMO / SIMULATED':
      default:
        return {
          label: '● DEMO / SIMULATED',
          color: '#c084fc',
          bg: 'rgba(168, 85, 247, 0.12)',
          border: 'rgba(168, 85, 247, 0.3)',
        };
    }
  };

  const handleConnectEmail = async () => {
    setConnectingId('INT-EMAIL');
    setShowEmailOAuthModal(false);
    try {
      await onConnect('INT-EMAIL', emailInput.trim());
    } finally {
      setConnectingId(null);
    }
  };

  const handleConnectSms = async () => {
    setConnectingId('INT-SMS');
    setShowSmsPairModal(false);
    try {
      await onConnect('INT-SMS', '+91 98*** **321 (Paired Mobile Service)');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '24px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              PROTECTION PERIMETER
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Connected Sources & Ingestion Channels
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0', maxWidth: '640px', lineHeight: 1.5 }}>
            IN V PROTECT connects strictly to authorized financial communication sources. All incoming emails, SMS, notifications, and links are analyzed in real-time with zero credential collection.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenSimulateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#c084fc',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Radio style={{ width: '14px', height: '14px' }} />
            Simulate Incoming Message [DEMO]
          </button>
          <button
            onClick={onRefresh}
            style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            title="Refresh Sources"
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Zero Credential Guarantee Alert */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'rgba(2, 195, 154, 0.08)',
          borderRadius: '8px',
          border: '1px solid rgba(2, 195, 154, 0.25)',
          fontSize: '12px',
          color: 'var(--text-primary)',
        }}
      >
        <Lock style={{ width: '16px', height: '16px', color: '#02C39A', flexShrink: 0 }} />
        <div>
          <strong style={{ color: '#02C39A' }}>Statutory Zero-Credential Architecture:</strong> IN V PROTECT never asks for, stores, or accesses your email passwords, net-banking passwords, UPI PINs, ATM PINs, or SMS OTPs. Integrations operate strictly under restricted read-only security scopes.
        </div>
      </div>

      {/* Sources Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {sources.map((src) => {
          const badge = getStatusBadge(src.status);
          const isConnected = src.status === 'CONNECTED';
          const isSms = src.category.toLowerCase().includes('sms') || src.id === 'INT-SMS';
          const isEmail = src.category.toLowerCase().includes('email') || src.id === 'INT-EMAIL';

          return (
            <div
              key={src.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `1px solid ${isConnected ? 'rgba(2, 195, 154, 0.25)' : 'var(--border-color)'}`,
                borderRadius: '10px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                position: 'relative',
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isConnected ? '#02C39A' : 'var(--text-muted)',
                      }}
                    >
                      {getSourceIcon(src.category)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {src.name}
                      </h3>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                        {src.category} • {src.auth_type || 'Restricted API'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  {src.description}
                </p>

                {/* Account / Identifier */}
                {src.account_identifier && (
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 8px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    Identifier: <strong>{src.account_identifier}</strong>
                  </div>
                )}

                {/* Specific SMS Notice */}
                {isSms && src.status === 'NOT CONFIGURED' && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px dashed var(--border-color)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginBottom: '8px',
                      lineHeight: 1.4,
                    }}
                  >
                    ⚠️ <em>Normal web applications cannot silently read phone SMS. Real mobile integration requires the IN V PROTECT Android service.</em>
                  </div>
                )}

                {/* Data Access & Security Guarantee */}
                <div style={{ fontSize: '11px', color: 'var(--text-faint)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>Scope: {src.data_access_level}</div>
                  <div>Guarantee: <span style={{ color: '#02C39A' }}>{src.security_guarantee}</span></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                {isEmail && (
                  <>
                    {isConnected ? (
                      <button
                        onClick={() => onDisconnect(src.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-color)',
                          color: '#f87171',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowEmailOAuthModal(true)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(2, 195, 154, 0.15)',
                          border: '1px solid rgba(2, 195, 154, 0.3)',
                          color: '#02C39A',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Connect via OAuth 2.0
                      </button>
                    )}
                  </>
                )}

                {isSms && (
                  <>
                    {isConnected ? (
                      <button
                        onClick={() => onDisconnect(src.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-color)',
                          color: '#f87171',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSmsPairModal(true)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Configure Mobile SMS Service
                      </button>
                    )}
                  </>
                )}

                {!isEmail && !isSms && (
                  <button
                    onClick={onOpenSimulateModal}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Test Ingestion Pipeline
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* OAuth Simulation Modal for Email */}
      {showEmailOAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
          }}
          className="animate-fade-in"
          onClick={() => setShowEmailOAuthModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(2, 195, 154, 0.15)', color: '#02C39A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Authorize Email Security Ingestion</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OAuth 2.0 Restricted Read-Only Scope</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Authorize IN V PROTECT to read headers and links in incoming financial emails for sender verification and scam analysis. <strong>We NEVER ask for your password.</strong>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Investor Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowEmailOAuthModal(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConnectEmail}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#02C39A',
                  border: 'none',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Authorize with Google / Microsoft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Mobile Companion Configuration Modal */}
      {showSmsPairModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
          }}
          className="animate-fade-in"
          onClick={() => setShowSmsPairModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Configure Mobile SMS Ingestion</h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Explicit Mobile Device Permission Required</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              A standard browser web application <strong>cannot silently intercept your phone SMS</strong>. To protect your SMS stream:
              <ol style={{ paddingLeft: '18px', marginTop: '8px' }}>
                <li>Install the <strong>IN V PROTECT Android Companion</strong> on your mobile phone.</li>
                <li>Grant explicit, one-time read-only SMS screening permission.</li>
                <li>Sensitive OTP digits and login PINs are automatically scrubbed on-device before security evaluation.</li>
              </ol>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowSmsPairModal(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConnectSms}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#02C39A',
                  border: 'none',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Confirm Mobile Companion Paired
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
