import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onOpenRegister: () => void;
  onOpenConsole: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenRegister, onOpenConsole }) => {
  return (
    <section
      id="pricing"
      style={{
        padding: '140px 24px',
        backgroundColor: '#08080B',
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
            gridTemplateColumns: '1fr 1.25fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="pricing-grid"
        >
          {/* Left: Heading & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
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
              SOVEREIGN ACCESS
            </div>

            <h2
              style={{
                fontSize: 'clamp(36px, 4.5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '20px',
              }}
            >
              What it costs.
            </h2>

            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#8E8E93',
                marginBottom: '32px',
              }}
            >
              Investor protection must never be a luxury paywalled behind closed doors. The Sangyan AI sovereign core is free for every individual retail investor in India, anchored by public regulatory infrastructure.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
              {[
                'Free and unrestricted personal scam analysis',
                'Zero password harvesting & zero telemetry tracking',
                'Direct statutory citations from SEBI and RBI registries',
                'Air-gapped enterprise deployments available for wealth desks',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check style={{ width: '11px', height: '11px', color: '#38BDF8' }} />
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)' }}>{point}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenRegister}
                style={{
                  backgroundColor: '#38BDF8',
                  color: '#08080B',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '12px 22px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Activate Retail Shield</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>
              <button
                onClick={onOpenConsole}
                style={{
                  backgroundColor: 'transparent',
                  color: '#8E8E93',
                  fontSize: '13px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                Preview Tiers in Console
              </button>
            </div>
          </motion.div>

          {/* Right: Large Minimalist Dark Pricing Card Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
            }}
          >
            {/* Subtle Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle at 60% 40%, rgba(56, 189, 248, 0.1), transparent 70%)',
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
                boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.85)',
              }}
            >
              <img
                src="/images/pricing-chart.png"
                alt="Sovereign Investor Shield Pricing Tiers and Architecture"
                width={1200}
                height={800}
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
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
