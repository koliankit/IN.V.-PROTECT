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
  lastScanTime = 'Just now',
  onSelectMessage,
  onNavigateVerify,
  onNavigateAlerts,
  onNavigateFaceScan,
}) => {
  const hasHighRisk = riskCount > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Central Security Status Card */}
      <div
        style={{
          backgroundColor: '#0b101d',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '36px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        }}
        className="security-grid-bg"
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748b',
            marginBottom: '18px',
          }}
        >
          Your Digital Financial Security Posture
        </div>

        {/* Breathing Shield Container */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 36px',
            borderRadius: '20px',
            backgroundColor: hasHighRisk ? 'rgba(239, 68, 68, 0.06)' : 'rgba(16, 185, 129, 0.06)',
            border: hasHighRisk ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '16px',
          }}
          className="animate-breathing"
        >
          {hasHighRisk ? (
            <ShieldAlert
              style={{
                width: '54px',
                height: '54px',
                color: '#ef4444',
                filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))',
                marginBottom: '10px',
              }}
            />
          ) : (
            <ShieldCheck
              style={{
                width: '54px',
                height: '54px',
                color: '#10b981',
                filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))',
                marginBottom: '10px',
              }}
            />
          )}

          <div
            style={{
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: hasHighRisk ? '#fca5a5' : '#a7f3d0',
            }}
          >
            {hasHighRisk ? 'QUARANTINE ACTIVE' : 'PROTECTED'}
          </div>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              marginTop: '4px',
            }}
          >
            {hasHighRisk
              ? `${riskCount} high-risk threat${riskCount > 1 ? 's' : ''} quarantined`
              : 'Continuous device firewall inspecting all communications'}
          </div>
        </div>

        {/* Last Scan Live Timestamp */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <Clock style={{ width: '13px', height: '13px' }} />
          <span>Last automated scan: <strong style={{ color: '#cbd5e1' }}>{lastScanTime}</strong></span>
        </div>
      </div>

      {/* 3-Pill Threat & Protection Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}
      >
        {/* Trusted Metric */}
        <div
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid rgba(16, 185, 129, 0.22)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Trusted / Important
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              {trustedCount}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Verified authentic sources
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981' }} />
          </div>
        </div>

        {/* Review Metric */}
        <div
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid rgba(245, 158, 11, 0.22)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Review / Verify
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              {reviewCount}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Unverified market claims
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
          </div>
        </div>

        {/* High Risk Metric */}
        <div
          onClick={onNavigateAlerts}
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: onNavigateAlerts ? 'pointer' : 'default',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              High Risk / Quarantined
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
              {riskCount}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Scam & harvest indicators
            </div>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertOctagon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
          </div>
        </div>
      </div>

      {/* Recent Security Events List */}
      <div
        style={{
          backgroundColor: '#0b101d',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '20px 22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
            Recent Security Events
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigateVerify && (
              <button
                type="button"
                onClick={onNavigateVerify}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  color: '#22d3ee',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Search style={{ width: '11px', height: '11px' }} />
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
                  gap: '4px',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Camera style={{ width: '11px', height: '11px' }} />
                Face Biometrics
              </button>
            )}
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Live communication streams
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentMessages.slice(0, 5).map((msg) => {
            const isHighRisk = msg.protection_tier === 'Quarantined / High Risk' || msg.risk_level === 'High Concern';
            const isReview = msg.protection_tier === 'Review / Verify' || msg.risk_level === 'Needs Verification';
            const statusColor = isHighRisk ? '#ef4444' : isReview ? '#f59e0b' : '#10b981';
            const statusLabel = isHighRisk ? 'HIGH RISK' : isReview ? 'REVIEW' : 'TRUSTED';

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage && onSelectMessage(msg)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: onSelectMessage ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  {/* Subtle Status Dot */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: statusColor,
                      boxShadow: `0 0 6px ${statusColor}66`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#f8fafc',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msg.sender || msg.source_channel || 'Financial Message'}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msg.content || msg.snippet}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: '12px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: `${statusColor}18`,
                      color: statusColor,
                      border: `1px solid ${statusColor}33`,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {statusLabel}
                  </span>
                  <ArrowUpRight style={{ width: '13px', height: '13px', color: '#64748b' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
