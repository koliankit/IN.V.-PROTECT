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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="portfolio-grid"
        >
          {/* Left: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#10B981',
                marginBottom: '16px',
              }}
            >
              CAPITAL ISOLATION & DEFENSE
            </div>

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
              Safeguarding investor capital at rest and in transit.
            </h2>

            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#8E8E93',
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
                  <CheckCircle2 style={{ width: '18px', height: '18px', color: '#10B981', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenConsole}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '13px',
                padding: '12px 22px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <span>View Connected Integrations</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>
          </motion.div>

          {/* Right: Portfolio Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle at 60% 50%, rgba(16, 185, 129, 0.12), transparent 70%)',
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
          .portfolio-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
