import React, { useState } from 'react';
import {
  AlertOctagon,
  Shield,
  Lock,
  Trash2,
  PhoneCall,
  CheckCircle2,
  Unlock,
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

  const selectedMsg = quarantinedMessages.find((m) => m.id === selectedId) || quarantinedMessages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Quarantine Banner */}
      <div
        style={{
          backgroundColor: '#0b101d',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '16px',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock style={{ width: '22px', height: '22px', color: '#ef4444' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0' }}>
              Quarantine Isolation Firewall
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              High-risk communications are safely isolated to prevent accidental credential leakage or fraudulent payments.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#ef4444' }}>
            {quarantinedMessages.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Active Quarantined Items
          </div>
        </div>
      </div>

      {quarantinedMessages.length === 0 ? (
        <div
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <CheckCircle2 style={{ width: '40px', height: '40px', color: '#10b981', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>
            Quarantine Isolation Vault is Clean
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '380px', margin: '0 auto' }}>
            No quarantined or high-risk communications currently requiring user action.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
          {/* List of Quarantined Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quarantinedMessages.map((msg) => {
              const isSelected = selectedMsg?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedId(msg.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.06)' : '#0b101d',
                    border: isSelected ? '1px solid #ef4444' : '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertOctagon style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                      <strong style={{ fontSize: '13px', color: '#ffffff' }}>
                        {msg.sender || msg.source_channel || 'High Risk Alert'}
                      </strong>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      QUARANTINED
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '10px' }}>
                    "{msg.content || msg.snippet}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                    <span>Evidence Preserved ✓</span>
                    <span>Received: {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Decision Panel */}
          {selectedMsg && (
            <div
              style={{
                backgroundColor: '#0b101d',
                border: '1px solid #1e293b',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Shield style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                    Investor Protection Controls
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#070a12',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                    Why was this quarantined?
                  </div>
                  <div style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
                    {selectedMsg.detected_signals && selectedMsg.detected_signals.length > 0 ? (
                      <ul style={{ paddingLeft: '18px', margin: '4px 0 0 0' }}>
                        {selectedMsg.detected_signals.map((sig: any, i: number) => (
                          <li key={i}>{typeof sig === 'string' ? sig : sig.signal_name || sig.description}</li>
                        ))}
                      </ul>
                    ) : (
                      'High-severity scam patterns (unrealistic return promises, credential harvest, or urgent payment pressure) detected.'
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ffffff' }}>Zero Automatic Actions:</strong> IN V PROTECT never deletes messages or files reports automatically without your explicit consent.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => onReportMessage(selectedMsg)}
                  style={{
                    width: '100%',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <PhoneCall style={{ width: '14px', height: '14px' }} />
                  Report to CyberCrime (1930)
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onReleaseMessage(selectedMsg.id)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      color: '#f8fafc',
                      border: '1px solid #1e293b',
                      fontWeight: 600,
                      fontSize: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Unlock style={{ width: '13px', height: '13px', color: '#10b981' }} />
                    Release
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteMessage(selectedMsg.id)}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#fca5a5',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      fontWeight: 600,
                      fontSize: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Trash2 style={{ width: '13px', height: '13px' }} />
                    Delete
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
