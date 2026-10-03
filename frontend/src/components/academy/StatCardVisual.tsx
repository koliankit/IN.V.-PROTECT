import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { PhoneArrowIconSvg } from './AcademySvgIcons';

interface StatCardVisualProps {
  statText?: string;
  hasExtension?: boolean;
  extensionTitle?: string;
  extensionSubtitle?: string;
  className?: string;
}

export const StatCardVisual: React.FC<StatCardVisualProps> = ({
  statText = '84%',
  hasExtension = true,
  extensionTitle = 'Outbound Connect Rate',
  extensionSubtitle = 'High-velocity multichannel verification',
  className = '',
}) => {
  const cardGroupRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardGroupRef.current) {
      // Page-load animation: opacity 0 -> 1, translateX: 48px -> 0, duration: 0.9s, ease: power2.out
      gsap.fromTo(
        cardGroupRef.current,
        { opacity: 0, x: 48 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, []);

  const handleMouseEnter = () => {
    // Card scale: 1 -> 1.04, duration: 0.25s, ease: power1.out
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 1.04, duration: 0.25, ease: 'power1.out' });
    }
    // Icon moves upward approximately 8px, duration: 0.25s, ease: power1.out
    if (iconRef.current) {
      gsap.to(iconRef.current, { y: -8, duration: 0.25, ease: 'power1.out' });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 1, duration: 0.25, ease: 'power1.out' });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, { y: 0, duration: 0.25, ease: 'power1.out' });
    }
  };

  return (
    <div
      ref={cardGroupRef}
      className={`academy-stat-card-group ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* 160px × 160px Main Card */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '32px',
          background: 'linear-gradient(135deg, #F7B0A0 0%, #C05A6B 100%)',
          boxShadow: '0 20px 48px rgba(192, 90, 107, 0.42), 0 6px 18px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'box-shadow 0.25s ease',
        }}
      >
        {/* 64px × 64px Icon with black stroke ~2.5px */}
        <div
          ref={iconRef}
          style={{
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
          }}
        >
          <PhoneArrowIconSvg size={64} strokeWidth={2.5} />
        </div>

        {/* 24px Percentage/Stat Text */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          {statText}
        </div>
      </div>

      {/* Right-Side Extension: 320px × 160px, #3A3535, ~60% opacity, seamlessly attached, 32px border radius */}
      {hasExtension && (
        <div
          style={{
            width: '320px',
            height: '160px',
            backgroundColor: 'rgba(58, 53, 53, 0.6)',
            backdropFilter: 'blur(16px)',
            borderRadius: '0 32px 32px 0',
            marginLeft: '-24px',
            padding: '24px 28px 24px 44px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box',
            zIndex: 1,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderLeft: 'none',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#FFB07C',
              marginBottom: '6px',
            }}
          >
            Verified Performance
          </div>
          <div
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '4px',
            }}
          >
            {extensionTitle}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#A0A0A0',
              lineHeight: 1.4,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {extensionSubtitle}
          </div>
        </div>
      )}
    </div>
  );
};
