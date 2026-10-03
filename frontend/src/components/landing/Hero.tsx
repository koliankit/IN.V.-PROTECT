import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';

interface HeroProps {
  onOpenConsole: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsole, onExploreDemo }) => {
  return (
    <section
      id="overview"
      style={{
        position: 'relative',
        paddingTop: '160px',
        paddingBottom: '120px',
        overflow: 'hidden',
        backgroundColor: '#08080B',
      }}
    >
      {/* Background ambient radial illumination */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '450px',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56, 189, 248, 0.12), rgba(15, 23, 42, 0.05) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 24px',
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
            PHASE 01
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
            IN V PROTECT • SANGYAN HACKATHON (TRACKS A & E)
          </span>
        </motion.div>

        {/* Large Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: '-0.035em',
            color: '#FFFFFF',
            maxWidth: '920px',
            margin: '0 auto 24px auto',
          }}
        >
          Autonomous fraud intelligence,
          <br />
          <span
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.65) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            built for Indian investors.
          </span>
        </motion.h1>

        {/* Short Muted Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#8E8E93',
            maxWidth: '640px',
            margin: '0 auto 40px auto',
          }}
        >
          Grounded in statutory SEBI, RBI, and I4C regulatory circulars. Intercepting predatory investment syndicates, fake IPOs, and fraudulent advisers before capital leaves your bank.
        </motion.p>

        {/* Small CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '72px',
          }}
        >
          <button
            onClick={onOpenConsole}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#08080B',
              fontWeight: 600,
              fontSize: '14px',
              padding: '12px 24px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 24px rgba(255, 255, 255, 0.15)',
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
            <span>Launch Shield Console</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>

          <button
            onClick={onExploreDemo}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 500,
              fontSize: '14px',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
            }}
          >
            <Terminal style={{ width: '15px', height: '15px', color: '#38BDF8' }} />
            <span>Explore Live Inspector</span>
          </button>
        </motion.div>

        {/* Large Floating Product Visual */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '1080px',
            position: 'relative',
          }}
        >
          {/* Subtle Glow Behind Product */}
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '24px',
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(56, 189, 248, 0.15), transparent 70%)',
              filter: 'blur(30px)',
              zIndex: 0,
            }}
          />

          {/* Floating Laptop / Product Visual */}
          <div
            className="animate-float"
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              backgroundColor: '#0A0A0D',
            }}
          >
            <img
              src="/images/hero-product.png"
              alt="Sangyan AI Investor Shield Terminal Laptop Mockup"
              width={1600}
              height={1000}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '16px',
              }}
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
