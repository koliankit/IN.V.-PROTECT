import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';

interface PricingSectionProps {
  onOpenRegister: () => void;
  onOpenConsole: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenRegister, onOpenConsole }) => {
  const tiers = [
    {
      name: 'Retail Shield',
      price: 'Free',
      period: 'Forever, for every Indian investor',
      features: [
        'Unlimited scam message analysis',
        'SEBI & RBI regulatory grounding',
        'PII redaction & zero data retention',
        'Automated 1930 incident evidence packs',
        'Official SEBI SCORES filing guides',
      ],
      primary: false,
      cta: 'Launch Console Free',
    },
    {
      name: 'Sovereign Pro',
      price: '₹299',
      period: 'per month, billed annually',
      features: [
        'Everything in Retail Shield',
        'Real-time smartwatch threat HUD',
        'Advanced RAG semantic knowledge search',
        'Direct wealth manager & broker API sync',
        'Air-gapped enterprise family office deployment',
      ],
      primary: true,
      cta: 'Activate Sovereign Pro',
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: '140px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="editorial-container">
        {/* Section Header */}
        <div style={{ marginBottom: '72px' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="chapter-eyebrow"
          >
            <span className="chapter-eyebrow-bullet" />
            <span>Chapter 07: [ Sovereign Access ]</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-display-heading"
            style={{
              fontSize: 'clamp(36px, 4.8vw, 60px)',
              maxWidth: '520px',
              marginBottom: '18px',
            }}
          >
            What it costs.
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
              maxWidth: '520px',
            }}
          >
            Investor protection must never be paywalled. The sovereign core is free for every retail investor in India.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
          className="pricing-editorial-grid"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: tier.primary ? 'rgba(255, 92, 141, 0.035)' : 'rgba(255, 255, 255, 0.02)',
                border: tier.primary ? '1px solid var(--accent-border)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {tier.primary && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '24px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    backgroundColor: 'var(--accent-bg)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 92, 141, 0.25)',
                  }}
                >
                  RECOMMENDED
                </div>
              )}

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: tier.primary ? 'var(--accent)' : 'rgba(255, 255, 255, 0.4)',
                    marginBottom: '20px',
                  }}
                >
                  {tier.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(44px, 5vw, 58px)',
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      color: '#FFFFFF',
                      lineHeight: 1,
                    }}
                  >
                    {tier.price}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    marginBottom: '40px',
                  }}
                >
                  {tier.period}
                </div>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Check
                        style={{
                          width: '15px',
                          height: '15px',
                          color: tier.primary ? 'var(--accent)' : 'var(--color-trusted)',
                          marginTop: '2px',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.72)',
                          lineHeight: 1.45,
                        }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={tier.primary ? onOpenRegister : onOpenConsole}
                className={tier.primary ? 'btn-primary-titanium' : 'btn-secondary-hairline'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{tier.cta}</span>
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Security guarantee footnote */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.3)',
            marginTop: '32px',
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          Zero password harvesting • Zero telemetry tracking • Air-gapped enterprise deployments available for wealth desks
        </p>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .pricing-editorial-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
