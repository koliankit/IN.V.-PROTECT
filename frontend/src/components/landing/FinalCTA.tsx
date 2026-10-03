import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';

interface FinalCTAProps {
  onOpenRegister: () => void;
  onOpenConsole: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenRegister, onOpenConsole }) => {
  return (
    <section
      id="final-cta"
      style={{
        position: 'relative',
        padding: '160px 24px',
        backgroundColor: '#08080B',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Background Animated Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56, 189, 248, 0.15), rgba(15, 23, 42, 0.08) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '880px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#38BDF8',
              textTransform: 'uppercase',
            }}
          >
            PHASE 02
          </span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.04em',
            }}
          >
            ACTIVE SOVEREIGN DEPLOYMENT
          </span>
        </motion.div>

        {/* Large Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(38px, 5.5vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: '#FFFFFF',
            marginBottom: '24px',
          }}
        >
          Shield your capital today.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            lineHeight: 1.6,
            color: '#8E8E93',
            maxWidth: '620px',
            margin: '0 auto 48px auto',
          }}
        >
          Deploy autonomous scam intelligence across your personal devices in under 60 seconds. Zero passwords. Zero surveillance. Absolute investor protection.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onOpenRegister}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#08080B',
              fontWeight: 600,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 30px rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2E8F0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            <span>Get Started Free</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>

          <button
            onClick={onOpenConsole}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 500,
              fontSize: '14px',
              padding: '14px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
            }}
          >
            <Shield style={{ width: '15px', height: '15px', color: '#38BDF8' }} />
            <span>Launch Shield Console</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
