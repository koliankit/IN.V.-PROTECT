import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface AnalyticsSectionProps {
  onOpenConsole: () => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ onOpenConsole }) => {
  const telemetryStats = [
    { label: 'Detection Accuracy', value: '99.4%', sub: 'Across 14 Indian vernacular dialects' },
    { label: 'Mean Query Latency', value: '< 240ms', sub: 'Sub-second discourse vector query' },
    { label: 'Regulatory Circulars', value: '14,200+', sub: 'Indexed SEBI, RBI, & I4C documents' },
    { label: 'Raw Passwords Retained', value: '0', sub: 'Zero-knowledge biometric passkeys' },
  ];

  return (
    <section
      id="telemetry"
      style={{
        padding: '140px 24px',
        backgroundColor: '#08080B',
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="analytics-grid"
        >
          {/* Left: Analytics Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
            }}
          >
            {/* Subtle Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle at 40% 50%, rgba(56, 189, 248, 0.12), transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#121318',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8)',
              }}
            >
              <img
                src="/images/analytics.png"
                alt="Sangyan AI Scam Risk and Compliance Analytics"
                width={1400}
                height={900}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right: Narrative & Telemetry Badges */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
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
              TELEMETRY & THREAT RADAR
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '20px',
              }}
            >
              Telemetry rooted in certainty.
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#8E8E93',
                marginBottom: '36px',
              }}
            >
              Real-time monitoring of emerging scam syndicates operating across Indian social channels. Continuous correlation between suspicious promoters and active SEBI adjudication orders guarantees that false positives remain at an unprecedented near-zero threshold.
            </p>

            {/* Stat Badges Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '36px',
              }}
            >
              {telemetryStats.map((st) => (
                <div
                  key={st.label}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '4px',
                    }}
                  >
                    {st.value}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>
                    {st.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8E8E93', marginTop: '2px' }}>{st.sub}</div>
                </div>
              ))}
            </div>

            {/* CTA Link */}
            <button
              onClick={onOpenConsole}
              style={{
                backgroundColor: 'transparent',
                color: '#38BDF8',
                fontWeight: 600,
                fontSize: '14px',
                padding: '0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#38BDF8')}
            >
              <span>Launch Live Telemetry Console</span>
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
