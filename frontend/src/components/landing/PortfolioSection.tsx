import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface PortfolioSectionProps {
  onOpenConsole: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenConsole }) => {
  return (
    <section
      id="portfolio-shield"
      style={{
        padding: '140px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="editorial-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="portfolio-editorial-grid"
        >
          {/* Left: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="chapter-eyebrow">
              <span className="chapter-eyebrow-bullet" />
              <span>Chapter 06: [ Capital Isolation &amp; Defense ]</span>
            </div>

            <h2
              className="editorial-display-heading"
              style={{
                fontSize: 'clamp(32px, 4vw, 50px)',
                marginBottom: '20px',
              }}
            >
              Safeguarding investor capital at rest and in transit.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                lineHeight: '1.68',
                color: 'rgba(255, 255, 255, 0.58)',
                marginBottom: '28px',
              }}
            >
              Direct API integrations with leading Indian depository participants and discount brokers verify transaction requests against flagged beneficiary accounts before irreversible UPI or NEFT settlements execute.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
              {[
                'Zero unauthorized withdrawals via cold-vault multi-sig authorization',
                'Pre-transaction beneficiary registry check against 50,000+ mules',
                'Cryptographic proof of custody for depository accounts',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--color-trusted)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'rgba(255, 255, 255, 0.82)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={onOpenConsole} className="btn-secondary-hairline">
              <span>View Connected Integrations</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </motion.div>

          {/* Right: Portfolio Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-12px',
                background: 'radial-gradient(circle at 60% 50%, rgba(229, 62, 62, 0.08), transparent 70%)',
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
                src="/images/portfolio.png"
                alt="Sangyan AI Capital Protection Portfolio Dashboard"
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
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .portfolio-editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
};
