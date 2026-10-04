import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
} from 'lucide-react';
import { IncomingSimulationPayload } from '../../types';

interface SimulateIncomingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (payload: IncomingSimulationPayload) => Promise<void>;
}

const PRESET_TEMPLATES = [
  {
    id: 'tpl-otp-sms',
    title: 'SMS: Demat KYC Suspension & OTP Harvesting (High Risk)',
    channel: 'SMS',
    sender: 'VK-DEMATBLOCK',
    senderIdentifier: '+919123456789',
    claimedSource: 'Depository Participant KYC Helpdesk',
    content:
      'URGENT SECURITY ALERT: Dear investor, your Demat account KYC verification is incomplete. Your account will be permanently suspended within 2 hours. Share your 6-digit OTP and login password to complete re-KYC immediately.',
  },
  {
    id: 'tpl-apk-chat',
    title: 'Notification: FII Institutional VIP APK Sideload (High Risk)',
    channel: 'Notification',
    sender: 'VIP FII Institutional Quota',
    senderIdentifier: '@InstitutionalVIPDesk',
    claimedSource: 'Registered Institutional Trading Desk',
    content:
      'Upper circuit institutional quota open for retail investors! Download the certified VIP Trading terminal from http://pro-market-quota.apk to get 100% guaranteed upper circuit returns before market opening.',
  },
  {
    id: 'tpl-sebi-email',
    title: 'Email: SEBI Investor Advisory & Awareness Notice (Verified / Important)',
    channel: 'Email',
    sender: 'SEBI Investor Awareness Cell',
    senderIdentifier: 'noreply@investor.sebi.gov.in',
    claimedSource: 'SEBI Investor Awareness Cell',
    content:
      'Statutory Investor Advisory: Securities and mutual fund investments are subject to market risks. SEBI never certifies, approves or endorses private trading mobile apps, and registered brokers never guarantee returns. Always verify intermediary registration on investor.sebi.gov.in.',
  },
  {
    id: 'tpl-broker-margin',
    title: 'Email: Authorized Broker Account Ledger Update (Verified / Important)',
    channel: 'Email',
    sender: 'Zerodha Broking Limited',
    senderIdentifier: 'reports@zerodha.com',
    claimedSource: 'Zerodha Broking Limited (SEBI Reg INZ000031633)',
    content:
      'Broker Account Notification: Your quarterly Demat holding statement and contract note for trading account 102948 have been generated and archived. No action required unless discrepancies are found in your holding statement.',
  },
];

export const SimulateIncomingModal: React.FC<SimulateIncomingModalProps> = ({
  isOpen,
  onClose,
  onSimulate,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-otp-sms');
  const [channel, setChannel] = useState<string>('SMS');
  const [sender, setSender] = useState<string>('VK-DEMATBLOCK');
  const [senderIdentifier, setSenderIdentifier] = useState<string>('+919123456789');
  const [claimedSource, setClaimedSource] = useState<string>('Depository Participant KYC Helpdesk');
  const [content, setContent] = useState<string>(PRESET_TEMPLATES[0].content);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = PRESET_TEMPLATES.find((t) => t.id === tplId);
    if (tpl) {
      setChannel(tpl.channel);
      setSender(tpl.sender);
      setSenderIdentifier(tpl.senderIdentifier);
      setClaimedSource(tpl.claimedSource);
      setContent(tpl.content);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide message content to analyze.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSimulate({
        source_channel: channel,
        sender,
        sender_identifier: senderIdentifier,
        claimed_source: claimedSource,
        content: content.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Simulation submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}
            >
              <Radio style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#c084fc', backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                  DEMO / SIMULATED
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Security Pipeline Test</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Simulate Incoming Communication
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: '#c084fc' }}>Transparent Simulation Protocol:</strong> Injects a test communication directly into IN V PROTECT's live AI & risk engine. The message will be analyzed, its source verified, classified into an appropriate protection tier, and recorded as <strong>DEMO / SIMULATED</strong>.
          </div>

          {/* Preset Selectors */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Select Scenario Template
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
              {PRESET_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: selectedTemplateId === tpl.id ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-card)',
                    border: `1px solid ${selectedTemplateId === tpl.id ? '#c084fc' : 'var(--border-color)'}`,
                    color: selectedTemplateId === tpl.id ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{tpl.title}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{tpl.channel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Channel & Sender Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              >
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
                <option value="Notification">Notification</option>
                <option value="Browser">Browser / Link</option>
                <option value="Financial Alert">Financial Alert</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Claimed Entity / Source
              </label>
              <input
                type="text"
                value={claimedSource}
                onChange={(e) => setClaimedSource(e.target.value)}
                placeholder="e.g. SEBI, RBI, Zerodha, HDFC Bank"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Display Sender
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. VK-DEMAT"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Actual Identifier / Handle
              </label>
              <input
                type="text"
                value={senderIdentifier}
                onChange={(e) => setSenderIdentifier(e.target.value)}
                placeholder="e.g. +919876543210 or sender@fake.com"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Message Text / Payload
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type communication content to evaluate..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#f87171', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={onClose}
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
              type="submit"
              disabled={submitting}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                backgroundColor: '#c084fc',
                border: 'none',
                color: '#000000',
                fontSize: '12px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Send style={{ width: '13px', height: '13px' }} />
              {submitting ? 'Running Pipeline...' : 'Run Pipeline & Ingest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
