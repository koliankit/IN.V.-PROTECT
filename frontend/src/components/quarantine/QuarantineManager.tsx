import React, { useState } from 'react';
import {
  AlertOctagon,
  Trash2,
  PhoneCall,
  CheckCircle2,
  Unlock,
  ArrowDown,
  FileText,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { SecureMessage } from '../../types';

interface QuarantineManagerProps {
  quarantinedMessages: SecureMessage[];
  onReleaseMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReportMessage: (msg: SecureMessage) => void;
}

const SIGNAL_SEVERITY_COLOR: Record<string, string> = {
  critical: '#FF4757',
  high: '#EF4444',
  medium: '#F5B942',
  low: '#9AA5AD',
};

export const QuarantineManager: React.FC<QuarantineManagerProps> = ({
  quarantinedMessages,
  onReleaseMessage,
  onDeleteMessage,
  onReportMessage,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    quarantinedMessages.length > 0 ? quarantinedMessages[0].id : null
  );

  const selectedMsg = quarantinedMessages.find((m) => m.id === selectedId) || quarantinedMessages[0];

  // Derive a numeric risk score from confidence or signals for display
  const getRiskScore = (msg: SecureMessage): number | null => {
    if (!msg) return null;
    // If there are signals, estimate from severity counts
    const signals = msg.detected_signals || [];
    if (signals.length === 0) return null;
    const severityScore = signals.reduce((acc, s) => {
      if (s.severity === 'critical') return acc + 25;
      if (s.severity === 'high') return acc + 18;
      if (s.severity === 'medium') return acc + 10;
      return acc + 5;
    }, 0);
    return Math.min(99, Math.max(60, severityScore));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Quarantine Banner */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.10)',
              border: '1px solid rgba(239, 68, 68, 0.30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertOctagon style={{ width: '22px', height: '22px', color: '#EF4444' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 3px 0' }}>
              Quarantine Isolation Firewall
            </h2>
            <p style={{ fontSize: '13px', color: '#A7A7A7', margin: 0 }}>
              High-risk communications are safely isolated to prevent accidental credential leakage or fraudulent payments.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>
            {quarantinedMessages.length}
          </div>
          <div style={{ fontSize: '11px', color: '#A7A7A7' }}>
            Active Quarantined Items
          </div>
        </div>
      </div>

      {quarantinedMessages.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <CheckCircle2 style={{ width: '42px', height: '42px', color: '#e53e3e', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
            Quarantine Isolation Vault is Clean
          </h3>
          <p style={{ fontSize: '13px', color: '#A7A7A7', maxWidth: '380px', margin: '0 auto' }}>
            No quarantined or high-risk communications currently requiring user action.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px' }}>
          {/* List of Quarantined Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quarantinedMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  className="glass-panel"
                  style={{
                    borderRadius: '12px',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'rgba(239, 68, 68, 0.40)' : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255, 255, 255, 0.03)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: '#EF4444',
                          boxShadow: '0 0 6px #EF4444',
                        }}
                      />
                      <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>
                        {msg.sender || msg.source_channel || 'High Risk Alert'}
                      </strong>
                      {/* DEMO badge */}
                      {msg.is_demo && (
                        <span style={{
                          fontSize: '9px', fontWeight: 800, padding: '1px 6px',
                          borderRadius: '4px', backgroundColor: 'rgba(168, 85, 247, 0.15)',
                          color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)',
                          letterSpacing: '0.06em',
                        }}>
                          DEMO
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#EF4444',
                        border: '1px solid rgba(239, 68, 68, 0.30)',
                      }}
                    >
                      QUARANTINED
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#A7A7A7', lineHeight: 1.5, marginBottom: '10px' }}>
                    "{msg.content || msg.snippet}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#666666' }}>
                    <span>Evidence Package Preserved ✓</span>
                    <span>Received: {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Quarantine Decision Panel */}
          {selectedMsg && (
            <div
              className="glass-panel"
              style={{
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                overflowY: 'auto',
                maxHeight: '80vh',
              }}
            >
              {/* Step 1: HIGH RISK badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertOctagon style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.06em' }}>
                    HIGH RISK
                    {getRiskScore(selectedMsg) !== null && (
                      <span style={{ marginLeft: '8px', color: '#FCA5A5' }}>
                        — {getRiskScore(selectedMsg)}/100
                      </span>
                    )}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#FCA5A5' }}>
                  Threat Threshold Exceeded
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown style={{ width: '14px', height: '14px', color: '#A7A7A7' }} />
              </div>

              {/* ── WHY THIS IS HIGH RISK section ── */}
              {selectedMsg.detected_signals && selectedMsg.detected_signals.length > 0 && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.04)',
                    border: '1px solid rgba(239, 68, 68, 0.18)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
                    <ShieldAlert style={{ width: '14px', height: '14px', color: '#EF4444' }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#EF4444', letterSpacing: '0.08em' }}>
                      WHY THIS IS HIGH RISK
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Detected signals with per-signal evidence */}
                    <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.06em', marginBottom: '2px' }}>
                      Detected Signals:
                    </div>
                    {selectedMsg.detected_signals.map((sig, i) => (
                      <div
                        key={sig.id || i}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          border: `1px solid ${SIGNAL_SEVERITY_COLOR[sig.severity] || '#4A5568'}30`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                            backgroundColor: SIGNAL_SEVERITY_COLOR[sig.severity] || '#9AA5AD',
                            boxShadow: `0 0 6px ${SIGNAL_SEVERITY_COLOR[sig.severity] || '#9AA5AD'}`,
                          }} />
                          <span style={{
                            fontSize: '12px', fontWeight: 700,
                            color: SIGNAL_SEVERITY_COLOR[sig.severity] || '#FFFFFF',
                          }}>
                            {sig.name}
                          </span>
                          <span style={{
                            fontSize: '9px', fontWeight: 800,
                            padding: '1px 5px', borderRadius: '3px',
                            backgroundColor: `${SIGNAL_SEVERITY_COLOR[sig.severity]}20`,
                            color: SIGNAL_SEVERITY_COLOR[sig.severity] || '#9AA5AD',
                            border: `1px solid ${SIGNAL_SEVERITY_COLOR[sig.severity]}40`,
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>
                            {sig.severity}
                          </span>
                        </div>
                        {sig.description && (
                          <div style={{ fontSize: '11px', color: '#9AA5AD', lineHeight: 1.45, marginLeft: '13px' }}>
                            {sig.description}
                          </div>
                        )}
                        {sig.evidence_text && (
                          <div style={{
                            marginTop: '6px', marginLeft: '13px',
                            padding: '6px 10px', borderRadius: '5px',
                            backgroundColor: 'rgba(239, 68, 68, 0.06)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            fontSize: '11px', color: '#FCA5A5',
                            fontFamily: 'var(--font-mono)', lineHeight: 1.4,
                          }}>
                            <span style={{ color: '#6B7280', marginRight: '4px' }}>Evidence:</span>
                            "{sig.evidence_text}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* WHY IT MATTERS section */}
                  {selectedMsg.explanation && (
                    <div style={{ marginTop: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                        <Info style={{ width: '13px', height: '13px', color: '#F5B942' }} />
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#F5B942', letterSpacing: '0.08em' }}>
                          WHY IT MATTERS
                        </span>
                      </div>
                      <div style={{
                        padding: '12px 14px', borderRadius: '8px',
                        backgroundColor: 'rgba(245, 185, 66, 0.05)',
                        border: '1px solid rgba(245, 185, 66, 0.18)',
                        fontSize: '12px', color: '#D1D5DB', lineHeight: 1.55,
                      }}>
                        {selectedMsg.explanation}
                      </div>
                    </div>
                  )}

                  {/* Official source links if available */}
                  {selectedMsg.evidence && selectedMsg.evidence.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.06em', marginBottom: '6px' }}>
                        Supporting Evidence:
                      </div>
                      {selectedMsg.evidence.slice(0, 2).map((ev, i) => (
                        <a
                          key={i}
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '7px 10px', borderRadius: '6px', marginBottom: '4px',
                            backgroundColor: 'rgba(2, 195, 154, 0.06)',
                            border: '1px solid rgba(2, 195, 154, 0.18)',
                            textDecoration: 'none', color: '#02C39A', fontSize: '11px',
                          }}
                        >
                          <ExternalLink style={{ width: '11px', height: '11px', flexShrink: 0 }} />
                          <span>{ev.publisher} — {ev.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fallback if no signals (shouldn't normally happen) */}
              {(!selectedMsg.detected_signals || selectedMsg.detected_signals.length === 0) && (
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.18)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                    <AlertTriangle style={{ width: '13px', height: '13px', color: '#EF4444' }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#EF4444', letterSpacing: '0.08em' }}>
                      WHY THIS IS HIGH RISK
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#A7A7A7', lineHeight: 1.5 }}>
                    {selectedMsg.quarantine_reason || 'High-urgency scam patterns, unverified return claims, or payment harvest signals detected by rule engine.'}
                  </div>
                  {selectedMsg.explanation && (
                    <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '7px', backgroundColor: 'rgba(245, 185, 66, 0.05)', border: '1px solid rgba(245, 185, 66, 0.2)', fontSize: '12px', color: '#D1D5DB', lineHeight: 1.5 }}>
                      {selectedMsg.explanation}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown style={{ width: '14px', height: '14px', color: '#A7A7A7' }} />
              </div>

              {/* QUARANTINE STATUS */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#A7A7A7', letterSpacing: '0.06em', marginBottom: '4px' }}>
                  QUARANTINE STATUS
                </div>
                <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                  Isolated in Sandbox • Credentials Protected
                </div>
                {selectedMsg.is_demo && (
                  <div style={{ marginTop: '4px', fontSize: '11px', color: '#c084fc', fontWeight: 600 }}>
                    ⚡ SIMULATED INPUT — Ran through real analysis pipeline
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown style={{ width: '14px', height: '14px', color: '#A7A7A7' }} />
              </div>

              {/* EVIDENCE PACKAGE */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <FileText style={{ width: '13px', height: '13px', color: '#e53e3e' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#e53e3e', letterSpacing: '0.06em' }}>
                    EVIDENCE PACKAGE
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#A7A7A7', lineHeight: 1.5 }}>
                  {selectedMsg.detected_signals && selectedMsg.detected_signals.length > 0 ? (
                    <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
                      {selectedMsg.detected_signals.map((sig: any, i: number) => (
                        <li key={i} style={{ color: '#FFFFFF' }}>
                          {typeof sig === 'string' ? sig : sig.signal_name || sig.name || sig.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'High-urgency scam patterns, unverified return claims, or payment harvest detected.'
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown style={{ width: '14px', height: '14px', color: '#A7A7A7' }} />
              </div>

              {/* USER DECISION */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  USER DECISION
                </div>
                <p style={{ fontSize: '12px', color: '#A7A7A7', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                  Zero automatic actions taken. You retain full control over this communication.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* [ Report ] — generates real incident report */}
                  <button
                    type="button"
                    onClick={() => onReportMessage(selectedMsg)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      color: '#F87171',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.22)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
                  >
                    <PhoneCall style={{ width: '13px', height: '13px' }} />
                    Report
                  </button>

                  {/* [ Delete ] */}
                  <button
                    type="button"
                    onClick={() => onDeleteMessage(selectedMsg.id)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#EF4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  >
                    <Trash2 style={{ width: '13px', height: '13px' }} />
                    Delete
                  </button>

                  {/* [ Release ] */}
                  <button
                    type="button"
                    onClick={() => onReleaseMessage(selectedMsg.id)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(229, 62, 62, 0.12)',
                      color: '#e53e3e',
                      border: '1px solid rgba(229, 62, 62, 0.35)',
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.22)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.12)')}
                  >
                    <Unlock style={{ width: '13px', height: '13px' }} />
                    Release
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
