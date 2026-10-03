import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Play,
  Pause,
  Subtitles,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  ArrowLeft,
} from 'lucide-react';

export interface LessonItem {
  id: string;
  lessonNumber: string;
  title: string;
  subtitle: string;
  duration: number; // in seconds
  initialProgress: number; // in seconds
}

export const ACADEMY_LESSONS: LessonItem[] = [
  {
    id: 'lesson-5',
    lessonNumber: 'Lesson 5',
    title: 'The art of A/B testing',
    subtitle: 'Building a World-Class Outbound Program | Josh Garrison',
    duration: 345, // 5:45
    initialProgress: 31, // 0:31 as in reference
  },
  {
    id: 'lesson-1',
    lessonNumber: 'Lesson 1',
    title: 'The Art of Scam Interception',
    subtitle: 'Personal Digital Security Layer for Investors | IN.V. PROTECT',
    duration: 412,
    initialProgress: 45,
  },
  {
    id: 'lesson-2',
    lessonNumber: 'Lesson 2',
    title: 'Fake SEBI & Digital Arrest Defense',
    subtitle: 'Statutory Verification & Deepfake Interception | Sangyan AI',
    duration: 520,
    initialProgress: 78,
  },
  {
    id: 'lesson-3',
    lessonNumber: 'Lesson 3',
    title: 'Zero-Trust Quarantine Architecture',
    subtitle: 'Statutory Forensic Vault & Evidence Hardening | Investor Shield',
    duration: 380,
    initialProgress: 60,
  },
  {
    id: 'lesson-4',
    lessonNumber: 'Lesson 4',
    title: 'Continuous Multi-Channel Defense',
    subtitle: 'Cross-Device Investor Security Network | Financial SOC',
    duration: 490,
    initialProgress: 110,
  },
];

interface VideoLessonHeroProps {
  onBackToDashboard?: () => void;
  defaultLessonIndex?: number;
}

