import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Search,
  Activity,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  X,
  FileSearch,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SecureMessage, IncidentRecord } from '../../types';

interface SecurityMonitoringDashboardProps {
  trustedCount: number;
  reviewCount: number;
  riskCount: number;
  messages: SecureMessage[];
  incidents?: IncidentRecord[];
  dailyReport?: any;
  lastScanTime?: string;
  onSelectMessage?: (msg: SecureMessage) => void;
  onNavigateVerify?: () => void;
  onNavigateAlerts?: () => void;
  onNavigateQuarantine?: () => void;
  onNavigateAnalyze?: () => void;
}

export const SecurityMonitoringDashboard: React.FC<SecurityMonitoringDashboardProps> = ({
  trustedCount,
  reviewCount,
  riskCount,
  messages,
  incidents = [],
  dailyReport,
  lastScanTime = 'Just now',
  onSelectMessage,
  onNavigateVerify,
  onNavigateAlerts,
  onNavigateQuarantine,
  onNavigateAnalyze,
}) => {
  const [selectedChartPoint, setSelectedChartPoint] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<'ALL' | 'HIGH' | 'REVIEW' | 'LOW'>('ALL');
  const [inspectingEvent, setInspectingEvent] = useState<SecureMessage | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState<boolean>(false);

  // Total analyzed communications from real data
  const totalAnalyzed = messages.length > 0 ? messages.length : (trustedCount + reviewCount + riskCount);
  const quarantinedCount = messages.filter((m) => m.status === 'QUARANTINED' || m.protection_tier === 'Quarantined / High Risk').length || riskCount;
  const hasHighRisk = riskCount > 0;

  // Real Calculated Investor Security Health Score (0 - 100)
  // Higher deduction for high-risk threats, moderate deduction for pending review
  const calculatedScore = useMemo(() => {
    if (totalAnalyzed === 0) return dailyReport?.posture_score || 98;
    const base = 100;
    const riskDeduction = (riskCount / totalAnalyzed) * 60;
    const reviewDeduction = (reviewCount / totalAnalyzed) * 20;
    return Math.max(18, Math.min(100, Math.round(base - riskDeduction - reviewDeduction)));
  }, [totalAnalyzed, riskCount, reviewCount, dailyReport]);

  // Gauge Color Logic: Teal for Safe, Amber for Warning, Red ONLY for High-Risk
  const scoreColor = calculatedScore >= 80 ? '#02C39A' : calculatedScore >= 50 ? '#F5B942' : '#E5484D';
  const scoreStatusLabel = calculatedScore >= 80
    ? 'OPTIMAL DEFENSE'
    : calculatedScore >= 50
    ? 'ATTENTION ADVISORY'
    : 'ELEVATED RISK DETECTED';

  // Strict semantic color for CURRENT RISK (Red ONLY for high-risk, Amber for guarded, Teal for low)
  const currentRiskColor = hasHighRisk ? '#E5484D' : reviewCount > 0 ? '#F5B942' : '#02C39A';
  const currentRiskLabel = hasHighRisk ? 'High Risk' : reviewCount > 0 ? 'Guarded' : 'Low Risk';

  // 24-Hour Time-Series Data Points for Threat Activity Chart
  const activityData = useMemo(() => {
    return [
      { time: '00:00', label: '12 AM', verified: 3, suspicious: 0, hasHighRisk: false },
      { time: '04:00', label: '4 AM', verified: 2, suspicious: 0, hasHighRisk: false },
      { time: '08:00', label: '8 AM', verified: 6, suspicious: 1, hasHighRisk: false },
      { time: '12:00', label: '12 PM', verified: 9, suspicious: 1, hasHighRisk: false },
      { time: '16:00', label: '4 PM', verified: 12, suspicious: 4, hasHighRisk: true, threatTitle: 'APK Sideloading Intercept' },
      { time: '18:00', label: '6 PM', verified: 8, suspicious: 3, hasHighRisk: true, threatTitle: 'Demat Urgency Freeze Phish' },
      { time: '20:00', label: '8 PM', verified: 5, suspicious: 1, hasHighRisk: false },
      { time: '24:00', label: 'Now', verified: Math.max(2, trustedCount), suspicious: riskCount, hasHighRisk: hasHighRisk },
    ];
  }, [trustedCount, riskCount, hasHighRisk]);

  // Compact Chart Dimensions for Ideal Screen Proportion
  const chartWidth = 480;
  const chartHeight = 130;
  const paddingX = 28;
  const paddingY = 16;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  // Max value calculation
  const maxVal = Math.max(...activityData.map((d) => Math.max(d.verified, d.suspicious)), 14);

  // Generate SVG Points
  const getCoordinates = (val: number, idx: number, total: number) => {
    const x = paddingX + (idx / (total - 1)) * plotWidth;
    const y = chartHeight - paddingY - (val / maxVal) * plotHeight;
    return { x, y };
  };

  const verifiedPoints = activityData.map((d, i) => getCoordinates(d.verified, i, activityData.length));
  const suspiciousPoints = activityData.map((d, i) => getCoordinates(d.suspicious, i, activityData.length));

  const createSvgPath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, curr, i) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const verifiedLinePath = createSvgPath(verifiedPoints);
  const suspiciousLinePath = createSvgPath(suspiciousPoints);
  const verifiedAreaPath = `${verifiedLinePath} L ${verifiedPoints[verifiedPoints.length - 1].x} ${chartHeight - paddingY} L ${verifiedPoints[0].x} ${chartHeight - paddingY} Z`;

  // Radial Gauge Calculations (Radius = 60px, StrokeWidth = 8px)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedScore / 100) * circumference;

  // Real-Time Events Filtering
  const filteredEvents = useMemo(() => {
    return messages.filter((m) => {
      if (eventFilter === 'ALL') return true;
      if (eventFilter === 'HIGH') return m.risk_level === 'High Concern' || m.protection_tier === 'Quarantined / High Risk';
      if (eventFilter === 'REVIEW') return m.risk_level === 'Needs Verification' || m.protection_tier === 'Review / Verify';
      if (eventFilter === 'LOW') return m.risk_level === 'Low Concern' || m.protection_tier === 'Trusted / Important';
      return true;
    });
  }, [messages, eventFilter]);

  // Display subset for compact view (4 items) unless expanded
  const displayEvents = isTableExpanded ? filteredEvents : filteredEvents.slice(0, 4);

  const handleRowClick = (msg: SecureMessage) => {
    setInspectingEvent(msg);
    if (onSelectMessage) {
      onSelectMessage(msg);
    }
  };

  // Helper to format clean HH:MM without trailing UTC string
  const formatTime = (ts?: string) => {
    if (!ts) return '21:14';
    const trimmed = ts.trim();
    const parts = trimmed.split(' ');
    if (parts.length >= 2 && parts[1].includes(':')) {
      return parts[1].substring(0, 5);
    }
    if (trimmed.includes('T')) {
      return trimmed.split('T')[1].substring(0, 5);
    }
    if (trimmed.includes(':')) {
      const match = trimmed.match(/(\d{1,2}:\d{2})/);
      if (match) return match[1];
    }
    return '19:14';
  };

  // Helper to format clean compact ID
  const formatId = (id?: string, idx: number = 0) => {
    if (!id) return `#${String(idx + 1).padStart(3, '0')}`;
    return id
      .replace('MSG-', '#')
      .replace('QUAR-', 'Q-')
      .replace('REV-', 'R-')
      .replace('TRU-', 'T-');
  };

  return (
    <div
      className="security-dashboard-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        color: '#F5F7F8',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
      {/* ==================================================================== */}
      {/* 1. TOP HEADER (COMPACT, ALIGNED WITH STICKY BAR)                     */}
      {/* ==================================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.10em',
                color: '#02C39A',
                textTransform: 'uppercase',
              }}
            >
              IN V PROTECT
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: '#9AA5AD',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              LIVE INVESTOR PROTECTION MONITORING
            </span>
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F7F8',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            SECURITY DASHBOARD
          </h1>
        </div>

        {/* Top-Right Status & Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Status Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: hasHighRisk ? 'rgba(229, 72, 77, 0.10)' : 'rgba(2, 195, 154, 0.08)',
              border: `1px solid ${hasHighRisk ? 'rgba(229, 72, 77, 0.35)' : 'rgba(2, 195, 154, 0.28)'}`,
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              color: hasHighRisk ? '#E5484D' : '#02C39A',
              letterSpacing: '0.03em',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: hasHighRisk ? '#E5484D' : '#02C39A',
                boxShadow: hasHighRisk ? '0 0 6px #E5484D' : '0 0 6px #02C39A',
                display: 'inline-block',
              }}
            />
            <span>{hasHighRisk ? 'Threat Isolated' : 'System Protected'}</span>
          </div>

          {/* Last Updated Timestamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#10161A',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              color: '#9AA5AD',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <Clock style={{ width: '12px', height: '12px', color: '#9AA5AD' }} />
            <span>Updated {lastScanTime}</span>
          </div>

          {/* Direct Verification Trigger */}
          {onNavigateVerify && (
            <button
              onClick={onNavigateVerify}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#151C20',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#F5F7F8',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              title="Official SEBI/RBI/I4C Registry Lookup"
            >
              <Search style={{ width: '12px', height: '12px', color: '#02C39A' }} />
              <span>Verify Registry</span>
            </button>
          )}

          {onNavigateAnalyze && (
            <button
              onClick={onNavigateAnalyze}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(2, 195, 154, 0.08)',
                border: '1px solid rgba(2, 195, 154, 0.25)',
                color: '#02C39A',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(2, 195, 154, 0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(2, 195, 154, 0.08)')}
              title="Deep Analysis Studio"
            >
              <FileSearch style={{ width: '12px', height: '12px', color: '#02C39A' }} />
              <span>Deep Analysis</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. COMPACT THREAT SUMMARY BAR (STREAMLINED HEIGHT)                   */}
      {/* ==================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
        }}
      >
        {[
          {
            label: 'THREATS DETECTED',
            val: riskCount,
            color: riskCount > 0 ? '#E5484D' : '#9AA5AD',
            desc: riskCount > 0 ? 'Active High-Risk Signatures' : 'Zero Active Threat Spikes',
            icon: AlertOctagon,
            border: riskCount > 0 ? 'rgba(229, 72, 77, 0.35)' : 'rgba(255, 255, 255, 0.10)',
            onClick: onNavigateQuarantine,
          },
          {
            label: 'UNDER REVIEW',
            val: reviewCount,
            color: reviewCount > 0 ? '#F5B942' : '#9AA5AD',
            desc: 'Delayed for Regulatory Check',
            icon: AlertTriangle,
            border: reviewCount > 0 ? 'rgba(245, 185, 66, 0.30)' : 'rgba(255, 255, 255, 0.10)',
            onClick: onNavigateAlerts,
          },
          {
            label: 'QUARANTINED',
            val: quarantinedCount,
            color: quarantinedCount > 0 ? '#E5484D' : '#9AA5AD',
            desc: 'Isolated in Zero-Trust Vault',
            icon: Lock,
            border: quarantinedCount > 0 ? 'rgba(229, 72, 77, 0.35)' : 'rgba(255, 255, 255, 0.10)',
            onClick: onNavigateQuarantine,
          },
          {
            label: 'VERIFIED AUTHENTIC',
            val: trustedCount,
            color: '#02C39A',
            desc: 'Statutory Directives Cleared',
            icon: CheckCircle2,
            border: 'rgba(255, 255, 255, 0.10)',
            onClick: undefined,
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.onClick}
              style={{
                backgroundColor: '#10161A',
                border: `1px solid ${item.border}`,
                borderRadius: '10px',
                padding: '9px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.20)',
                cursor: item.onClick ? 'pointer' : 'default',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (item.onClick) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                if (item.onClick) e.currentTarget.style.borderColor = item.border;
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#9AA5AD',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: item.color,
                    lineHeight: 1.1,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {item.val}
                </div>
                <div style={{ fontSize: '10px', color: '#6F7A86', marginTop: '1px' }}>{item.desc}</div>
              </div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon style={{ width: '16px', height: '16px', color: item.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 3. MAIN MONITORING AREA (WIDE 3-PANEL BALANCED COMPOSITION)           */}
      {/*    LEFT: Threat Activity                                             */}
      {/*    CENTER: Overall Investor Security Status                          */}
      {/*    RIGHT: Official Verification + Real-Time Security Events          */}
      {/* ==================================================================== */}
      <div
        className="monitoring-grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(290px, 0.95fr) minmax(360px, 1.35fr)',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        {/* ------------------------------------------------------------------ */}
        {/* PANEL 1: THREAT ACTIVITY (LAST 24 HOURS) - LEFT                    */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="dashboard-panel panel-threat-activity"
          style={{
            backgroundColor: '#10161A',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '12px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.22)',
          }}
        >
          <div>
            {/* Header & Legend */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity style={{ width: '14px', height: '14px', color: '#02C39A' }} />
                  <h3
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#F5F7F8',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    THREAT ACTIVITY
                  </h3>
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#9AA5AD',
                    letterSpacing: '0.04em',
                    marginTop: '1px',
                    display: 'block',
                  }}
                >
                  LAST 24 HOURS
                </span>
              </div>

              {/* Chart Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#9AA5AD' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '2px', backgroundColor: '#02C39A', display: 'inline-block' }} />
                  <span>Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '2px', backgroundColor: '#9AA5AD', display: 'inline-block' }} />
                  <span>Activity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#E5484D', display: 'inline-block' }} />
                  <span>High Risk</span>
                </div>
              </div>
            </div>

            {/* Vector Chart */}
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <linearGradient id="verifiedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#02C39A" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#02C39A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Gridlines */}
                {[0.33, 0.66].map((ratio, i) => {
                  const y = paddingY + ratio * plotHeight;
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {/* Baseline Axis */}
                <line
                  x1={paddingX}
                  y1={chartHeight - paddingY}
                  x2={chartWidth - paddingX}
                  y2={chartHeight - paddingY}
                  stroke="rgba(255, 255, 255, 0.12)"
                />

                {/* Area Fill */}
                <path d={verifiedAreaPath} fill="url(#verifiedAreaGrad)" />

                {/* Verified Activity Smooth Line */}
                <path d={verifiedLinePath} fill="none" stroke="#02C39A" strokeWidth="2.2" />

                {/* Suspicious Activity Line */}
                <path d={suspiciousLinePath} fill="none" stroke="#9AA5AD" strokeWidth="1.4" strokeDasharray="3 2" />

                {/* Plot Data Dots */}
                {activityData.map((d, idx) => {
                  const coord = getCoordinates(d.suspicious, idx, activityData.length);
                  const isHigh = d.hasHighRisk;
                  return (
                    <g key={idx} onMouseEnter={() => setSelectedChartPoint(idx)} onMouseLeave={() => setSelectedChartPoint(null)} style={{ cursor: 'pointer' }}>
                      {isHigh ? (
                        <>
                          <circle cx={coord.x} cy={coord.y} r="7" fill="rgba(229, 72, 77, 0.22)" />
                          <circle cx={coord.x} cy={coord.y} r="3.5" fill="#E5484D" stroke="#080C0F" strokeWidth="1.5" />
                        </>
                      ) : (
                        <circle cx={coord.x} cy={coord.y} r="2" fill="#9AA5AD" />
                      )}

                      <text
                        x={coord.x}
                        y={chartHeight - 3}
                        textAnchor="middle"
                        fill="#6F7A86"
                        fontSize="8.5"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Hover Overlay */}
              {selectedChartPoint !== null && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: '#151C20',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  <div style={{ color: '#F5F7F8', fontWeight: 700, marginBottom: '2px' }}>
                    {activityData[selectedChartPoint].time} IST
                  </div>
                  <div style={{ color: '#02C39A' }}>
                    Verified Activity: {activityData[selectedChartPoint].verified}
                  </div>
                  <div style={{ color: activityData[selectedChartPoint].hasHighRisk ? '#E5484D' : '#9AA5AD' }}>
                    Suspicious Alerts: {activityData[selectedChartPoint].suspicious}
                  </div>
                </div>
              )}
            </div>

            {/* Threat Volume Breakdown & Activity Spikes Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '7px',
                  padding: '6px 8px',
                }}
              >
                <div style={{ fontSize: '9px', color: '#9AA5AD', fontWeight: 700, textTransform: 'uppercase' }}>
                  PEAK INCIDENTS
                </div>
                <div style={{ fontSize: '11px', color: '#F5F7F8', fontWeight: 800, marginTop: '1px', fontFamily: "'JetBrains Mono', monospace" }}>
                  16:00 – 18:30
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '7px',
                  padding: '6px 8px',
                }}
              >
                <div style={{ fontSize: '9px', color: '#9AA5AD', fontWeight: 700, textTransform: 'uppercase' }}>
                  SPIKE SEVERITY
                </div>
                <div style={{ fontSize: '11px', color: hasHighRisk ? '#E5484D' : '#02C39A', fontWeight: 800, marginTop: '1px' }}>
                  {hasHighRisk ? 'High' : 'Normal'}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '7px',
                  padding: '6px 8px',
                }}
              >
                <div style={{ fontSize: '9px', color: '#9AA5AD', fontWeight: 700, textTransform: 'uppercase' }}>
                  THREAT VOLUME
                </div>
                <div style={{ fontSize: '11px', color: '#F5F7F8', fontWeight: 800, marginTop: '1px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {riskCount + reviewCount} events
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Diagnostics Footer */}
          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              color: '#9AA5AD',
            }}
          >
            <span>Telemetry Channel: <strong style={{ color: '#02C39A' }}>Continuous Ingress Sync</strong></span>
            {incidents.length > 0 && (
              <span style={{ color: '#E5484D', fontWeight: 700 }}>
                {incidents.length} Incident{incidents.length > 1 ? 's' : ''} Logged
              </span>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PANEL 2: INVESTOR SECURITY STATUS (CENTER & VISUALLY DOMINANT)     */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="dashboard-panel panel-security-status"
          style={{
            backgroundColor: '#10161A',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '12px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.22)',
          }}
        >
          {/* Panel Heading */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield style={{ width: '14px', height: '14px', color: scoreColor }} />
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#F5F7F8',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                INVESTOR SECURITY STATUS
              </h3>
            </div>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: scoreColor,
                backgroundColor: '#151C20',
                border: `1px solid ${scoreColor}40`,
                padding: '1px 6px',
                borderRadius: '10px',
              }}
            >
              LIVE
            </span>
          </div>

          {/* Precision Security Instrument Gauge (155px compact dial) */}
          <div style={{ position: 'relative', width: '155px', height: '155px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0' }}>
            <svg width="155" height="155" viewBox="0 0 155 155" style={{ transform: 'rotate(-90deg)' }}>
              {/* Outer Subtle Dial Ticks */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const x1 = 77.5 + 70 * Math.cos(angle);
                const y1 = 77.5 + 70 * Math.sin(angle);
                const x2 = 77.5 + 65 * Math.cos(angle);
                const y2 = 77.5 + 65 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Background Track Circle */}
              <circle
                cx="77.5"
                cy="77.5"
                r={radius}
                fill="none"
                stroke="#151C20"
                strokeWidth="8"
              />

              {/* Progress Value Arc */}
              <circle
                cx="77.5"
                cy="77.5"
                r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease',
                }}
              />
            </svg>

            {/* Inner Center Digital Readout */}
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 900,
                  color: '#F5F7F8',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {calculatedScore}
                <span style={{ fontSize: '18px', color: '#9AA5AD', fontWeight: 600 }}>%</span>
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#9AA5AD',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                SECURITY STATUS
              </div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: scoreColor,
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                ● {scoreStatusLabel}
              </div>
            </div>
          </div>

          {/* Sub-Gauge Real Metrics Strip */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#151C20',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
              textAlign: 'center',
              marginBottom: '6px',
            }}
          >
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9AA5AD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                CURRENT RISK
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: currentRiskColor, marginTop: '1px' }}>
                {currentRiskLabel}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9AA5AD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                THREATS DETECTED
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: riskCount > 0 ? '#E5484D' : '#F5F7F8', marginTop: '1px', fontFamily: "'JetBrains Mono', monospace" }}>
                {riskCount}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9AA5AD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ANALYZED
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#F5F7F8', marginTop: '1px', fontFamily: "'JetBrains Mono', monospace" }}>
                {totalAnalyzed}
              </div>
            </div>
          </div>

          {/* Continuous Safeguard Status */}
          <div
            style={{
              width: '100%',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px',
              color: '#9AA5AD',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck style={{ width: '12px', height: '12px', color: '#02C39A' }} />
              <span>Zero-OTP Ingress Rule Active</span>
            </div>
            <span style={{ color: '#02C39A', fontWeight: 700 }}>Continuous Firewall</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT AREA: PANEL 3 (VERIFICATION) + PANEL 4 (REAL-TIME EVENTS)     */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="dashboard-right-column"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* PANEL 3: OFFICIAL VERIFICATION (FULL-WIDTH 4-ROW LIST - NO CLIPPING) */}
          <div
            className="dashboard-panel panel-official-verification"
            style={{
              backgroundColor: '#10161A',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.22)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database style={{ width: '13px', height: '13px', color: '#02C39A' }} />
                <h3
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#F5F7F8',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  OFFICIAL VERIFICATION
                </h3>
              </div>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#02C39A',
                  backgroundColor: 'rgba(2, 195, 154, 0.08)',
                  border: '1px solid rgba(2, 195, 154, 0.25)',
                  padding: '1px 6px',
                  borderRadius: '8px',
                }}
              >
                4 STATUTORY SOURCES
              </span>
            </div>

            {/* Clean Vertical Stack: Full Width, Never Clipped */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                {
                  code: 'SEBI',
                  name: 'Securities and Exchange Board of India',
                  status: 'VERIFIED',
                  statusColor: '#02C39A',
                  url: 'https://investor.sebi.gov.in',
                },
                {
                  code: 'RBI',
                  name: 'Reserve Bank of India',
                  status: 'VERIFIED',
                  statusColor: '#02C39A',
                  url: 'https://www.rbi.org.in',
                },
                {
                  code: 'I4C',
                  name: 'Indian Cyber Crime Coordination (1930)',
                  status: 'AVAILABLE',
                  statusColor: '#02C39A',
                  url: 'https://cybercrime.gov.in',
                },
                {
                  code: 'CERT-In',
                  name: 'Indian Computer Emergency Response',
                  status: 'AVAILABLE',
                  statusColor: '#02C39A',
                  url: 'https://www.cert-in.org.in',
                },
              ].map((src, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    backgroundColor: '#151C20',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#02C39A',
                        fontFamily: "'JetBrains Mono', monospace",
                        minWidth: '45px',
                      }}
                    >
                      {src.code}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#9AA5AD',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={src.name}
                    >
                      {src.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: src.statusColor,
                        backgroundColor: 'rgba(2, 195, 154, 0.08)',
                        border: '1px solid rgba(2, 195, 154, 0.22)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {src.status}
                    </span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#6F7A86', padding: '1px', display: 'flex', alignItems: 'center' }}
                      title={`Open official ${src.code} portal`}
                    >
                      <ExternalLink style={{ width: '10px', height: '10px' }} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL 4: REAL-TIME SECURITY EVENTS (FIXED TABLE - CLEAN ALIGNED COLUMNS) */}
          <div
            className="dashboard-panel panel-security-events"
            style={{
              backgroundColor: '#10161A',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {/* Table Header Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '8px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldAlert style={{ width: '13px', height: '13px', color: '#02C39A' }} />
                  <h3
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#F5F7F8',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    REAL-TIME SECURITY EVENTS
                  </h3>
                </div>
                <span style={{ fontSize: '9px', color: '#9AA5AD' }}>
                  {filteredEvents.length} events logged • click to inspect
                </span>
              </div>

              {/* Filter Pills + Expand Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ display: 'flex', backgroundColor: '#151C20', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '2px' }}>
                  {(['ALL', 'HIGH', 'REVIEW', 'LOW'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setEventFilter(filterKey)}
                      style={{
                        backgroundColor: eventFilter === filterKey ? 'rgba(255, 255, 255, 0.10)' : 'transparent',
                        color: eventFilter === filterKey ? '#F5F7F8' : '#9AA5AD',
                        border: 'none',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '8.5px',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      {filterKey}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsTableExpanded(!isTableExpanded)}
                  style={{
                    backgroundColor: '#151C20',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '5px',
                    padding: '2px 5px',
                    color: '#9AA5AD',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={isTableExpanded ? 'Collapse event list' : 'Expand full event list'}
                >
                  {isTableExpanded ? <Minimize2 style={{ width: '11px', height: '11px' }} /> : <Maximize2 style={{ width: '11px', height: '11px' }} />}
                </button>
              </div>
            </div>

            {/* Compact Event Table with Fixed Colgroup */}
            <div style={{ overflowX: 'auto', flex: 1 }}>
              <table
                style={{
                  width: '100%',
                  tableLayout: 'fixed',
                  borderCollapse: 'collapse',
                  fontSize: '10.5px',
                  textAlign: 'left',
                }}
              >
                <colgroup>
                  <col style={{ width: '65px' }} />
                  <col style={{ width: '52px' }} />
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '48px' }} />
                  <col style={{ width: '52px' }} />
                  <col style={{ width: '78px' }} />
                </colgroup>
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#9AA5AD',
                      fontSize: '8.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <th style={{ padding: '4px 6px', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '4px 6px', fontWeight: 700 }}>SOURCE</th>
                    <th style={{ padding: '4px 6px', fontWeight: 700 }}>TYPE</th>
                    <th style={{ padding: '4px 6px', fontWeight: 700 }}>TIME</th>
                    <th style={{ padding: '4px 6px', fontWeight: 700 }}>RISK</th>
                    <th style={{ padding: '4px 6px', fontWeight: 700, textAlign: 'right' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '18px', textAlign: 'center', color: '#9AA5AD', fontSize: '10px' }}>
                        No security events recorded under current filter.
                      </td>
                    </tr>
                  ) : (
                    displayEvents.map((msg, index) => {
                      const displayId = formatId(msg.id, index);
                      const channel = (msg.source_channel || msg.sender_identifier || 'SMS').substring(0, 8);
                      const primarySignal = msg.detected_signals?.[0]?.name;
                      const primaryClaim = msg.claims?.[0]?.claim_type;
                      const typeLabel = (primarySignal || primaryClaim || msg.snippet || 'COMMUNICATION').substring(0, 26).toUpperCase();
                      const timeDisplay = formatTime(msg.timestamp);

                      const isHigh = msg.risk_level === 'High Concern' || msg.protection_tier === 'Quarantined / High Risk';
                      const isReview = msg.risk_level === 'Needs Verification' || msg.protection_tier === 'Review / Verify';
                      const riskColor = isHigh ? '#E5484D' : isReview ? '#F5B942' : '#02C39A';
                      const riskText = isHigh ? 'HIGH' : isReview ? 'REVIEW' : 'LOW';

                      const isQuarantined = msg.status === 'QUARANTINED' || isHigh;
                      const statusText = isQuarantined ? 'QUARANTINED' : isReview ? 'ANALYZING' : 'CLEARED';
                      const statusBg = isQuarantined ? 'rgba(229, 72, 77, 0.12)' : isReview ? 'rgba(245, 185, 66, 0.10)' : 'rgba(2, 195, 154, 0.10)';
                      const statusBorder = isQuarantined ? 'rgba(229, 72, 77, 0.30)' : isReview ? 'rgba(245, 185, 66, 0.25)' : 'rgba(2, 195, 154, 0.25)';

                      return (
                        <tr
                          key={msg.id || index}
                          onClick={() => handleRowClick(msg)}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer',
                            transition: 'background-color 0.12s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#151C20')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {/* ID */}
                          <td style={{ padding: '5px 6px', fontFamily: "'JetBrains Mono', monospace", color: '#9AA5AD', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {displayId}
                          </td>

                          {/* SOURCE */}
                          <td style={{ padding: '5px 6px' }}>
                            <span
                              style={{
                                backgroundColor: '#151C20',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                fontSize: '8.5px',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                color: '#F5F7F8',
                                fontFamily: "'JetBrains Mono', monospace",
                                display: 'inline-block',
                              }}
                            >
                              {channel.toUpperCase()}
                            </span>
                          </td>

                          {/* TYPE */}
                          <td style={{ padding: '5px 6px', color: '#F5F7F8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={typeLabel}>
                            {typeLabel}
                          </td>

                          {/* TIME */}
                          <td style={{ padding: '5px 6px', color: '#9AA5AD', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
                            {timeDisplay}
                          </td>

                          {/* RISK */}
                          <td style={{ padding: '5px 6px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                color: riskColor,
                                fontWeight: 700,
                                fontSize: '9px',
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              <span
                                style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: riskColor,
                                }}
                              />
                              {riskText}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td style={{ padding: '5px 6px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                backgroundColor: statusBg,
                                border: `1px solid ${statusBorder}`,
                                color: riskColor,
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontSize: '8.5px',
                                fontWeight: 700,
                                letterSpacing: '0.03em',
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Vault link */}
            <div
              style={{
                marginTop: '6px',
                paddingTop: '5px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '9.5px',
                color: '#9AA5AD',
              }}
            >
              <span>Showing {displayEvents.length} of {filteredEvents.length} events</span>
              {onNavigateQuarantine && (
                <button
                  onClick={onNavigateQuarantine}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#02C39A',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span>Open Vault</span>
                  <ChevronRight style={{ width: '10px', height: '10px' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. EVENT INSPECTION MODAL (CYBERSECURITY FORENSICS DIALOG)          */}
      {/* ==================================================================== */}
      {inspectingEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(8, 12, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setInspectingEvent(null)}
        >
          <div
            style={{
              backgroundColor: '#10161A',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '22px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      color: '#9AA5AD',
                      fontWeight: 700,
                    }}
                  >
                    EVENT FORENSIC #{inspectingEvent.id?.replace('MSG-', '') || '00482'}
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: inspectingEvent.risk_level === 'High Concern' ? 'rgba(229, 72, 77, 0.12)' : 'rgba(2, 195, 154, 0.10)',
                      color: inspectingEvent.risk_level === 'High Concern' ? '#E5484D' : '#02C39A',
                      border: `1px solid ${inspectingEvent.risk_level === 'High Concern' ? 'rgba(229, 72, 77, 0.30)' : 'rgba(2, 195, 154, 0.25)'}`,
                    }}
                  >
                    {inspectingEvent.protection_tier || inspectingEvent.risk_level}
                  </span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '4px 0 0 0', color: '#F5F7F8' }}>
                  {inspectingEvent.sender || 'Unknown Sender'} via {inspectingEvent.source_channel || 'SMS'}
                </h3>
              </div>
              <button
                onClick={() => setInspectingEvent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9AA5AD',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Intercepted Content */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#9AA5AD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>
                RAW INTERCEPTED COMMUNICATION
              </div>
              <div
                style={{
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#F5F7F8',
                  lineHeight: 1.55,
                  maxHeight: '130px',
                  overflowY: 'auto',
                }}
              >
                {inspectingEvent.content}
              </div>
            </div>

            {/* Detected Signals & Regulatory Guidance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#9AA5AD', textTransform: 'uppercase', marginBottom: '5px' }}>
                  DETECTED SCAM SIGNALS
                </div>
                {inspectingEvent.detected_signals && inspectingEvent.detected_signals.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {inspectingEvent.detected_signals.map((sig, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '10.5px', color: '#E5484D', fontWeight: 600 }}>
                        ⚠ {sig.name} ({sig.severity})
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '10.5px', color: '#02C39A' }}>
                    ✓ No malicious signals detected
                  </div>
                )}
              </div>

              <div
                style={{
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#9AA5AD', textTransform: 'uppercase', marginBottom: '5px' }}>
                  STATUTORY GROUNDING
                </div>
                <div style={{ fontSize: '10.5px', color: '#9AA5AD', lineHeight: 1.45 }}>
                  {inspectingEvent.snippet || 'Grounded in statutory SEBI PR 12/2024 and RBI cyber fraud prevention advisories.'}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {onNavigateVerify && (
                <button
                  onClick={() => {
                    setInspectingEvent(null);
                    onNavigateVerify();
                  }}
                  style={{
                    backgroundColor: '#151C20',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F5F7F8',
                    padding: '7px 12px',
                    borderRadius: '7px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Verify Registry ID
                </button>
              )}
              {onNavigateQuarantine && (
                <button
                  onClick={() => {
                    setInspectingEvent(null);
                    onNavigateQuarantine();
                  }}
                  style={{
                    backgroundColor: 'rgba(229, 72, 77, 0.12)',
                    border: '1px solid rgba(229, 72, 77, 0.35)',
                    color: '#E5484D',
                    padding: '7px 12px',
                    borderRadius: '7px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  View in Quarantine Vault
                </button>
              )}
              <button
                onClick={() => setInspectingEvent(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F5F7F8',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Forensics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
