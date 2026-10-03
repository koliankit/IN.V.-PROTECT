import React from 'react';
import { ShieldAlert, ShieldCheck, Clock, CheckCircle2, AlertTriangle, AlertOctagon, ArrowUpRight, Search, Camera } from 'lucide-react';
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
  onNavigateFaceScan,
}) => {
  const hasHighRisk = riskCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: hasHighRisk ? '#FF3B3B' : '#20D98A',
                boxShadow: `0 0 8px ${hasHighRisk ? '#FF3B3B' : '#20D98A'}`,
              }}
            />
            <h1
              style={{
                fontSize: '15px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              SECURITY OVERVIEW
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#AEB7C2', margin: 0 }}>
            Continuous real-time threat interception for Indian retail financial communications
          </p>
        </div>
      </div>

      {/* Hero Security Overview Panel (Section 5) */}
      <div
        className={`glass-panel-primary glossy-reflection ${hasHighRisk ? 'glow-risk' : 'glow-trusted'}`}
        style={{
          borderRadius: '20px',
          padding: '42px 28px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: hasHighRisk ? 'rgba(255, 59, 59, 0.025)' : 'rgba(32, 217, 138, 0.02)',
        }}
      >
        {/* Ambient Radial Backlight */}
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '420px',
            height: '240px',
            background: hasHighRisk
              ? 'radial-gradient(ellipse at 50% 20%, rgba(255, 59, 59, 0.14) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 20%, rgba(32, 217, 138, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Breathing Shield Emblem */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 48px',
            borderRadius: '22px',
            backgroundColor: hasHighRisk ? 'rgba(255, 59, 59, 0.06)' : 'rgba(32, 217, 138, 0.06)',
            border: hasHighRisk ? '1px solid rgba(255, 59, 59, 0.28)' : '1px solid rgba(32, 217, 138, 0.28)',
            boxShadow: hasHighRisk ? '0 8px 32px rgba(255, 59, 59, 0.15)' : '0 8px 32px rgba(32, 217, 138, 0.12)',
            marginBottom: '18px',
            position: 'relative',
            zIndex: 1,
          }}
          className="animate-breathing"
        >
          {hasHighRisk ? (
            <ShieldAlert
              style={{
                width: '64px',
                height: '64px',
                color: '#FF3B3B',
                filter: 'drop-shadow(0 0 16px rgba(255, 59, 59, 0.55))',
                marginBottom: '12px',
              }}
            />
          ) : (
            <ShieldCheck
              style={{
                width: '64px',
                height: '64px',
                color: '#20D98A',
                filter: 'drop-shadow(0 0 16px rgba(32, 217, 138, 0.55))',
                marginBottom: '12px',
              }}
            />
          )}

          <div
            style={{
              fontSize: '26px',
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            }}
          >
            {hasHighRisk ? 'QUARANTINE ACTIVE' : 'PROTECTED'}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: hasHighRisk ? '#FF9F9F' : '#A7F3D0',
              marginTop: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: hasHighRisk ? '#FF3B3B' : '#20D98A',
              }}
            />
            {hasHighRisk
              ? `${riskCount} high-risk threat${riskCount > 1 ? 's' : ''} quarantined`
              : 'Zero credentials collected • All communications verified'}
          </div>
        </div>

        {/* Last Security Scan Live Value */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#AEB7C2',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Clock style={{ width: '13px', height: '13px', color: '#AEB7C2' }} />
          <span>
            Last security scan:{' '}
            <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{lastScanTime}</strong>
          </span>
        </div>
      </div>

      {/* 3 Metric Cards: Trusted / Review / High Risk (Section 6) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* TRUSTED CARD */}
        <div
          className="glass-panel glossy-reflection"
          style={{
            borderRadius: '16px',
            padding: '22px',
            backgroundColor: 'rgba(32, 217, 138, 0.03)',
            borderColor: 'rgba(32, 217, 138, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#20D98A',
                  boxShadow: '0 0 8px #20D98A',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#20D98A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                TRUSTED
              </span>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(32, 217, 138, 0.10)',
                border: '1px solid rgba(32, 217, 138, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 style={{ width: '18px', height: '18px', color: '#20D98A' }} />
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1,
                marginBottom: '6px',
              }}
            >
              {trustedCount < 10 ? `0${trustedCount}` : trustedCount}
            </div>
            <div style={{ fontSize: '12px', color: '#AEB7C2' }}>
              Verified authentic sources
            </div>
          </div>
        </div>

        {/* REVIEW CARD */}
        <div
          className="glass-panel glossy-reflection"
          style={{
            borderRadius: '16px',
            padding: '22px',
            backgroundColor: 'rgba(255, 176, 32, 0.03)',
            borderColor: 'rgba(255, 176, 32, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FFB020',
                  boxShadow: '0 0 8px #FFB020',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#FFB020',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                REVIEW
              </span>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 176, 32, 0.10)',
                border: '1px solid rgba(255, 176, 32, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle style={{ width: '18px', height: '18px', color: '#FFB020' }} />
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1,
                marginBottom: '6px',
              }}
            >
              {reviewCount < 10 ? `0${reviewCount}` : reviewCount}
            </div>
            <div style={{ fontSize: '12px', color: '#AEB7C2' }}>
              Unverified market claims
            </div>
          </div>
        </div>

        {/* HIGH RISK CARD */}
        <div
          onClick={onNavigateAlerts}
          className="glass-panel glossy-reflection"
          style={{
            borderRadius: '16px',
            padding: '22px',
            backgroundColor: 'rgba(255, 59, 59, 0.04)',
            borderColor: 'rgba(255, 59, 59, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: onNavigateAlerts ? 'pointer' : 'default',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FF3B3B',
                  boxShadow: '0 0 8px #FF3B3B',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#FF3B3B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                HIGH RISK
              </span>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 59, 59, 0.12)',
                border: '1px solid rgba(255, 59, 59, 0.30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertOctagon style={{ width: '18px', height: '18px', color: '#FF3B3B' }} />
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1,
                marginBottom: '6px',
              }}
            >
              {riskCount < 10 ? `0${riskCount}` : riskCount}
            </div>
            <div style={{ fontSize: '12px', color: '#AEB7C2' }}>
              Scam & harvest indicators
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Events Stream (Section 7) */}
      <div
        className="glass-panel glossy-reflection"
        style={{
          borderRadius: '18px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Recent Security Events
            </div>
            <div style={{ fontSize: '12px', color: '#6F7A86', marginTop: '2px' }}>
              Real-time financial communication stream & audit log
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onNavigateVerify && (
              <button
                type="button"
                onClick={onNavigateVerify}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Search style={{ width: '12px', height: '12px', color: '#AEB7C2' }} />
                Verify Claim
              </button>
            )}
            {onNavigateFaceScan && (
              <button
                type="button"
                onClick={onNavigateFaceScan}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Camera style={{ width: '12px', height: '12px', color: '#AEB7C2' }} />
                Face Biometrics
              </button>
            )}
          </div>
        </div>

        {/* Event List with Clean Subtle Separators */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recentMessages.slice(0, 5).map((msg, index) => {
            const isHighRisk = msg.protection_tier === 'Quarantined / High Risk' || msg.risk_level === 'High Concern';
            const isReview = msg.protection_tier === 'Review / Verify' || msg.risk_level === 'Needs Verification';
            const statusColor = isHighRisk ? '#FF3B3B' : isReview ? '#FFB020' : '#20D98A';
            const statusLabel = isHighRisk ? 'HIGH RISK' : isReview ? 'REVIEW' : 'TRUSTED';

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage && onSelectMessage(msg)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 12px',
                  borderBottom: index < Math.min(recentMessages.length, 5) - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  cursor: onSelectMessage ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                  borderRadius: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                  {/* Glowing Status Dot */}
                  <div
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: statusColor,
                      boxShadow: `0 0 8px ${statusColor}`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        {msg.sender || msg.source_channel || 'Financial Message'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#6F7A86' }}>
                        • {msg.source_channel || 'SMS'} • {msg.timestamp || '2 min ago'}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#AEB7C2',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '560px',
                      }}
                    >
                      {msg.content || msg.snippet}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '16px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: `${statusColor}18`,
                      color: statusColor,
                      border: `1px solid ${statusColor}40`,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {statusLabel}
                  </span>
                  <ArrowUpRight style={{ width: '14px', height: '14px', color: '#6F7A86' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