export const VideoLessonHero: React.FC<VideoLessonHeroProps> = ({
  onBackToDashboard,
  defaultLessonIndex = 0,
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(defaultLessonIndex);
  const activeLesson = ACADEMY_LESSONS[activeLessonIndex];

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(activeLesson.initialProgress);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [showChapterMenu, setShowChapterMenu] = useState<boolean>(false);

  // Animation DOM refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Subheading ("Lesson 5"): Fade in from opacity 0 to 1, translateY: -24px to 0, duration: 0.6s, ease: "power2.out"
      if (subheadingRef.current) {
        gsap.fromTo(
          subheadingRef.current,
          { opacity: 0, y: -24 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
      }

      // Main heading ("The art of A/B testing"): Fade in from opacity 0 to 1, translateY: 24px to 0, duration: 0.8s, ease: "power2.out", delay: 0.2s
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
        );
      }

      // Subtitle ("Building a World-Class Outbound Program | Josh Garrison"): Fade in from opacity 0 to 1, duration: 0.6s, delay: 0.5s
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 0.5, ease: 'power2.out' }
        );
      }

      // Video player controls: Fade in from opacity 0 to 1, duration: 0.8s, delay: 0.7s
      if (controlsRef.current) {
        gsap.fromTo(
          controlsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, delay: 0.7, ease: 'power2.out' }
        );
      }

      // Academy watermark logo fade in
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, delay: 0.6, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [activeLessonIndex]);

  // Video playback timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeLesson.duration) {
            setIsPlaying(false);
            return activeLesson.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeLesson.duration]);

  // Progress Bar click handler
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(Math.round(percentage * activeLesson.duration));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = (currentTime / activeLesson.duration) * 100;

  return (
    <div
      className="academy-hero-page"
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Floating Navigation Toolbar (Context switch back to IN.V. PROTECT Console) */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
              title="Return to IN.V. PROTECT Security Console"
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Back to Security Hub
            </button>
          )}

          {/* Chapter Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              style={{
                backgroundColor: 'rgba(255, 92, 141, 0.15)',
                color: '#FF5C8D',
                border: '1px solid rgba(255, 92, 141, 0.35)',
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              Chapters ({activeLesson.lessonNumber}) ▾
            </button>

            {showChapterMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  marginTop: '8px',
                  left: 0,
                  width: '320px',
                  backgroundColor: '#11161C',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
                  padding: '8px',
                  zIndex: 50,
                }}
              >
                <div style={{ fontSize: '11px', color: '#6F7A86', padding: '6px 10px', textTransform: 'uppercase', fontWeight: 800 }}>
                  Masterclass Lessons
                </div>
                {ACADEMY_LESSONS.map((les, idx) => (
                  <button
                    key={les.id}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setCurrentTime(les.initialProgress);
                      setShowChapterMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: idx === activeLessonIndex ? 'rgba(255, 92, 141, 0.12)' : 'transparent',
                      color: idx === activeLessonIndex ? '#FF5C8D' : '#E0E0E0',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>{les.lessonNumber}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{les.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reference Spec Indicator */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#AEB7C2',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ color: '#FF5C8D', fontWeight: 700 }}>● Reference Mode:</span> Josh Garrison A/B Testing
        </div>
      </div>

      {/* ============================================================== */}
      {/* 16:9 Aspect Ratio Main Container                               */}
      {/* ============================================================== */}
      <div
        ref={containerRef}
        className="academy-hero-container"
        style={{
          aspectRatio: '16 / 9',
          maxWidth: '1200px',
          width: '90vw',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          background: 'radial-gradient(circle at 50% 50%, #2B0A18 0%, #000000 100%)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Subtle Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.65) 100%)',
            zIndex: 1,
          }}
        />

        {/* Central Content Vertical Stack */}
        <div
          className="academy-content-stack"
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 32px',
          }}
        >
          {/* Subheading: "Lesson 5" */}
          <div
            ref={subheadingRef}
            className="academy-subheading"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '1.25rem', // 20px
              lineHeight: 1.2,
              letterSpacing: 0,
              color: '#FF5C8D',
              textTransform: 'none',
              marginBottom: '32px',
            }}
          >
            {activeLesson.lessonNumber}
          </div>

          {/* Main Heading: "The art of A/B testing" */}
          <h1
            ref={headingRef}
            className="academy-main-heading"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '5.5rem', // approx 88px
              lineHeight: 1.05,
              letterSpacing: 0,
              color: '#FFFFFF',
              textTransform: 'none',
              marginBottom: '24px',
              maxWidth: '960px',
              margin: '0 auto 24px auto',
            }}
          >
            {activeLesson.title}
          </h1>

          {/* Subtitle: "Building a World-Class Outbound Program | Josh Garrison" */}
          <p
            ref={subtitleRef}
            className="academy-subtitle"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '1.125rem', // 18px
              lineHeight: 1.3,
              letterSpacing: 0,
              color: '#E0E0E0',
              textTransform: 'none',
              marginBottom: 0,
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {activeLesson.subtitle}
          </p>
        </div>

        {/* Academy Watermark Logo in Bottom Right (Watermarked in video area right above controls) */}
        <div
          ref={logoRef}
          style={{
            position: 'absolute',
            bottom: '76px',
            right: '24px',
            zIndex: 4,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            marginRight: '24px',
          }}
        >
          <svg
            height="24"
            viewBox="0 0 148 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: '24px', width: 'auto', display: 'block' }}
            className="academy-logo-svg"
          >
            {/* Stylized 'A' with sharp geometric silhouette and triangle cutout */}
            <path
              d="M14 2L26 26H20L17.5 21H10.5L8 26H2L14 2ZM14 9.5L11.7 16.5H16.3L14 9.5Z"
              fill="#FFFFFF"
              fillRule="evenodd"
            />
            {/* Geometric sans word CADEMY */}
            <text
              x="32"
              y="21"
              fill="#FFFFFF"
              fontFamily="'Inter', sans-serif"
              fontSize="17"
              fontWeight="800"
              letterSpacing="0.08em"
            >
              CADEMY
            </text>
          </svg>
        </div>

        {/* ============================================================== */}
        {/* Video Player Controls Dock (56px, #E0E0E0 Background)          */}
        {/* ============================================================== */}
        <div
          ref={controlsRef}
          className="academy-controls-bar"
          style={{
            position: 'relative',
            zIndex: 5,
            backgroundColor: '#E0E0E0',
            width: '100%',
            height: '56px',
            borderRadius: '0 0 16px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Left Controls: Play/Pause button + Current Time ("0:31") + Progress Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              gap: '14px',
              marginRight: '20px',
            }}
          >
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                color: '#B0B0B0',
                transition: 'color 0.15s ease',
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause style={{ width: '24px', height: '24px', color: '#B0B0B0' }} />
              ) : (
                <Play style={{ width: '24px', height: '24px', color: '#B0B0B0', fill: '#B0B0B0' }} />
              )}
            </button>

            {/* Current Time ("0:31") */}
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                color: '#707070',
                minWidth: '36px',
                userSelect: 'none',
              }}
            >
              {formatTime(currentTime)}
            </span>

            {/* Interactive Progress Bar */}
            <div
              className="academy-progress-track"
              onClick={handleProgressClick}
              style={{
                height: '4px',
                backgroundColor: '#B0B0B0',
                borderRadius: '9999px',
                flex: 1,
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              title="Seek progress"
            >
              <div
                className="academy-progress-fill"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${progressPercent}%`,
                  backgroundColor: '#FF5C8D',
                  borderRadius: '9999px',
                }}
              />
            </div>
          </div>

          {/* Right Controls: CC + Settings + Fullscreen */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            {/* CC (Closed Captions) Button */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B0B0B0',
                opacity: showCaptions ? 1 : 0.6,
              }}
              title={showCaptions ? 'Closed Captions Enabled' : 'Closed Captions Disabled'}
            >
              <Subtitles style={{ width: '24px', height: '24px', color: '#B0B0B0' }} />
            </button>

            {/* Settings (Gear) Icon */}
            <button
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B0B0B0',
              }}
              title="Lesson Settings"
            >
              <SettingsIcon style={{ width: '24px', height: '24px', color: '#B0B0B0' }} />
            </button>

            {/* Fullscreen Icon */}
            <button
              onClick={toggleFullscreen}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B0B0B0',
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 style={{ width: '24px', height: '24px', color: '#B0B0B0' }} />
              ) : (
                <Maximize2 style={{ width: '24px', height: '24px', color: '#B0B0B0' }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
