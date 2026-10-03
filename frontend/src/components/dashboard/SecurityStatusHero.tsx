import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Laptop,
  Smartphone,
  Watch,
} from 'lucide-react';
import { SecureMessage } from '../../types';

interface SecurityStatusHeroProps {
  trustedCount: number;
  reviewCount: number;
  riskCount: number;
  recentMessages: SecureMessage[];
  lastScanTime?: string;
  onSelectMessage?: (msg: SecureMessage) => void;
  onNavigateVerify?: () => void;
  onNavigateAlerts?: () => void;
  onNavigateFaceScan?: () => void;
}

export const SecurityStatusHero: React.FC<SecurityStatusHeroProps> = ({
  trustedCount,
  reviewCount,
  riskCount,
  recentMessages,
  lastScanTime = '2 min ago',
  onSelectMessage,
  onNavigateVerify,
  onNavigateAlerts,
}) => {
  const hasHighRisk = riskCount > 0;
  const criticalThreat = recentMessages.find((m) => m.protection_tier === 'Quarantined / High Risk') || recentMessages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* ============================================================== */}
      {/* 1. DOMINANT PRIMARY VISUAL AREA: SECURITY STATUS (SECTION 8)    */}
      {/* ============================================================== */}
      <div
        style={{
          backgroundColor: '#0D0D0D',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          padding: '48px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasHighRisk
            ? '0 24px 64px rgba(255, 59, 59, 0.08)'
            : '0 24px 64px rgba(2, 195, 154, 0.06)',
        }}
      >
        {/* Subtle Ambient Depth Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '540px',
            height: '280px',
            background: hasHighRisk
              ? 'radial-gradient(ellipse at 50% 30%, rgba(255, 59, 59, 0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(2, 195, 154, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Status Header Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: hasHighRisk ? '#FF3B3B' : '#02C39A',
              boxShadow: `0 0 10px ${hasHighRisk ? '#FF3B3B' : '#02C39A'}`,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: hasHighRisk ? '#FF5252' : '#02C39A',
            }}
          >
            YOUR DIGITAL SECURITY STATUS
          </span>
        </div>

        {/* Dominant Current Status Title (Large Cinematic Typography 48-60px) */}
        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 0 16px 0',
            maxWidth: '820px',
            position: 'relative',
            zIndex: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {hasHighRisk ? 'ATTENTION REQUIRED: THREAT ISOLATED' : 'PROTECTED & MONITORED'}
        </h1>

        {/* Subtitle with generous spacing */}
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#A7A7A7',
            maxWidth: '680px',
            margin: '0 auto 32px auto',
            position: 'relative',
            zIndex: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {hasHighRisk
            ? `${riskCount} high-risk fraudulent solicitation${riskCount > 1 ? 's were' : ' was'} intercepted and isolated in the zero-trust quarantine vault with statutory regulatory evidence.`
            : 'Zero unverified solicitations active. Continuous multi-vector investor defense is active across your financial communications, SMS, and connected devices.'}
        </p>

        {/* Restrained Status Pillars: 3 Clean Metric Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Trusted Metric */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(32, 217, 138, 0.08)',
              border: '1px solid rgba(32, 217, 138, 0.22)',
              padding: '10px 20px',
              borderRadius: '16px',
            }}
          >
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#20D98A' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              {trustedCount} Trusted & Authentic
            </span>
          </div>

          {/* Review Metric */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 176, 32, 0.08)',
              border: '1px solid rgba(255, 176, 32, 0.22)',
              padding: '10px 20px',
              borderRadius: '16px',
            }}
          >
            <AlertTriangle style={{ width: '16px', height: '16px', color: '#FFB020' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
              {reviewCount} Under Review
            </span>
          </div>

          {/* High Risk Metric */}
          <div
            onClick={onNavigateAlerts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: hasHighRisk ? 'rgba(255, 59, 59, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: hasHighRisk ? '1px solid rgba(255, 59, 59, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 20px',
              borderRadius: '16px',
              cursor: onNavigateAlerts ? 'pointer' : 'default',
            }}
          >
            <AlertOctagon style={{ width: '16px', height: '16px', color: hasHighRisk ? '#FF3B3B' : '#A7A7A7' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: hasHighRisk ? '#FF5252' : '#FFFFFF' }}>
              {riskCount} High Risk Quarantined
            </span>
          </div>
        </div>

        {/* Last Heartbeat Telemetry */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#666666',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Clock style={{ width: '12px', height: '12px', color: '#666666' }} />
          <span>Continuous protection heartbeat active • Last evaluation {lastScanTime}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. RECENT THREAT OR LATEST ANALYSIS SPOTLIGHT (SECTION 8 & 9)   */}
      {/* ============================================================== */}
      {criticalThreat && (
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: hasHighRisk
              ? '1px solid rgba(255, 59, 59, 0.25)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Spotlight Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: hasHighRisk ? 'rgba(255, 59, 59, 0.15)' : 'rgba(2, 195, 154, 0.15)',
                  color: hasHighRisk ? '#FF5252' : '#02C39A',
                  border: hasHighRisk ? '1px solid rgba(255, 59, 59, 0.3)' : '1px solid rgba(2, 195, 154, 0.3)',
                }}
              >
                {hasHighRisk ? 'LATEST INTERCEPTED THREAT' : 'LATEST ANALYZED COMMUNICATION'}
              </span>
              <span style={{ fontSize: '12px', color: '#666666' }}>•</span>
              <span style={{ fontSize: '12px', color: '#A7A7A7' }}>
                Channel: <strong style={{ color: '#FFFFFF' }}>{criticalThreat.source_channel}</strong>
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#666666' }}>
              ID: {criticalThreat.id} • {criticalThreat.timestamp}
            </div>
          </div>

          {/* Threat Title & Sender */}
          <div>
            <div style={{ fontSize: '13px', color: '#A7A7A7', marginBottom: '4px' }}>
              Sender: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{criticalThreat.sender}</span> ({criticalThreat.sender_identifier})
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {criticalThreat.claims?.[0]?.claim_text || 'Impersonation & Unauthorized Financial Solicitation'}
            </h3>
          </div>

          {/* Verbatim Content Box */}
          <div
            style={{
              backgroundColor: '#171717',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '14px',
              padding: '16px 20px',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#CBD5E1',
              fontStyle: 'italic',
            }}
          >
            "{criticalThreat.content}"
          </div>

          {/* Why? Detected Signals Summary */}
          {criticalThreat.detected_signals && criticalThreat.detected_signals.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666666' }}>
                Why This Was Flagged (Regulatory Evidence & Telemetry):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {criticalThreat.detected_signals.map((sig, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'rgba(255, 59, 59, 0.08)',
                      border: '1px solid rgba(255, 59, 59, 0.22)',
                      color: '#FF9F9F',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontWeight: 500,
                    }}
                  >
                    ● {sig.name || sig.description}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '12px', color: '#A7A7A7' }}>
              Recommended: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Do not share credentials or OTP. Report to CyberCrime 1930.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {onNavigateVerify && (
                <button
                  onClick={onNavigateVerify}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#A7A7A7',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Verify Sender ID
                </button>
              )}

              {onNavigateAlerts && (
                <button
                  onClick={onNavigateAlerts}
                  style={{
                    backgroundColor: hasHighRisk ? '#FF3B3B' : '#02C39A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Inspect in Quarantine Vault
                  <ArrowRight style={{ width: '13px', height: '13px' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUPPORTING INFORMATION ROW: RECENT ALERTS & ECOSYSTEM       */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Supporting Card 1: Recent Activity Stream */}
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666666' }}>
                Recent Alerts & Feed
              </div>
              <span style={{ fontSize: '11px', color: '#02C39A', fontWeight: 600 }}>Live Triage</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentMessages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onSelectMessage && onSelectMessage(msg)}
                  style={{
                    backgroundColor: '#171717',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    cursor: onSelectMessage ? 'pointer' : 'default',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {msg.sender}
                    </div>
                    <div style={{ fontSize: '11px', color: '#A7A7A7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                      {msg.snippet || msg.content}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor:
                        msg.protection_tier === 'Quarantined / High Risk'
                          ? 'rgba(255, 59, 59, 0.15)'
                          : msg.protection_tier === 'Review / Verify'
                          ? 'rgba(255, 176, 32, 0.15)'
                          : 'rgba(32, 217, 138, 0.15)',
                      color:
                        msg.protection_tier === 'Quarantined / High Risk'
                          ? '#FF5252'
                          : msg.protection_tier === 'Review / Verify'
                          ? '#FFB020'
                          : '#20D98A',
                    }}
                  >
                    {msg.protection_tier === 'Quarantined / High Risk' ? 'QUARANTINE' : msg.protection_tier === 'Review / Verify' ? 'REVIEW' : 'TRUSTED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supporting Card 2: Connected Ecosystem (PC, Mobile, Smartwatch) */}
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666666' }}>
                Protected Investor Devices
              </div>
              <span style={{ fontSize: '11px', color: '#02C39A', fontWeight: 600 }}>Mutual Zero-Trust</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* PC Desktop */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171717', padding: '10px 14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Laptop style={{ width: '16px', height: '16px', color: '#A7A7A7' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Windows 11 Workstation</div>
                    <div style={{ fontSize: '10px', color: '#666666' }}>Browser & Notification Firewall</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#20D98A', backgroundColor: 'rgba(32, 217, 138, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  PROTECTED
                </span>
              </div>

              {/* Smartphone */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171717', padding: '10px 14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Smartphone style={{ width: '16px', height: '16px', color: '#A7A7A7' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Primary Smartphone</div>
                    <div style={{ fontSize: '10px', color: '#666666' }}>SMS Interceptor & Biometrics</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#20D98A', backgroundColor: 'rgba(32, 217, 138, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  PROTECTED
                </span>
              </div>

              {/* Smartwatch Companion */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#171717', padding: '10px 14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Watch style={{ width: '16px', height: '16px', color: '#A7A7A7' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Wear OS Smartwatch</div>
                    <div style={{ fontSize: '10px', color: '#666666' }}>Rapid Wrist Haptic Triage</div>
                  </div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#20D98A', backgroundColor: 'rgba(32, 217, 138, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  PAIRED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Card 3: Statutory Grounded Verification RAG */}
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666666' }}>
                Statutory Regulatory Source Feeds
              </div>
              <span style={{ fontSize: '11px', color: '#02C39A', fontWeight: 600 }}>Active RAG</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'SEBI Official Broker & RIA Registry', desc: 'Entities licensed under SEBI (Intermediaries) Reg.', code: 'SEBI' },
                { name: 'Reserve Bank of India (RBI)', desc: 'Official NBFC & Sachet Unauthorized Schemes List', code: 'RBI' },
                { name: 'I4C National Cybercrime Portal', desc: 'Active financial fraud modus operandi repository', code: '1930' },
              ].map((src, i) => (
                <div key={i} style={{ backgroundColor: '#171717', padding: '10px 14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{src.name}</span>
                    <span style={{ fontSize: '10px', color: '#02C39A', fontWeight: 700 }}>{src.code}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#A7A7A7', marginTop: '2px' }}>{src.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
