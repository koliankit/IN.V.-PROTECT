import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  X,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { SecurityIncidentReport } from '../../types';

interface SecurityIncidentReportModalProps {
  report: SecurityIncidentReport | null;
  onClose: () => void;
}

export const SecurityIncidentReportModal: React.FC<SecurityIncidentReportModalProps> = ({
  report,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report.formatted_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([report.formatted_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.incident_id}_IN_V_PROTECT_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.incident_id}_IN_V_PROTECT_Dossier.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isHighRisk = report.risk_level.toLowerCase().includes('high');

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
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
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
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: isHighRisk ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 195, 154, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isHighRisk ? '#f87171' : '#02C39A',
                border: `1px solid ${isHighRisk ? 'rgba(239, 68, 68, 0.3)' : 'rgba(2, 195, 154, 0.3)'}`,
              }}
            >
              <FileText style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                IN V PROTECT • OFFICIAL INCIDENT DOSSIER
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {report.incident_id}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: isHighRisk ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 195, 154, 0.15)',
                color: isHighRisk ? '#f87171' : '#02C39A',
                border: `1px solid ${isHighRisk ? 'rgba(239, 68, 68, 0.3)' : 'rgba(2, 195, 154, 0.3)'}`,
              }}
            >
              {report.risk_level.toUpperCase()}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              backgroundColor: 'var(--bg-card)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Date & Time</div>
              <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{report.timestamp}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Source Channel</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{report.source}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Claimed Sender</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24' }}>{report.sender_claimed}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Actual Identifier</div>
              <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: isHighRisk ? '#f87171' : 'var(--text-primary)' }}>
                {report.sender_actual}
              </div>
            </div>
          </div>

          {/* Original Message */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Original Intercepted Communication
            </div>
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                lineHeight: 1.6,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
              }}
            >
              "{report.original_message}"
            </div>
          </div>

          {/* Official Verification & Threats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Official Source Verification */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Official Source Verification
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: report.official_verification.status === 'VERIFIED' ? 'rgba(2, 195, 154, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: report.official_verification.status === 'VERIFIED' ? '#02C39A' : '#f87171',
                    border: `1px solid ${report.official_verification.status === 'VERIFIED' ? 'rgba(2, 195, 154, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  {report.official_verification.status}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{report.official_verification.claimed_source}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                {report.official_verification.evidence}
              </p>
            </div>

            {/* Detected Threats */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Detected Threats & Violations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.detected_threats.map((threat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f87171' }}>
                    <ShieldAlert style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                    <span>{threat}</span>
                  </div>
                ))}
                {report.detected_threats.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#02C39A' }}>No threat signatures detected.</div>
                )}
              </div>
            </div>
          </div>

          {/* Grounded Evidence Citations */}
          {report.evidence.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Grounded Regulatory Evidence
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ color: '#02C39A' }}>{ev.publisher} — {ev.title}</strong>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '11px' }}
                      >
                        Official Source <ExternalLink style={{ width: '10px', height: '10px' }} />
                      </a>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{ev.passage}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Action & User Action */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '14px',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
              RECOMMENDED ACTION:
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
              {report.recommended_action}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              User Action Taken: <strong>{report.user_action}</strong> • Status: <strong>{report.report_status}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check style={{ width: '14px', height: '14px', color: '#02C39A' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handleDownloadTxt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Download .TXT
            </button>
            <button
              onClick={handleDownloadJson}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Download JSON
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              backgroundColor: '#e53e3e',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
