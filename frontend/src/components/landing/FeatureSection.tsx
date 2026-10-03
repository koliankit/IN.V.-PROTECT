import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpenCheck, KeyRound, AlertOctagon } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: ShieldAlert,
      title: 'Zero-Trust Message Quarantine',
      description:
        'Continuous multi-channel monitoring across WhatsApp groups, Telegram channels, SMS, and cold solicitations. Claims are segmented and analyzed via OCR with zero persistent storage of private conversations.',
      tag: 'INGESTION ENGINE',
    },
    {
      icon: BookOpenCheck,
      title: 'Statutory Evidence Grounding',
      description:
        'Real-time vector search across 14,000+ indexed SEBI warning circulars, RBI registered NBFC lists, and I4C national cybercrime modus-operandi records. Every risk score is backed by statutory paragraph citations.',
      tag: 'RAG KNOWLEDGE BASE',
    },
    {
      icon: KeyRound,
      title: 'Cryptographic Owner Biometrics',
      description:
        'FIDO2 WebAuthn passkey assertions and salt-hashed HMAC verification. Complete mathematical isolation: raw biometric data, camera captures, and investor passwords never touch a server database.',
      tag: 'SOVEREIGN IDENTITY',
    },
    {
      icon: AlertOctagon,
      title: 'Sub-Second Incident Escalation',
      description:
        'One-click generation of immutable evidence packets formatted directly for the 1930 National Cybercrime Portal (cybercrime.gov.in) with cryptographic SHA-256 custody seals for law enforcement.',
      tag: 'CRIME RESILIENCE',
    },
  ];

  return (
    <section
      id="capabilities"
      style={{
        padding: '140px 24px',
        backgroundColor: '#08080B',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#38BDF8',
              marginBottom: '16px',
            }}
          >
            ARCHITECTURE & CAPABILITIES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(36px, 4.8vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Everything, unlike anything.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: '#8E8E93',
            }}
          >
            A dedicated sovereign defense architecture engineered from first principles to counteract financial fraud in the Indian equity and digital asset markets.
          </motion.p>
        </div>

        {/* Feature Grid with Minimalist Dividers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  backgroundColor: '#0A0A0D',
                  padding: '48px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '340px',
                  position: 'relative',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#101115')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0A0A0D')}
              >
                <div>
                  {/* Tag */}
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: 'rgba(255, 255, 255, 0.4)',
                      marginBottom: '32px',
                    }}
                  >
                    {feat.tag}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: '#38BDF8' }} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      marginBottom: '14px',
                      lineHeight: 1.25,
                    }}
                  >
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#8E8E93',
                    }}
                  >
                    {feat.description}
                  </p>
                </div>

                {/* Subtle Indicator */}
                <div
                  style={{
                    marginTop: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.5)' }}>
                    ACTIVE VERIFIED
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
