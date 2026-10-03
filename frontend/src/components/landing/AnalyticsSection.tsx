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
        padding: '140px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="editorial-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="analytics-editorial-grid"
        >
          {/* Left: Analytics Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative' }}
          >
            {/* Subtle Warm Backdrop Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-12px',
                background: 'radial-gradient(circle at 40% 50%, var(--accent-bg), transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 0,
              }}
            />

            <div
              className="editorial-panel glossy-reflection"
              style={{
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.9)',
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
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="chapter-eyebrow">
              <span className="chapter-eyebrow-bullet" />
              <span>Chapter 05: [ Telemetry &amp; Threat Radar ]</span>
            </div>

            {/* Headline */}
            <h2
              className="editorial-display-heading"
              style={{
                fontSize: 'clamp(32px, 4vw, 52px)',
                marginBottom: '20px',
              }}
            >
              Telemetry rooted
              <br />
              in certainty.
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                lineHeight: '1.68',
                color: 'rgba(255, 255, 255, 0.58)',
                marginBottom: '36px',
              }}
            >
              Real-time monitoring of emerging scam syndicates operating across Indian social channels. Continuous correlation between suspicious promoters and active SEBI adjudication orders guarantees that false positives remain at an unprecedented near-zero threshold.
            </p>

            {/* Stat Matrix */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '36px',
              }}
            >
              {telemetryStats.map((st) => (
                <div
                  key={st.label}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '26px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '-0.03em',
                      marginBottom: '4px',
                    }}
                  >
                    {st.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.88)',
                    }}
                  >
                    {st.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.4)',
                      marginTop: '3px',
                    }}
                  >
                    {st.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onOpenConsole}
              className="btn-warm-accent"
              style={{ padding: '10px 22px' }}
            >
              <span>Launch Live Telemetry Console</span>
              <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
};
