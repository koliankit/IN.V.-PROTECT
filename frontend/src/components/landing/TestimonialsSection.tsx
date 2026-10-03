import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="community"
      style={{
        padding: '160px 24px',
        backgroundColor: '#F8F9FB',
        color: '#08080B',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.4s ease',
      }}
    >
      {/* Background Accent Mesh */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#0284C7',
            marginBottom: '16px',
          }}
        >
          COMMUNITY & INSTITUTIONAL TRUST
        </motion.div>

        {/* Large Centered Headline with Dark Typography */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#0A0A0D',
            maxWidth: '780px',
            margin: '0 auto 20px auto',
          }}
        >
          Inspired by users,
          <br />
          built for the future.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#4B5563',
            maxWidth: '580px',
            margin: '0 auto 64px auto',
          }}
        >
          Empowering Indian retail investors and compliance desks with infallible regulatory verification.
        </motion.p>

        {/* Stacked Cards Container */}
        <div
          style={{
            position: 'relative',
            maxWidth: '780px',
            margin: '0 auto',
          }}
        >
          {/* Background Stacked Card 2 */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '4%',
              right: '4%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '24px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
              transform: 'scale(0.96)',
              zIndex: 1,
            }}
          />

          {/* Background Stacked Card 1 */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '2%',
              right: '2%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '24px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.04)',
              transform: 'scale(0.98)',
              zIndex: 2,
            }}
          />

          {/* Foreground Primary Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              zIndex: 3,
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '56px 48px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '28px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} style={{ width: '18px', height: '18px', color: '#F59E0B', fill: '#F59E0B' }} />
              ))}
            </div>

            {/* Testimonial Quote */}
            <blockquote
              style={{
                fontSize: 'clamp(18px, 2.2vw, 24px)',
                fontWeight: 500,
                lineHeight: 1.5,
                color: '#111827',
                marginBottom: '36px',
                fontStyle: 'normal',
                letterSpacing: '-0.02em',
              }}
            >
              "Sangyan AI eliminated 99.4% of impersonation scams across our investor network within the first 48 hours. The direct SEBI regulatory citations gave our clients incontrovertible proof before transferring capital."
            </blockquote>

            {/* User Meta with Real Avatar */}
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
                  border: '2px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                loading="lazy"
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                    Priya Sundaram
                  </span>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#0284C7' }} />
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  Head of Risk & Investor Protection // Bharat Wealth Partners
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
