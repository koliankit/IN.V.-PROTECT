import React from 'react';
import { motion } from 'framer-motion';

export const ProductShowcase: React.FC = () => {
  return (
    <section
      id="product-showcase"
      style={{
        position: 'relative',
        padding: '140px 24px',
        backgroundColor: '#0A0A0D',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Background Subtle Radial Gradient */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#38BDF8',
            marginBottom: '16px',
          }}
        >
          SOVEREIGN DEFENSE PLANE
        </motion.div>

        {/* Large Centered Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            maxWidth: '840px',
            marginBottom: '20px',
          }}
        >
          Designed to defend every rupee.
        </motion.h2>

        {/* Small Muted Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#8E8E93',
            maxWidth: '620px',
            marginBottom: '64px',
          }}
        >
          Unlike generic chatbots that hallucinate financial advice, Sangyan anchors every verdict in statutory registry databases, official SEBI circulars, and RBI master directions.
        </motion.p>

        {/* Large Product Screenshot with Glass Frame */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '1140px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#121318',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.08)',
            position: 'relative',
          }}
        >
          {/* Mock Console Top Bar */}
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: 'rgba(18, 19, 24, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span
                style={{
                  marginLeft: '12px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                sangyan://console.sovereign/live-threat-radar
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'subtlePulse 2s infinite' }} />
                SEBI & RBI GROUNDED
              </span>
            </div>
          </div>

          {/* Actual Dashboard Screenshot */}
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
