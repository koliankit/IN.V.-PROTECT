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
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              margin: '0 0 4px 0',
            }}
          >
            SECURITY OVERVIEW
          </h1>
          <p style={{ fontSize: '13px', color: '#A7A7A7', margin: 0 }}>
            Continuous real-time protection for your financial communications
          </p>
        </div>
      </div>

      {/* Central Security Status Card */}
      <div
        className="glass-panel security-grid-bg"
        style={{
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Breathing Shield Container */}
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 44px',
            borderRadius: '20px',
            backgroundColor: hasHighRisk ? 'rgba(239, 68, 68, 0.06)' : 'rgba(2, 195, 154, 0.06)',
            border: hasHighRisk ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(2, 195, 154, 0.25)',
            marginBottom: '18px',
          }}
          className="animate-breathing"
        >
          {hasHighRisk ? (
            <ShieldAlert
              style={{
                width: '60px',
                height: '60px',
                color: '#EF4444',
                filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.45))',
                marginBottom: '12px',
              }}
            />
          ) : (
            <ShieldCheck
              style={{
                width: '60px',
                height: '60px',
                color: '#02C39A',
                filter: 'drop-shadow(0 0 12px rgba(2, 195, 154, 0.45))',
                marginBottom: '12px',
              }}
            />
          )}

          <div
            style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
            }}
          >
            {hasHighRisk ? 'QUARANTINE ACTIVE' : 'PROTECTED'}
          </div>

          <div
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#A7A7A7',
              marginTop: '6px',
            }}
          >
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
            color: '#A7A7A7',
          }}
        >
          <Clock style={{ width: '13px', height: '13px', color: '#02C39A' }} />
          <span>Last security scan: <strong style={{ color: '#FFFFFF' }}>{lastScanTime}</strong></span>
        </div>
      </div>

      {/* 3-Pill Threat & Protection Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        {/* Trusted Metric */}
        <div
          className="glass-panel"
          style={{
            borderRadius: '14px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#A7A7A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TRUSTED
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF' }}>
              {trustedCount}
            </div>
            <div style={{ fontSize: '11px', color: '#A7A7A7', marginTop: '2px' }}>
              Verified authentic sources
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10B981' }} />
          </div>
        </div>

        {/* Review Metric */}
        <div
          className="glass-panel"
          style={{
            borderRadius: '14px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 6px #F59E0B',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#A7A7A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                REVIEW
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF' }}>
              {reviewCount}
            </div>
            <div style={{ fontSize: '11px', color: '#A7A7A7', marginTop: '2px' }}>
              Unverified market claims
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
          </div>
        </div>

        {/* High Risk Metric */}
        <div
          onClick={onNavigateAlerts}
          className="glass-panel"
          style={{
            borderRadius: '14px',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: onNavigateAlerts ? 'pointer' : 'default',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  boxShadow: '0 0 6px #EF4444',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#A7A7A7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                HIGH RISK
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF' }}>
              {riskCount}
            </div>
            <div style={{ fontSize: '11px', color: '#A7A7A7', marginTop: '2px' }}>
              Scam & harvest indicators
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertOctagon style={{ width: '20px', height: '20px', color: '#EF4444' }} />
          </div>
        </div>
      </div>

      {/* Recent Security Events List */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
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
                  gap: '5px',
                  backgroundColor: 'rgba(2, 195, 154, 0.08)',
                  color: '#02C39A',
                  border: '1px solid rgba(2, 195, 154, 0.25)',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Search style={{ width: '12px', height: '12px' }} />
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
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Camera style={{ width: '12px', height: '12px' }} />
                Face Biometrics
              </button>
            )}
            <span style={{ fontSize: '11px', color: '#A7A7A7' }}>
              Live communication streams
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentMessages.slice(0, 5).map((msg) => {
            const isHighRisk = msg.protection_tier === 'Quarantined / High Risk' || msg.risk_level === 'High Concern';
            const isReview = msg.protection_tier === 'Review / Verify' || msg.risk_level === 'Needs Verification';
            const statusColor = isHighRisk ? '#EF4444' : isReview ? '#F59E0B' : '#10B981';
            const statusLabel = isHighRisk ? 'HIGH RISK' : isReview ? 'REVIEW' : 'TRUSTED';

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage && onSelectMessage(msg)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: onSelectMessage ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  {/* Subtle Status Indicator Dot */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: statusColor,
                      boxShadow: `0 0 6px ${statusColor}`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msg.sender || msg.source_channel || 'Financial Message'}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#A7A7A7',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {msg.content || msg.snippet}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '14px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: `${statusColor}18`,
                      color: statusColor,
                      border: `1px solid ${statusColor}44`,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {statusLabel}
                  </span>
                  <ArrowUpRight style={{ width: '13px', height: '13px', color: '#A7A7A7' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
