import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FastForward, Terminal } from 'lucide-react';

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
      {/* Subtle Ambient Depth & Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(2, 195, 154, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
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

      {/* Skip Intro Button */}
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
          background: 'rgba(16, 22, 26, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#9AA5AD',
          borderRadius: '24px',
          padding: '8px 18px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#F5F7F8';
          e.currentTarget.style.borderColor = 'rgba(2, 195, 154, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#9AA5AD';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        }}
      >
        <span>Skip Intro</span>
        <FastForward style={{ width: '13px', height: '13px', color: '#02C39A' }} />
      </button>

      <AnimatePresence mode="wait">
        {/* PHASE 1: KINETIC TERMINAL TEXT DECRYPTION ANIMATION */}
        {phase === 'terminal' && (
          <motion.div
            key="terminal-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              width: '90%',
              maxWidth: '620px',
              backgroundColor: '#10161A',
              border: '1px solid rgba(2, 195, 154, 0.25)',
              borderRadius: '14px',
              padding: '24px 28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(2, 195, 154, 0.08)',
              zIndex: 2,
            }}
          >
            {/* Terminal Window Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '14px',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal style={{ width: '15px', height: '15px', color: '#02C39A' }} />
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
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E5484D' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F5B942' }} />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#02C39A' }} />
              </div>
            </div>

            {/* Stepped Animated Log Lines */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                lineHeight: 1.8,
                color: '#9AA5AD',
                minHeight: '130px',
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
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Loading Progress Bar */}
            <div style={{ marginTop: '18px' }}>
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
                  height: '4px',
                  backgroundColor: '#151C20',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    backgroundColor: '#02C39A',
                    boxShadow: '0 0 10px #02C39A',
                    width: `${progressVal}%`,
                    transition: 'width 0.15s ease',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 2: BRAND REVEAL WITH ADVANCED KINETIC TEXT ANIMATION */}
        {phase === 'reveal' && (
          <motion.div
            key="brand-reveal"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: 'center',
              maxWidth: '680px',
              padding: '32px 24px',
              zIndex: 2,
            }}
          >
            {/* Cybersecurity Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '24px',
                background: 'rgba(2, 195, 154, 0.08)',
                border: '1px solid rgba(2, 195, 154, 0.30)',
                color: '#02C39A',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '24px',
                boxShadow: '0 0 20px rgba(2, 195, 154, 0.15)',
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
            </motion.div>

            {/* Kinetic Decrypted Product Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              style={{
                fontSize: 'clamp(46px, 6vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: '0 0 16px 0',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.08,
                textShadow: '0 0 40px rgba(2, 195, 154, 0.25)',
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
                fontSize: 'clamp(17px, 2vw, 20px)',
                fontWeight: 600,
                color: '#02C39A',
                margin: '0 0 24px 0',
                letterSpacing: '0.01em',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {taglineScramble || 'Personal Digital Security Layer for Investors'}
            </motion.p>

            {/* 5 Security Pillars Animated Staggered Badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
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
                    backgroundColor: '#10161A',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#9AA5AD',
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: 'all 0.2s ease',
                  }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: '#02C39A',
                    color: '#02C39A',
                  }}
                >
                  <span style={{ color: '#02C39A', marginRight: '4px' }}>•</span>
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
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 25px rgba(2, 195, 154, 0.35)',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(2, 195, 154, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 25px rgba(2, 195, 154, 0.35)';
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
