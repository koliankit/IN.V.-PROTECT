import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ConcentricRingsVisualProps {
  centerContent?: React.ReactNode;
  className?: string;
}

export const ConcentricRingsVisual: React.FC<ConcentricRingsVisualProps> = ({
  centerContent,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const ring4Ref = useRef<HTMLDivElement>(null);
  const ring5Ref = useRef<HTMLDivElement>(null);
  const centerCircleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rings = [
      ring5Ref.current,
      ring4Ref.current,
      ring3Ref.current,
      ring2Ref.current,
      ring1Ref.current,
    ].filter(Boolean);

    // Concentric rings animation: scale: 0.8 -> 1, opacity: 0 -> 1, stagger: 0.2s, duration: 0.6s, ease: power2.out
    if (rings.length > 0) {
      gsap.fromTo(
        rings,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    }

    // Main center circle: scale: 0.8 -> 1, opacity: 0 -> 1
    if (centerCircleRef.current) {
      gsap.fromTo(
        centerCircleRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.4 }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`concentric-rings-container ${className}`}
      style={{
        position: 'relative',
        width: '420px',
        height: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Outer Ring 5: #B16CEA with subtle glow */}
      <div
        ref={ring5Ref}
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          border: '1.5px solid rgba(177, 108, 234, 0.28)',
          boxShadow: '0 0 60px rgba(177, 108, 234, 0.12)',
        }}
      />

      {/* Ring 4: #E1A1B0 */}
      <div
        ref={ring4Ref}
        style={{
          position: 'absolute',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          border: '1.5px solid rgba(225, 161, 176, 0.35)',
          boxShadow: '0 0 40px rgba(225, 161, 176, 0.15)',
        }}
      />

      {/* Ring 3: #C97A8A */}
      <div
        ref={ring3Ref}
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '2px solid rgba(201, 122, 138, 0.45)',
          boxShadow: '0 0 30px rgba(201, 122, 138, 0.2)',
        }}
      />

      {/* Ring 2: #F15A8A */}
      <div
        ref={ring2Ref}
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: '2px solid rgba(241, 90, 138, 0.55)',
          boxShadow: '0 0 25px rgba(241, 90, 138, 0.25)',
        }}
      />

      {/* Ring 1: #FFB07C */}
      <div
        ref={ring1Ref}
        style={{
          position: 'absolute',
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 176, 124, 0.7)',
          boxShadow: '0 0 20px rgba(255, 176, 124, 0.35)',
        }}
      />

      {/* Main Center Circle (Perfect circular gradient core: #F15A8A -> #B05A6B) */}
      <div
        ref={centerCircleRef}
        style={{
          position: 'absolute',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFB07C 0%, #F15A8A 50%, #B05A6B 100%)',
          boxShadow: '0 0 32px rgba(241, 90, 138, 0.8), 0 0 12px rgba(255, 176, 124, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        {centerContent}
      </div>
    </div>
  );
};
