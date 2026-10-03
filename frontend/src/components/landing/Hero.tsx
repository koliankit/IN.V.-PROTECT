import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

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
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Concentric Ambient Depth from Reference Inspiration */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '520px',
          background: 'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(229, 62, 62, 0.05) 0%, transparent 70%)',
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
        {/* Editorial Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="chapter-eyebrow"
        >
          <span className="chapter-eyebrow-bullet" />
          <span>Chapter 01: [ Autonomous Scam Intelligence ]</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.25)', margin: '0 4px' }}>•</span>
          <span style={{ color: 'var(--color-trusted)', fontSize: '10px', letterSpacing: '0.08em' }}>SEBI &amp; RBI GROUNDED</span>
        </motion.div>

        {/* Grand Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-display-heading"
          style={{
            fontSize: 'clamp(44px, 6.4vw, 84px)',
            maxWidth: '920px',
            marginBottom: '28px',
          }}
        >
          Autonomous fraud
          <br />
          intelligence, built
          <br />
          <span className="editorial-headline-gradient">for Indian investors.</span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(16px, 1.6vw, 19px)',
            fontWeight: 400,
            lineHeight: 1.68,
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '580px',
            marginBottom: '44px',
          }}
        >
          Grounded in 14,000+ statutory SEBI, RBI, and I4C regulatory gazettes.
          Intercepting predatory investment syndicates, fake pre-IPO allotments,
          and unregistered pump channels before capital leaves your bank.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '88px',
          }}
        >
          <button onClick={onOpenConsole} className="btn-primary-titanium">
            <span>Launch Shield Console</span>
            <ArrowUpRight style={{ width: '15px', height: '15px' }} />
          </button>

          <button onClick={onExploreDemo} className="btn-secondary-hairline">
            <span>Explore Live Forensic Inspector</span>
            <ArrowDown style={{ width: '14px', height: '14px' }} />
          </button>
        </motion.div>

        {/* Hero Product Visual Frame */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1160px',
          }}
        >
          {/* Subtle Warm Atmospheric Halo Behind Product */}
          <div
            style={{
              position: 'absolute',
              inset: '-16px -16px 0 -16px',
              background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(229, 62, 62, 0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div
            className="editorial-panel glossy-reflection"
            style={{
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              boxShadow: '0 32px 80px -20px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Window Header Bar */}
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: 'rgba(18, 14, 18, 0.92)',
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
                    marginLeft: '10px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  inv-protect://telemetry/radar.active
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
                  STATUTORY FEED LIVE
                </span>
              </div>
            </div>

            <img
              src="/images/hero-product.png"
              alt="IN.V.PROTECT Sovereign Investor Shield Console"
              width={1600}
              height={1000}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
