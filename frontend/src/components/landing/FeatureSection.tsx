import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpenCheck, KeyRound, AlertOctagon } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      index: '01',
      icon: ShieldAlert,
      title: 'Zero-Trust Message Quarantine',
      description:
        'Continuous multi-channel monitoring across WhatsApp, Telegram, SMS, and cold solicitations. Claims are segmented and analyzed via OCR with zero persistent storage of private conversations.',
      tag: '[ Ingestion Engine ]',
    },
    {
      index: '02',
      icon: BookOpenCheck,
      title: 'Statutory Evidence Grounding',
      description:
        'Real-time vector search across 14,000+ indexed SEBI warning circulars, RBI registered NBFC lists, and I4C modus-operandi records. Every risk score is backed by statutory paragraph citations.',
      tag: '[ RAG Knowledge Base ]',
    },
    {
      index: '03',
      icon: KeyRound,
      title: 'Cryptographic Owner Biometrics',
      description:
        'FIDO2 WebAuthn passkey assertions and salt-hashed HMAC verification. Raw biometric data, camera captures, and investor passwords never touch a server database.',
      tag: '[ Sovereign Identity ]',
    },
    {
      index: '04',
      icon: AlertOctagon,
      title: 'Sub-Second Incident Escalation',
      description:
        'One-click generation of immutable evidence packets formatted for the 1930 National Cybercrime Portal with cryptographic SHA-256 custody seals for law enforcement.',
      tag: '[ Crime Resilience ]',
    },
  ];

  return (
    <section
      id="capabilities"
      style={{
        padding: '140px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="editorial-container">
        {/* Section Header */}
        <div style={{ marginBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="chapter-eyebrow"
          >
            <span className="chapter-eyebrow-bullet" />
            <span>Chapter 03: [ Architecture &amp; Capabilities ]</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-display-heading"
            style={{
              fontSize: 'clamp(36px, 4.8vw, 62px)',
              maxWidth: '680px',
              marginBottom: '20px',
            }}
          >
            Everything,
            <br />
            unlike anything.
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
              color: 'rgba(255, 255, 255, 0.55)',
              maxWidth: '560px',
            }}
          >
            A dedicated sovereign defense architecture engineered from first principles to counteract financial fraud in Indian equity and digital asset markets.
          </motion.p>
        </div>

        {/* Feature List — Asymmetrical Editorial Layout */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 240px 1fr',
                  gap: '40px',
                  alignItems: 'flex-start',
                  padding: '40px 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'background-color 0.2s ease, opacity 0.2s ease',
                }}
                className="feature-editorial-row"
              >
                {/* Index Column */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    opacity: 0.8,
                  }}
                >
                  {feat.index}
                </div>

                {/* Tag & Icon Column */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'rgba(255, 255, 255, 0.35)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {feat.tag}
                  </div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      border: '1px solid var(--accent-border)',
                      backgroundColor: 'rgba(255, 92, 141, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
                  </div>
                </div>

                {/* Title & Description Column */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      color: '#FFFFFF',
                      marginBottom: '12px',
                      lineHeight: 1.3,
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '15px',
                      lineHeight: 1.68,
                      color: 'rgba(255, 255, 255, 0.55)',
                      maxWidth: '620px',
                    }}
                  >
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
          {/* Bottom Divider */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .feature-editorial-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};
