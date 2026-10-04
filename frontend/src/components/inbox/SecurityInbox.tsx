import React, { useState, useMemo } from 'react';
import {
  Inbox,
  FileText,
  Star,
  Trash2,
  Radio,
  Sliders,
  Search,
} from 'lucide-react';
import { SecureMessage, IntegrationSource } from '../../types';

interface SecurityInboxProps {
  messages: SecureMessage[];
  sources?: IntegrationSource[];
  activeTier: string;
  onSelectTier: (tier: string) => void;
  onInspectMessage: (msg: SecureMessage) => void;
  onPreserveAction: (messageId: string, action: 'keep' | 'mark_important' | 'archive' | 'release' | 'delete') => Promise<void>;
  onGenerateReport: (msg: SecureMessage) => void;
  onOpenSimulateModal: () => void;
  onOpenConnectedSources?: () => void;
}

export const SecurityInbox: React.FC<SecurityInboxProps> = ({
  messages,
  sources = [],
  activeTier,
  onSelectTier,
  onInspectMessage,
  onPreserveAction,
  onGenerateReport,
  onOpenSimulateModal,
  onOpenConnectedSources,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  // Filter messages based on active tier, search query, and channel
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // 1. Tier filtering
      if (activeTier === 'important') {
        if (!m.is_important && m.protection_tier !== 'Trusted / Important' && m.status !== 'IMPORTANT') {
          return false;
        }
      } else if (activeTier === 'review') {
        if (m.protection_tier !== 'Review / Verify') {
          return false;
        }
      } else if (activeTier === 'quarantine' || activeTier === 'high_risk') {
        if (m.protection_tier !== 'Quarantined / High Risk' && m.status !== 'QUARANTINED') {
          return false;
        }
      }

      // 2. Channel filtering
      if (selectedChannel !== 'all') {
        if (!m.source_channel.toLowerCase().includes(selectedChannel.toLowerCase())) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inSender = (m.sender || '').toLowerCase().includes(q);
        const inContent = (m.content || '').toLowerCase().includes(q);
        const inClaimed = (m.claimed_source || '').toLowerCase().includes(q);
        const inActual = (m.actual_sender || m.sender_identifier || '').toLowerCase().includes(q);
        if (!inSender && !inContent && !inClaimed && !inActual) {
          return false;
        }
      }

      return true;
    });
  }, [messages, activeTier, selectedChannel, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: messages.length,
      important: messages.filter((m) => m.is_important || m.protection_tier === 'Trusted / Important' || m.status === 'IMPORTANT').length,
      review: messages.filter((m) => m.protection_tier === 'Review / Verify').length,
      high_risk: messages.filter((m) => m.protection_tier === 'Quarantined / High Risk' || m.status === 'QUARANTINED').length,
    };
  }, [messages]);

  const getVerificationBadge = (msg: SecureMessage) => {
    const status = msg.sender_verification || 'UNVERIFIED';
    switch (status) {
      case 'VERIFIED':
        return {
          label: 'VERIFIED SOURCE',
          color: '#02C39A',
          bg: 'rgba(2, 195, 154, 0.12)',
          border: 'rgba(2, 195, 154, 0.3)',
        };
      case 'NOT VERIFIED':
        return {
          label: 'NOT VERIFIED',
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'CONTRADICTED':
        return {
          label: 'CONTRADICTED',
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.35)',
        };
      case 'UNVERIFIED':
      default:
        return {
          label: 'UNVERIFIED',
          color: '#fbbf24',
          bg: 'rgba(251, 191, 36, 0.12)',
          border: 'rgba(251, 191, 36, 0.3)',
        };
    }
  };

  const getRiskBadge = (risk: string) => {
    const r = (risk || '').toLowerCase();
    if (r.includes('high')) {
      return { label: 'HIGH RISK', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)' };
    }
    if (r.includes('need') || r.includes('review') || r.includes('verif')) {
      return { label: 'REVIEW', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.35)' };
    }
    return { label: 'LOW RISK', color: '#02C39A', bg: 'rgba(2, 195, 154, 0.15)', border: 'rgba(2, 195, 154, 0.35)' };
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '20px 24px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              COMMUNICATION SECURITY LAYER
            </span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            SECURITY INBOX
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Screening incoming investor communications across authorized Email, SMS, Notifications, Browser links, and Financial alerts.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenSimulateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Radio style={{ width: '13px', height: '13px' }} />
            Simulate Incoming Message [DEMO]
          </button>

          {onOpenConnectedSources && (
            <button
              onClick={onOpenConnectedSources}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Sliders style={{ width: '13px', height: '13px' }} />
              Connected Sources
            </button>
          )}
        </div>
      </div>

      {/* Connected Sources Status Strip */}
      {sources.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflowX: 'auto',
            padding: '10px 16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span style={{ color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase' }}>
            Sources:
          </span>
          {sources.map((s) => {
            const isConn = s.status === 'CONNECTED';
            const isNotConfig = s.status === 'NOT CONFIGURED';
            const color = isConn ? '#02C39A' : isNotConfig ? 'var(--text-muted)' : '#c084fc';
            return (
              <span
                key={s.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }} />
                <strong>{s.name.replace(' Monitor', '').replace(' / Notifications', '')}</strong>: <span style={{ color }}>{s.status}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Tier Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: 'ALL', count: counts.all },
            { id: 'important', label: 'IMPORTANT', count: counts.important, dotColor: '#02C39A' },
            { id: 'review', label: 'REVIEW', count: counts.review, dotColor: '#fbbf24' },
            { id: 'quarantine', label: 'HIGH RISK', count: counts.high_risk, dotColor: '#f87171' },
          ].map((tab) => {
            const isActive = activeTier === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTier(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.dotColor && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tab.dotColor }} />
                )}
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#ffffff' : 'var(--text-faint)',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Channel Select */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            <Search style={{ width: '13px', height: '13px', color: 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="Search sender, text, claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '12px',
                width: '180px',
              }}
            />
          </div>

          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              outline: 'none',
            }}
          >
            <option value="all">All Channels</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="notification">Notification</option>
            <option value="browser">Browser / Link</option>
            <option value="whatsapp">WhatsApp / Telegram</option>
          </select>
        </div>
      </div>

      {/* Message List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredMessages.map((msg) => {
          const vBadge = getVerificationBadge(msg);
          const rBadge = getRiskBadge(msg.risk_level);
          const isQuarantined = msg.protection_tier === 'Quarantined / High Risk' || msg.status === 'QUARANTINED';
          const isImportant = msg.is_important || msg.protection_tier === 'Trusted / Important' || msg.status === 'IMPORTANT';

          return (
            <div
              key={msg.id}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: `1px solid ${isQuarantined ? 'rgba(239, 68, 68, 0.35)' : isImportant ? 'rgba(2, 195, 154, 0.25)' : 'var(--border-color)'}`,
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Row 1: Source & Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Channel tag */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {msg.source_channel.toUpperCase()}
                  </span>

                  {/* Demo indicator */}
                  {msg.is_demo && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(168, 85, 247, 0.12)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.25)',
                      }}
                    >
                      DEMO / SIMULATED
                    </span>
                  )}

                  {/* Important indicator */}
                  {isImportant && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(2, 195, 154, 0.1)',
                        color: '#02C39A',
                        border: '1px solid rgba(2, 195, 154, 0.25)',
                      }}
                    >
                      PRESERVED / IMPORTANT
                    </span>
                  )}

                  <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Verification Badge */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: vBadge.bg,
                      color: vBadge.color,
                      border: `1px solid ${vBadge.border}`,
                    }}
                  >
                    {vBadge.label}
                  </span>

                  {/* Risk Badge */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: rBadge.bg,
                      color: rBadge.color,
                      border: `1px solid ${rBadge.border}`,
                    }}
                  >
                    {rBadge.label}
                  </span>
                </div>
              </div>

              {/* Row 2: Claimed Source vs Actual Identifier */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {msg.claimed_source || msg.sender}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  Identifier: <strong style={{ color: 'var(--text-muted)' }}>{msg.actual_sender || msg.sender_identifier}</strong>
                </span>
              </div>

              {/* Row 3: Content Snippet */}
              <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
                "{msg.snippet || msg.content}"
              </p>

              {/* Row 4: Detected Signals & Verification Finding */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {msg.detected_signals.map((sig, sidx) => (
                    <span
                      key={sidx}
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        padding: '1px 7px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      • {sig.name}
                    </span>
                  ))}
                  {msg.detected_signals.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                      ✓ Clean message signature
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => onInspectMessage(msg)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Inspect Analysis
                  </button>

                  {isQuarantined ? (
                    <>
                      <button
                        onClick={() => onGenerateReport(msg)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#e53e3e',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <FileText style={{ width: '11px', height: '11px' }} />
                        Generate Report
                      </button>
                      <button
                        onClick={() => onPreserveAction(msg.id, 'release')}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.25)',
                          color: '#fbbf24',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                        title="Release from Quarantine to Review"
                      >
                        Release
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onPreserveAction(msg.id, 'keep')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(2, 195, 154, 0.12)',
                          border: '1px solid rgba(2, 195, 154, 0.25)',
                          color: '#02C39A',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        title="Keep and Preserve in Important Messages"
                      >
                        <Star style={{ width: '11px', height: '11px' }} />
                        Keep
                      </button>
                      <button
                        onClick={() => onPreserveAction(msg.id, 'archive')}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-muted)',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                        title="Archive message"
                      >
                        Archive
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete communication ${msg.id}?`)) {
                        onPreserveAction(msg.id, 'delete');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-faint)',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                    title="Delete message"
                  >
                    <Trash2 style={{ width: '13px', height: '13px' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMessages.length === 0 && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <Inbox style={{ width: '32px', height: '32px', color: 'var(--text-faint)', margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              No Communications in {activeTier.toUpperCase()}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
              Incoming messages from connected channels will automatically appear here after continuous AI screening.
            </p>
            <button
              onClick={onOpenSimulateModal}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#c084fc',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Simulate Incoming Message [DEMO]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
