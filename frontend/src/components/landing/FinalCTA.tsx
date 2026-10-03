import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface FinalCTAProps {
  onOpenRegister: () => void;
  onOpenConsole: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenRegister, onOpenConsole }) => {
  return (
    <section
      id="final-cta"
      style={{
        padding: '160px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Concentric Ambient Backdrop Inspired by Reference */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '560px',
          background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 92, 141, 0.1) 0%, rgba(224, 122, 95, 0.05) 45%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="editorial-container"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="chapter-eyebrow"
          >
            <span className="chapter-eyebrow-bullet" />
            <span>Chapter 09: [ Active Sovereign Deployment ]</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-display-heading"
            style={{
              fontSize: 'clamp(44px, 6.2vw, 80px)',
              marginBottom: '28px',
            }}
          >
            Shield your
            <br />
            <span className="editorial-headline-gradient">capital today.</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.18 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(16px, 1.6vw, 19px)',
              lineHeight: 1.68,
              color: 'rgba(255, 255, 255, 0.58)',
              maxWidth: '560px',
              marginBottom: '48px',
            }}
          >
            Deploy autonomous scam intelligence across your personal devices in under 60 seconds. Zero passwords. Zero surveillance. Absolute investor protection.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <button onClick={onOpenRegister} className="btn-primary-titanium">
              <span>Get Started Free</span>
              <ArrowUpRight style={{ width: '15px', height: '15px' }} />
            </button>

            <button onClick={onOpenConsole} className="btn-secondary-hairline">
              <span>Launch Shield Console</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
