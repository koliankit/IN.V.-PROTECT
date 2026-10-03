import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface FirstLaunchSplashProps {
  onGetStarted: () => void;
  onDirectLogin?: () => void;
}

export const FirstLaunchSplash: React.FC<FirstLaunchSplashProps> = ({
  onGetStarted,
  onDirectLogin,
}) => {
  // Phase 1: outline (0-300ms), Phase 2: scan (300-700ms), Phase 3: active shield (700-1000ms), Phase 4: full content
  const [animStage, setAnimStage] = useState<'outline' | 'scanning' | 'active'>('outline');

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage('scanning'), 350);
    const t2 = setTimeout(() => setAnimStage('active'), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="security-grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#070a12',
        color: '#f8fafc',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {/* Animated Security Shield */}
        <div
          style={{
            position: 'relative',
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            backgroundColor: animStage === 'active' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            border: animStage === 'active' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
            overflow: 'hidden',
            boxShadow: animStage === 'active' ? '0 0 28px rgba(6, 182, 212, 0.2)' : 'none',
            transition: 'all 0.4s ease',
          }}
          className={animStage === 'active' ? 'animate-breathing' : ''}
        >
          {/* Scanning line animation */}
          {animStage === 'scanning' && <div className="scanner-beam" />}

          <motion.div
            initial={{ scale: 0.88, opacity: 0.6 }}
            animate={{
              scale: animStage === 'active' ? 1 : 0.92,
              opacity: animStage === 'active' ? 1 : 0.75,
            }}
            transition={{ duration: 0.4 }}
          >
            <Shield
              style={{
                width: '46px',
                height: '46px',
                color: animStage === 'active' ? '#06b6d4' : '#64748b',
                filter: animStage === 'active' ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' : 'none',
                transition: 'color 0.4s ease',
              }}
            />
          </motion.div>
        </div>

        {/* Title & Product Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: animStage === 'active' ? 1 : 0.3, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontSize: '11px',
              color: '#22d3ee',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
            }}
          >
            <CheckCircle2 style={{ width: '12px', height: '12px' }} />
            SANGYAN 2026 • Investor Shield
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: '0 0 6px 0',
            }}
          >
            IN V PROTECT
          </h1>
          <p
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#06b6d4',
              margin: '0 0 16px 0',
              letterSpacing: '-0.01em',
            }}
          >
            Personal Digital Security Layer
          </p>

          <p
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '360px',
              margin: '0 auto 32px auto',
            }}
          >
            Protect your digital financial communications against manipulative schemes, credential harvesting, and fraudulent claims.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: animStage === 'active' ? 1 : 0, scale: animStage === 'active' ? 1 : 0.96 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{ width: '100%', maxWidth: '320px' }}
        >
          <button
            onClick={onGetStarted}
            style={{
              width: '100%',
              backgroundColor: '#06b6d4',
              color: '#080c14',
              fontWeight: 800,
              fontSize: '14px',
              padding: '13px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(6, 182, 212, 0.32)',
              letterSpacing: '0.02em',
              marginBottom: '14px',
            }}
          >
            Get Started
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>

          {onDirectLogin && (
            <button
              onClick={onDirectLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Already registered? <span style={{ color: '#22d3ee', textDecoration: 'underline' }}>Sign In</span>
            </button>
          )}
        </motion.div>

        {/* Security Assurances Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animStage === 'active' ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            fontSize: '11px',
            color: '#64748b',
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock style={{ width: '11px', height: '11px', color: '#10b981' }} />
            Secure
          </span>
          <span>•</span>
          <span>Private</span>
          <span>•</span>
          <span>User Controlled</span>
        </motion.div>
      </motion.div>
    </div>
  );
};
