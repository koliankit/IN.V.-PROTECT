import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="community"
      style={{
        padding: '160px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Concentric Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '480px',
          background: 'radial-gradient(circle, var(--accent-bg) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="editorial-container"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="chapter-eyebrow"
          style={{ justifyContent: 'center' }}
        >
          <span className="chapter-eyebrow-bullet" />
          <span>Chapter 08: [ Community &amp; Institutional Trust ]</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-display-heading"
          style={{
            fontSize: 'clamp(36px, 5vw, 62px)',
            maxWidth: '780px',
            margin: '0 auto 20px auto',
          }}
        >
          Inspired by investors,
          <br />
          engineered for certainty.
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
            maxWidth: '560px',
            margin: '0 auto 64px auto',
          }}
        >
          Empowering Indian retail investors and compliance desks with infallible regulatory verification.
        </motion.p>

        {/* Editorial Testimonial Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-panel glossy-reflection"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '56px 48px',
            backgroundColor: '#0E0B0E',
            border: '1px solid var(--accent-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 24px 70px -15px rgba(0, 0, 0, 0.8), 0 0 1px var(--accent-border)',
          }}
        >
          {/* Star Ratings */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '28px' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} style={{ width: '16px', height: '16px', color: '#F59E0B', fill: '#F59E0B' }} />
            ))}
          </div>

          {/* Testimonial Quote */}
          <blockquote
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(19px, 2.3vw, 26px)',
              fontWeight: 500,
              lineHeight: 1.5,
              color: '#FFFFFF',
              marginBottom: '36px',
              letterSpacing: '-0.025em',
            }}
          >
            "Sangyan AI eliminated 99.4% of impersonation scams across our investor network within the first 48 hours. The direct SEBI regulatory citations gave our clients incontrovertible proof before transferring capital."
          </blockquote>

          {/* User Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/images/testimonial-avatar.png"
              alt="Priya Sundaram - Chief Risk Officer"
              width={56}
              height={56}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(229,62,62,0.4)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              }}
              loading="lazy"
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                  Priya Sundaram
                </span>
                <ShieldCheck style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Head of Risk &amp; Investor Protection // Bharat Wealth Partners
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
