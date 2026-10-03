import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FastForward } from 'lucide-react';

interface FirstLaunchSplashProps {
  onGetStarted: () => void;
  onDirectLogin?: () => void;
  autoAdvance?: boolean;
}

export const FirstLaunchSplash: React.FC<FirstLaunchSplashProps> = ({
  onGetStarted,
  autoAdvance = true,
}) => {
  // Phases: 'black' (0-200ms) -> 'video' (200-3400ms) -> 'reveal' (brand headline) -> 'exit'
  const [phase, setPhase] = useState<'black' | 'video' | 'reveal' | 'exit'>('black');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredEnd = useRef(false);

  // Transition from black screen to video
  useEffect(() => {
    const tStart = setTimeout(() => {
      setPhase('video');
    }, 200);

    return () => clearTimeout(tStart);
  }, []);

  // When phase becomes video, play it
  useEffect(() => {
    if (phase === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts autoplay, fallback gracefully
          setVideoError(true);
        });
      }

      // Maximum 3.4s presentation duration as requested (2–4 seconds)
      const timer = setTimeout(() => {
        handleAdvanceToReveal();
      }, 3400);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  // When in reveal, auto-advance if configured
  useEffect(() => {
    if (phase === 'reveal' && autoAdvance) {
      const exitTimer = setTimeout(() => {
        handleComplete();
      }, 2200);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, autoAdvance]);

  const handleAdvanceToReveal = () => {
    if (hasTriggeredEnd.current) return;
    hasTriggeredEnd.current = true;
    setPhase('reveal');
  };

  const handleComplete = () => {
    setPhase('exit');
    setTimeout(() => {
      onGetStarted();
    }, 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-primary)',
        color: '#FFFFFF',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => {
        if (phase === 'video') handleAdvanceToReveal();
        else if (phase === 'reveal') handleComplete();
      }}
    >
      {/* Subtle edge network background */}
      <div className="cyber-network-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Skip button for immediate user control */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleComplete();
        }}
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          color: '#A7A7A7',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
          e.currentTarget.style.borderColor = '#e53e3e';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#A7A7A7';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
        }}
      >
        <span>Skip</span>
        <FastForward style={{ width: '12px', height: '12px' }} />
      </button>

      <AnimatePresence mode="wait">
        {/* PHASE: VIDEO ANIMATION */}
        {phase === 'video' && !videoError && (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '720px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <video
              ref={videoRef}
              src="/IN_V_PROTECT_logo_cropped.mp4"
              playsInline
              muted
              autoPlay
              onEnded={handleAdvanceToReveal}
              onError={() => {
                setVideoError(true);
                handleAdvanceToReveal();
              }}
              style={{
                width: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                borderRadius: '16px',
                filter: 'drop-shadow(0 0 32px rgba(229, 62, 62, 0.18))',
              }}
            >
              <source src="/IN_V_PROTECT_logo_cropped.mp4" type="video/mp4" />
              <source src="/assets/IN_V_PROTECT_logo_cropped.mp4" type="video/mp4" />
              <source src="/gemini_generated_video_63beae48.mp4" type="video/mp4" />
              <source src="/assets/gemini_generated_video_63beae48.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* PHASE: BRAND REVEAL */}
        {(phase === 'reveal' || videoError) && (
          <motion.div
            key="brand-reveal"
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: 'center',
              maxWidth: '540px',
              padding: '24px',
              zIndex: 2,
            }}
          >
            {/* Subtle Cybersecurity Emblem / Logo Tag */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '24px',
                background: 'rgba(229, 62, 62, 0.08)',
                border: '1px solid rgba(229, 62, 62, 0.30)',
                color: '#e53e3e',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '20px',
                boxShadow: '0 0 16px rgba(229, 62, 62, 0.20)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#e53e3e',
                  boxShadow: '0 0 8px #e53e3e',
                }}
              />
              SYSTEM PROTECTED
            </motion.div>

            {/* Product Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              style={{
                fontSize: '44px',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                margin: '0 0 12px 0',
                textShadow: '0 0 36px rgba(229, 62, 62, 0.35)',
              }}
            >
              IN.V. PROTECT
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                fontSize: '17px',
                fontWeight: 600,
                color: '#e53e3e',
                margin: '0 0 14px 0',
                letterSpacing: '0.01em',
              }}
            >
              Personal Digital Security Layer for Investors
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              style={{
                fontSize: '13px',
                color: '#A7A7A7',
                lineHeight: 1.6,
                maxWidth: '420px',
                margin: '0 auto 28px auto',
              }}
            >
              DETECT • VERIFY • PROTECT • EXPLAIN • RESPOND
            </motion.p>

            {/* Launch Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                style={{
                  backgroundColor: '#e53e3e',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(229, 62, 62, 0.40)',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(229, 62, 62, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(229, 62, 62, 0.40)';
                }}
              >
                <span>Enter Protection Layer</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
