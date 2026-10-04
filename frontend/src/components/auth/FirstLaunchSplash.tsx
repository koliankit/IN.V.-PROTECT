import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FastForward, Terminal, Sparkles } from 'lucide-react';

interface FirstLaunchSplashProps {
  onGetStarted: () => void;
  onDirectLogin?: () => void;
  autoAdvance?: boolean;
}

const GLYPHS = '01#$&*@%!<>[]{}ABCDEFGHJKLMNPQRSTUVWXYZ';

// Custom hook for cyber text scramble decryption effect
function useScrambleText(targetText: string, trigger: boolean, durationMs: number = 1000) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!trigger) {
      setText('');
      return;
    }

    let frame = 0;
    const totalFrames = Math.max(15, Math.round(durationMs / 35));
    const chars = targetText.split('');

    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      const revealedCount = Math.floor(progress * chars.length);

      const scrambled = chars
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < revealedCount) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setText(targetText);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [targetText, trigger, durationMs]);

  return text;
}

export const FirstLaunchSplash: React.FC<FirstLaunchSplashProps> = ({
  onGetStarted,
  autoAdvance = true,
}) => {
  // Phases: 'boot' -> 'terminal' -> 'reveal' -> 'exit'
  const [phase, setPhase] = useState<'boot' | 'terminal' | 'reveal' | 'exit'>('boot');
  const [terminalStep, setTerminalStep] = useState<number>(0);
  const [progressVal, setProgressVal] = useState<number>(0);

  const titleScramble = useScrambleText('IN.V. PROTECT', phase === 'reveal', 1200);
  const taglineScramble = useScrambleText(
    'Personal Digital Security Layer for Investors',
    phase === 'reveal',
    1000
  );

  const terminalLines = [
    'INITIALIZING ZERO-TRUST INVESTOR DEFENSE...',
    'CONNECTING SEBI STATUTORY REGISTRIES (sebi.gov.in)...',
    'VERIFYING RBI FINANCIAL AWARENESS RULES (rbi.org.in)...',
    'SYNCHRONIZING I4C NATIONAL CYBER HELPLINE (1930)...',
    'ALL 14,000+ REGULATORY GAZETTES LOADED — STATUS: ACTIVE',
  ];

  // Boot -> Terminal Phase Transition
  useEffect(() => {
    const tBoot = setTimeout(() => {
      setPhase('terminal');
    }, 200);
    return () => clearTimeout(tBoot);
  }, []);

  // Step through terminal lines with progress bar
  useEffect(() => {
    if (phase !== 'terminal') return;

    const interval = setInterval(() => {
      setTerminalStep((prev) => {
        if (prev < terminalLines.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('reveal');
          }, 450);
          return prev;
        }
      });
    }, 450);

    const progressInterval = setInterval(() => {
      setProgressVal((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [phase]);

  // When in reveal, auto-advance if configured
  useEffect(() => {
    if (phase === 'reveal' && autoAdvance) {
      const exitTimer = setTimeout(() => {
        handleComplete();
      }, 4200);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, autoAdvance]);

  const handleComplete = () => {
    setPhase('exit');
    setTimeout(() => {
      onGetStarted();
    }, 400);
  };

  const securityPillars = ['DETECT', 'VERIFY', 'PROTECT', 'EXPLAIN', 'RESPOND'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080C0F',
        color: '#F5F7F8',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
      onClick={() => {
        if (phase === 'terminal') setPhase('reveal');
        else if (phase === 'reveal') handleComplete();
      }}
    >
      {/* Dynamic Glowing Ambient Orbs for Glassmorphism Backlight */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '28%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2, 195, 154, 0.35) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
          opacity: [0.10, 0.22, 0.10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '25%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77, 163, 255, 0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle Technical Matrix Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Frosted Glass Skip Intro Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleComplete();
        }}
        style={{
          position: 'fixed',
          top: '28px',
          right: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 22, 26, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          color: '#F5F7F8',
          borderRadius: '24px',
          padding: '9px 20px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 100,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(16, 22, 26, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(2, 195, 154, 0.5)';
          e.currentTarget.style.boxShadow =
            '0 8px 32px rgba(0, 0, 0, 0.55), 0 0 15px rgba(2, 195, 154, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(16, 22, 26, 0.55)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
          e.currentTarget.style.boxShadow =
            '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
        }}
      >
        <span>Skip Intro</span>
        <FastForward style={{ width: '13px', height: '13px', color: '#02C39A' }} />
      </button>

      <AnimatePresence mode="wait">
        {/* PHASE 1: FROSTED GLASS TERMINAL STAGE */}
        {phase === 'terminal' && (
          <motion.div
            key="terminal-stage"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '90%',
              maxWidth: '640px',
              backgroundColor: 'rgba(16, 22, 26, 0.60)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '28px 32px',
              boxShadow:
                '0 30px 80px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.20), 0 0 40px rgba(2, 195, 154, 0.12)',
              zIndex: 2,
              position: 'relative',
            }}
          >
            {/* Terminal Window Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
                marginBottom: '18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal style={{ width: '16px', height: '16px', color: '#02C39A' }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#02C39A',
                    letterSpacing: '0.08em',
                  }}
                >
                  IN.V.PROTECT // BOOTSTRAP_INTEGRITY_CHECK
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#E5484D', boxShadow: '0 0 6px #E5484D' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#F5B942', boxShadow: '0 0 6px #F5B942' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#02C39A', boxShadow: '0 0 6px #02C39A' }} />
              </div>
            </div>

            {/* Inner Glass Console Screen */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px 20px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                lineHeight: 1.85,
                color: '#9AA5AD',
                minHeight: '140px',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
              }}
            >
              {terminalLines.slice(0, terminalStep + 1).map((line, idx) => {
                const isLast = idx === terminalStep;
                const isCompleted = idx < terminalStep || terminalStep === terminalLines.length - 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: idx === terminalLines.length - 1 ? '#02C39A' : '#F5F7F8',
                    }}
                  >
                    <span style={{ color: isCompleted ? '#02C39A' : '#F5B942', fontSize: '10px' }}>
                      {isCompleted ? '✓' : '▶'}
                    </span>
                    <span>{line}</span>
                    {isLast && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '14px',
                          backgroundColor: '#02C39A',
                          marginLeft: '2px',
                          boxShadow: '0 0 8px #02C39A',
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Loading Progress Bar with Glass Track */}
            <div style={{ marginTop: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#9AA5AD',
                  marginBottom: '6px',
                }}
              >
                <span>VERIFYING REGULATORY SIGNATURES</span>
                <span style={{ color: '#02C39A', fontWeight: 700 }}>{progressVal}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    backgroundColor: '#02C39A',
                    boxShadow: '0 0 12px #02C39A',
                    width: `${progressVal}%`,
                    transition: 'width 0.15s ease',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: BRAND REVEAL IN FROSTED GLASS COMMAND MODULE */}
        {phase === 'reveal' && (
          <motion.div
            key="brand-reveal"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: 'center',
              maxWidth: '720px',
              width: '92%',
              padding: '42px 36px',
              zIndex: 2,
              backgroundColor: 'rgba(16, 22, 26, 0.60)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              boxShadow:
                '0 32px 90px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.20), 0 0 50px rgba(2, 195, 154, 0.12)',
              position: 'relative',
            }}
          >
            {/* Top Subtle Specular Edge Refraction */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '15%',
                right: '15%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Frosted Cybersecurity Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 18px',
                borderRadius: '24px',
                background: 'rgba(2, 195, 154, 0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(2, 195, 154, 0.35)',
                color: '#02C39A',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '24px',
                boxShadow: '0 0 24px rgba(2, 195, 154, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#02C39A',
                  boxShadow: '0 0 8px #02C39A',
                }}
              />
              <span>SYSTEM PROTECTED • SEBI &amp; RBI GROUNDED</span>
              <Sparkles style={{ width: '12px', height: '12px', color: '#02C39A' }} />
            </motion.div>

            {/* Kinetic Decrypted Product Title with Glowing Text */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              style={{
                fontSize: 'clamp(44px, 5.8vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: '0 0 16px 0',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.08,
                textShadow: '0 0 50px rgba(2, 195, 154, 0.35)',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 30%, #02C39A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                {titleScramble || 'IN.V. PROTECT'}
              </span>
            </motion.h1>

            {/* Animated Decrypt Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                fontSize: 'clamp(16px, 1.8vw, 19px)',
                fontWeight: 600,
                color: '#02C39A',
                margin: '0 0 28px 0',
                letterSpacing: '0.01em',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {taglineScramble || 'Personal Digital Security Layer for Investors'}
            </motion.p>

            {/* 5 Security Pillars in Frosted Glass Badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '36px',
              }}
            >
              {securityPillars.map((pillar, pIdx) => (
                <motion.div
                  key={pIdx}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.45 + pIdx * 0.08, duration: 0.35 }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#F5F7F8',
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.10)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(2, 195, 154, 0.10)',
                    borderColor: 'rgba(2, 195, 154, 0.4)',
                    color: '#02C39A',
                    boxShadow:
                      '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 15px rgba(2, 195, 154, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span style={{ color: '#02C39A', marginRight: '6px' }}>•</span>
                  {pillar}
                </motion.div>
              ))}
            </div>

            {/* Launch Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.4 }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                style={{
                  backgroundColor: '#02C39A',
                  color: '#080C0F',
                  fontWeight: 800,
                  fontSize: '14px',
                  padding: '14px 34px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow:
                    '0 6px 28px rgba(2, 195, 154, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 36px rgba(2, 195, 154, 0.60), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow =
                    '0 6px 28px rgba(2, 195, 154, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
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
