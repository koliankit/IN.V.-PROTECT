import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Scale,
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
  const [activeTab, setActiveTab] = useState<'claims' | 'payload'>('claims');

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <section
      id="interactive-demo"
      style={{
        padding: '140px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Concentric Ambient Rings */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255, 92, 141, 0.06) 0%, rgba(224, 122, 95, 0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="editorial-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 72px auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="chapter-eyebrow"
            style={{ justifyContent: 'center' }}
          >
            <span className="chapter-eyebrow-bullet" />
            <span>Chapter 04: [ Interactive Threat Forensics ]</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-display-heading"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              marginBottom: '20px',
            }}
          >
            Always at your command.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.16 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(15px, 1.5vw, 18px)',
              lineHeight: 1.68,
              color: 'rgba(255, 255, 255, 0.58)',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            Inspect real-world fraudulent solicitations intercepted across Indian digital channels. Witness how our regulatory grounding engine disproves deceitful claims with statutory citations.
          </motion.p>
        </div>

        {/* Forensic Workbench Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '24px',
            alignItems: 'stretch',
          }}
          className="forensic-grid"
        >
          {/* Left Column: Incident Case Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.4)',
                padding: '0 8px 6px 8px',
              }}
            >
              Select Real-World Incident Dossier:
            </div>

            {scenarios.map((sc) => {
              const isSelected = sc.id === activeScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? 'var(--accent-bg)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid rgba(255, 92, 141, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.4)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {sc.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: sc.riskScore >= 95 ? 'var(--color-risk)' : 'var(--color-review)',
                      }}
                    >
                      RISK {sc.riskScore}%
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                      marginBottom: '6px',
                    }}
                  >
                    {sc.title}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    {sc.source}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Forensics Workbench */}
          <div
            className="editorial-panel"
            style={{
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
            }}
          >
            <div>
              {/* Workbench Top Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-risk)',
                        boxShadow: '0 0 10px var(--color-risk)',
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      {activeScenario.title}
                    </h3>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                    Origin: {activeScenario.source}
                  </div>
                </div>

                {/* Tab Switcher */}
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '8px',
                    padding: '3px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('claims')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: activeTab === 'claims' ? 'var(--bg-primary)' : 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: activeTab === 'claims' ? '#FFFFFF' : 'transparent',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    Regulatory Proof ({activeScenario.claims.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('payload')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: activeTab === 'payload' ? 'var(--bg-primary)' : 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: activeTab === 'payload' ? '#FFFFFF' : 'transparent',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    Raw Intercepted Text
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'claims' && (
                  <motion.div
                    key="claims-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    {activeScenario.claims.map((cl, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '16px 20px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                            "{cl.claim}"
                          </div>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(255, 77, 77, 0.12)',
                              color: 'var(--color-risk)',
                              border: '1px solid rgba(255, 77, 77, 0.25)',
                              letterSpacing: '0.04em',
                              whiteSpace: 'nowrap',
                              marginLeft: '12px',
                            }}
                          >
                            {cl.verdict}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <Scale style={{ width: '14px', height: '14px', color: 'var(--accent)', marginTop: '3px', flexShrink: 0 }} />
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.5, margin: 0 }}>
                            {cl.citation}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Statutory Regulatory Advisory Notice */}
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 92, 141, 0.06)',
                        border: '1px solid var(--accent-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <ShieldCheck style={{ width: '18px', height: '18px', color: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                        {activeScenario.regulatoryCaution}
                      </span>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'payload' && (
                  <motion.div
                    key="payload-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: '24px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.85)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <div style={{ color: 'var(--accent)', fontSize: '11px', marginBottom: '12px', letterSpacing: '0.08em' }}>
                      // RAW DECRYPTED INGESTION LOG:
                    </div>
                    {activeScenario.rawText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Forensics Action Footer */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                Vector Index: 14,280 SEBI Gazettes • Zero PII Retained
              </div>
              <button
                onClick={onOpenConsole}
                className="btn-warm-accent"
                style={{ padding: '8px 18px', fontSize: '12px' }}
              >
                <span>Run Live Inspection in Console</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .forensic-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
