import React from 'react';
import { motion } from 'framer-motion';

export const ProductShowcase: React.FC = () => {
  return (
    <section
      id="product-showcase"
      style={{
        position: 'relative',
        padding: '140px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Concentric Ambient Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '960px',
          height: '540px',
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(224, 122, 95, 0.07) 0%, rgba(255, 92, 141, 0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="editorial-container"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Editorial Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="chapter-eyebrow"
        >
          <span className="chapter-eyebrow-bullet" />
          <span>Chapter 02: [ Sovereign Defense Plane ]</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-display-heading"
          style={{
            fontSize: 'clamp(38px, 5.2vw, 68px)',
            maxWidth: '860px',
            marginBottom: '20px',
          }}
        >
          Designed to defend every rupee.
        </motion.h2>

        {/* Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.16 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.68,
            color: 'rgba(255, 255, 255, 0.58)',
            maxWidth: '640px',
            marginBottom: '64px',
          }}
        >
          Unlike generic chatbots that hallucinate financial advice, Sangyan anchors every verdict in statutory registry databases, official SEBI circulars, and RBI master directions.
        </motion.p>

        {/* Product Screenshot Frame */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '1160px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#0F0C0F',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 90px -15px rgba(0, 0, 0, 0.95), 0 0 1px rgba(255, 255, 255, 0.15)',
            position: 'relative',
          }}
        >
          {/* Mock Console Top Bar */}
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: 'rgba(18, 14, 18, 0.95)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <span
                style={{
                  marginLeft: '12px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(255, 255, 255, 0.45)',
                }}
              >
                sangyan://console.sovereign/live-threat-radar
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: 'var(--color-trusted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-trusted)',
                    boxShadow: '0 0 8px var(--color-trusted)',
                  }}
                />
                STATUTORY GROUNDING ENFORCED
              </span>
            </div>
          </div>

          <img
            src="/images/dashboard.png"
            alt="Sangyan AI Real-Time Investor Shield Dashboard"
            width={1600}
            height={1000}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};
