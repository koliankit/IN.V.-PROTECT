import React, { useState } from 'react';
import {
  AlertTriangle,
  FileSearch,
  Terminal,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface InteractiveAnalyzerProps {
  onOpenConsole: () => void;
}

interface ScamScenario {
  id: string;
  title: string;
  source: string;
  badge: string;
  rawText: string;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'SUSPICIOUS';
  claims: {
    claim: string;
    verdict: string;
    citation: string;
  }[];
  regulatoryCaution: string;
}

export const InteractiveAnalyzer: React.FC<InteractiveAnalyzerProps> = ({ onOpenConsole }) => {
  const scenarios: ScamScenario[] = [
    {
      id: 'telegram-pump',
      title: 'Telegram Pump & Dump Scheme',
      source: 'Telegram Channel // Alpha Traders India',
      badge: 'UNREGISTERED ADVISORY',
      rawText:
        '🔥💰 *ALERT! XYZ LTD TO HIT UPPER CIRCUIT!* \nBuy heavy now at 115. Target 250 in 1 week! Big insider news! Join our VIP channel http://t.me/AlphaTradersPremium',
      riskScore: 94,
      riskLevel: 'HIGH',
      claims: [
        {
          claim: 'Guaranteed target 250 in 1 week (117% return)',
          verdict: 'IMPROBABLE & UNREALISTIC',
          citation: 'SEBI Circular SEBI/HO/MIRSD/DOS3/CIR/P/2021/633 prohibits return guarantees.',
        },
        {
          claim: 'Exclusive "Big insider news" tips',
          verdict: 'ILLEGAL SOLICITATION',
          citation: 'SEBI (Prohibition of Insider Trading) Regulations, 2015 forbids insider tips distribution.',
        },
        {
          claim: 'Alpha Traders India advisory service',
          verdict: 'UNREGISTERED ENTITY',
          citation: 'Entity not found in official SEBI Registered Research Analyst directory.',
        },
      ],
      regulatoryCaution:
        'SEBI explicitly warns investors against social media stock recommendations promising upper circuit targets or guaranteed returns.',
    },
    {
      id: 'pre-ipo-scam',
      title: 'Fake Pre-IPO Institutional Allotment',
      source: 'WhatsApp Message // Institutional Desk',
      badge: 'UNAUTHORIZED SOLICITATION',
      rawText:
        'Exclusive Pre-IPO allocation for Tata Tech at 40% discount before NSE listing. Guaranteed allotment via institutional pool quota. Transfer to director personal UPI ID to reserve.',
      riskScore: 98,
      riskLevel: 'CRITICAL',
      claims: [
        {
          claim: 'Guaranteed institutional quota shares for retail',
          verdict: 'FALSE & DECEPTIVE',
          citation: 'SEBI ICDR Regulations: Retail pre-IPO allotments cannot bypass ASBA banking mechanisms.',
        },
        {
          claim: 'Direct payment to personal UPI handle',
          verdict: 'HIGH-RISK DEFRAUDING',
          citation: 'SEBI Circular: Legitimate stock applications mandatorily require UPI-ASBA blocking in bank.',
        },
      ],
      regulatoryCaution:
        'Transferring money to individual UPI IDs for shares is the #1 vector for pre-IPO investor fraud in India.',
    },
    {
      id: 'fake-sebi-notice',
      title: 'Fake SEBI Legal Extortion Threat',
      source: 'SMS / Email // SEBI Enforcement Cell',
      badge: 'IMPERSONATION FRAUD',
      rawText:
        'URGENT: Legal notice from SEBI Enforcement Directorate. Your trading accounts are frozen under PMLA rules. Pay ₹45,000 clearance penalty within 2 hours to avoid non-bailable warrant.',
      riskScore: 99,
      riskLevel: 'CRITICAL',
      claims: [
        {
          claim: 'SEBI demands direct penalty payments to release accounts',
          verdict: 'FRAUDULENT EXTORTION',
          citation: 'SEBI does not freeze individual trading accounts via SMS nor demand penalty deposits.',
        },
        {
          claim: '2-hour emergency compliance deadline',
          verdict: 'COERCIVE PSYCHOLOGICAL PRESSURE',
          citation: 'I4C Advisory 2024: Time-pressured threats are characteristic of digital arrest syndicates.',
        },
      ],
      regulatoryCaution:
        'Statutory regulators never initiate recovery via instant messenger or demand funds into private escrow.',
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('telegram-pump');
  const [activeTab, setActiveTab] = useState<'claims' | 'evidence'>('claims');

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <section
      id="interactive-demo"
      style={{
        padding: '140px 24px',
        backgroundColor: '#0A0A0D',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 64px auto' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#38BDF8',
              marginBottom: '16px',
            }}
          >
            INTERACTIVE THREAT DEMONSTRATION
          </div>

          <h2
            style={{
              fontSize: 'clamp(36px, 4.8vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Always at your command.
          </h2>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: '#8E8E93',
            }}
          >
            Select a verified attack scenario below to observe how Sangyan dissects multi-lingual fraudulent claims and correlates them against statutory regulatory registries in sub-second time.
          </p>
        </div>

        {/* Attack Scenario Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {scenarios.map((sc) => {
            const isActive = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioId(sc.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#38BDF8' : 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#38BDF8' : 'rgba(255, 255, 255, 0.3)',
                  }}
                />
                <span>{sc.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            alignItems: 'stretch',
          }}
          className="interactive-grid"
        >
          {/* Left Column: Interactive Inspector Panel */}
          <div
            style={{
              backgroundColor: '#121318',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Inspector Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal style={{ width: '16px', height: '16px', color: '#38BDF8' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                  Live Message Dissection
                </span>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                {activeScenario.riskScore}% THREAT CONFIDENCE
              </div>
            </div>

            {/* Raw Message Box */}
            <div
              style={{
                padding: '20px',
                backgroundColor: '#0A0A0D',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#8E8E93',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>INPUT TELEMETRY // {activeScenario.source}</span>
                <span style={{ color: '#EF4444' }}>FLAGGED PENDING QUARANTINE</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                {activeScenario.rawText}
              </div>
            </div>

            {/* Analysis Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '0 20px',
                gap: '16px',
              }}
            >
              <button
                onClick={() => setActiveTab('claims')}
                style={{
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  color: activeTab === 'claims' ? '#38BDF8' : '#8E8E93',
                  borderBottom: activeTab === 'claims' ? '2px solid #38BDF8' : '2px solid transparent',
                }}
              >
                Extracted Claims ({activeScenario.claims.length})
              </button>
              <button
                onClick={() => setActiveTab('evidence')}
                style={{
                  padding: '12px 0',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'transparent',
                  color: activeTab === 'evidence' ? '#38BDF8' : '#8E8E93',
                  borderBottom: activeTab === 'evidence' ? '2px solid #38BDF8' : '2px solid transparent',
                }}
              >
                Regulatory Citations
              </button>
            </div>

            {/* Tab Contents */}
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto', maxHeight: '360px' }}>
              {activeTab === 'claims' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeScenario.claims.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                          Claim #{i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                          }}
                        >
                          {c.verdict}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
                        "{c.claim}"
                      </p>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#38BDF8',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                        }}
                      >
                        <FileSearch style={{ width: '13px', height: '13px', flexShrink: 0, marginTop: '2px' }} />
                        <span>{c.citation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'evidence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <AlertTriangle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B' }}>
                        Statutory Regulatory Advisory
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.85)' }}>
                      {activeScenario.regulatoryCaution}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: 600 }}>
                      OFFICIAL INVESTOR CAUTION PORTAL
                    </span>
                    <p style={{ fontSize: '13px', color: '#FFFFFF', marginTop: '4px' }}>
                      Investors may report unregistered stock tip solicitations directly via SEBI SCORES or call the National Cybercrime helpline 1930.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Live Action */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12px', color: '#8E8E93' }}>
                Run deep multi-lingual OCR in the console
              </span>
              <button
                onClick={onOpenConsole}
                style={{
                  backgroundColor: '#38BDF8',
                  color: '#08080B',
                  fontWeight: 600,
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Open in Console</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </button>
            </div>
          </div>

          {/* Right Column: Real Feature Screenshot Showcase */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#121318',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                Multi-Channel Discourse Inspector
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Zap style={{ width: '12px', height: '12px' }} />
                REAL OCR GROUNDING
              </span>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <img
                src="/images/feature-ui.png"
                alt="Sangyan AI Message Inspector Feature UI"
                width={1200}
                height={800}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .interactive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
