import React, { useState } from 'react';
import {
  AlertOctagon,
  Trash2,
  PhoneCall,
  CheckCircle2,
  Unlock,
  ArrowDown,
  FileText,
} from 'lucide-react';
import { SecureMessage } from '../../types';

interface QuarantineManagerProps {
  quarantinedMessages: SecureMessage[];
  onReleaseMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReportMessage: (msg: SecureMessage) => void;
}

export const QuarantineManager: React.FC<QuarantineManagerProps> = ({
  quarantinedMessages,
  onReleaseMessage,
  onDeleteMessage,
  onReportMessage,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    quarantinedMessages.length > 0 ? quarantinedMessages[0].id : null
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const selectedMsg = quarantinedMessages.find((m) => m.id === selectedId) || quarantinedMessages[0];

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
          <CheckCircle2 style={{ width: '42px', height: '42px', color: '#10B981', margin: '0 auto 12px auto' }} />
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

          {/* Detailed Quarantine Decision Flow (Section 12 Flow) */}
          {selectedMsg && (
            <div
              className="glass-panel"
              style={{
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Step 1: HIGH RISK */}
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
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#FCA5A5' }}>
                  Threat Threshold Exceeded
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown style={{ width: '14px', height: '14px', color: '#A7A7A7' }} />
              </div>

              {/* Step 2: QUARANTINE */}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown style={{ width: '14px', height: '14px', color: '#A7A7A7' }} />
              </div>

              {/* Step 3: EVIDENCE PACKAGE */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <FileText style={{ width: '13px', height: '13px', color: '#02C39A' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#02C39A', letterSpacing: '0.06em' }}>
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

              {/* Step 4: USER DECISION (Section 12 Buttons: [ Report ] [ Delete ] [ Release ]) */}
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

                {confirmDeleteId === selectedMsg.id ? (
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 59, 59, 0.08)',
                      border: '1px solid rgba(255, 59, 59, 0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#FF7B7B', fontWeight: 600 }}>
                      ⚠️ <strong>Confirm Permanent Deletion:</strong> Are you sure you want to permanently delete this quarantined communication and its telemetry evidence? This action cannot be reversed.
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteMessage(selectedMsg.id);
                          setConfirmDeleteId(null);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#FF3B3B',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* [ Report ] */}
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.20)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)')}
                    >
                      <PhoneCall style={{ width: '13px', height: '13px' }} />
                      Report
                    </button>

                    {/* [ Delete ] */}
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(selectedMsg.id)}
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
                        backgroundColor: 'rgba(2, 195, 154, 0.12)',
                        color: '#02C39A',
                        border: '1px solid rgba(2, 195, 154, 0.35)',
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(2, 195, 154, 0.20)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(2, 195, 154, 0.12)')}
                    >
                      <Unlock style={{ width: '13px', height: '13px' }} />
                      Release
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
