import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  AcademyLogoSvg,
  PlayIconSvg,
  PauseIconSvg,
  CaptionsIconSvg,
  VolumeIconSvg,
  VolumeMuteIconSvg,
  SettingsIconSvg,
  FullscreenIconSvg,
  ExitFullscreenIconSvg,
} from './AcademySvgIcons';
import { StatCardVisual } from './StatCardVisual';
import { ConcentricRingsVisual } from './ConcentricRingsVisual';

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
    duration: 345,
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

type LayoutVariant = 'video' | 'stat-card' | 'concentric-rings';

interface VideoLessonHeroProps {
  onBackToDashboard?: () => void;
  defaultLessonIndex?: number;
}

// Reusable Control Icon Button with 1.15 scale on hover (0.2s duration)
const ControlIconButton: React.FC<{
  onClick?: () => void;
  title?: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, active = true, children }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? '#A0A0A0' : '#555555',
        transition: 'transform 0.2s ease, color 0.2s ease',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.15)';
        e.currentTarget.style.color = '#FFFFFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.color = active ? '#A0A0A0' : '#555555';
      }}
    >
      {children}
    </button>
  );
};

export const VideoLessonHero: React.FC<VideoLessonHeroProps> = ({
  onBackToDashboard,
  defaultLessonIndex = 0,
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(defaultLessonIndex);
  const activeLesson = ACADEMY_LESSONS[activeLessonIndex];

  // Visual layout mode: 'video' (default 16:9 player) | 'stat-card' (160×160 card + extension) | 'concentric-rings'
  const [activeVariant, setActiveVariant] = useState<LayoutVariant>('video');

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(activeLesson.initialProgress);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [showChapterMenu, setShowChapterMenu] = useState<boolean>(false);

  // Animation DOM refs for GSAP
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const chapterLabelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const controlsBarRef = useRef<HTMLDivElement>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // GSAP Entrance Animations for Video Player View
  useEffect(() => {
    if (activeVariant === 'video') {
      const ctx = gsap.context(() => {
        // Heading: opacity 0 -> 1, translateY: 32px -> 0, duration: 0.8s, ease: power2.out
        if (headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
          );
        }

        // Chapter label: opacity 0 -> 1, translateY: -24px -> 0, duration: 0.6s, ease: power2.out
        if (chapterLabelRef.current) {
          gsap.fromTo(
            chapterLabelRef.current,
            { opacity: 0, y: -24 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
        }

        // Subtitle: fade in after main heading with slight upward movement
        if (subtitleRef.current) {
          gsap.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: 'power2.out' }
          );
        }

        // Video controls bar: opacity 0 -> 1, duration: 0.8s, delay: 0.65s
        if (controlsBarRef.current) {
          gsap.fromTo(
            controlsBarRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, delay: 0.65, ease: 'power2.out' }
          );
        }
      }, pageContainerRef);

      return () => ctx.revert();
    }
  }, [activeLessonIndex, activeVariant]);

  // Playback timer
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
      pageContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = (currentTime / activeLesson.duration) * 100;

  return (
    <div
      ref={pageContainerRef}
      className="academy-hero-page"
      style={{
        backgroundColor: '#000000',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top Floating Controls Toolbar (Switch layout variants & back to console) */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(23, 23, 23, 0.85)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s ease',
              }}
              title="Return to IN.V. PROTECT Security Console"
            >
              ← Back to Security Hub
            </button>
          )}

          {/* Chapters Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              style={{
                backgroundColor: 'rgba(241, 90, 138, 0.15)',
                color: '#F15A8A',
                border: '1px solid rgba(241, 90, 138, 0.35)',
                padding: '8px 14px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
              }}
            >
              {activeLesson.lessonNumber} ▾
            </button>

            {showChapterMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  marginTop: '8px',
                  left: 0,
                  width: '320px',
                  backgroundColor: '#171717',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                  padding: '8px',
                  zIndex: 60,
                }}
              >
                <div style={{ fontSize: '10px', color: '#A0A0A0', padding: '6px 12px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                  Lesson Chapters
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
                      backgroundColor: idx === activeLessonIndex ? 'rgba(241, 90, 138, 0.14)' : 'transparent',
                      color: idx === activeLessonIndex ? '#F15A8A' : '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>{les.lessonNumber}</span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>{les.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Layout Variant Segmented Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(23, 23, 23, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '3px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={() => setActiveVariant('video')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: activeVariant === 'video' ? '#F15A8A' : 'transparent',
              color: activeVariant === 'video' ? '#FFFFFF' : '#A0A0A0',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Video Frame (16:9)
          </button>
          <button
            onClick={() => setActiveVariant('stat-card')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: activeVariant === 'stat-card' ? '#F15A8A' : 'transparent',
              color: activeVariant === 'stat-card' ? '#FFFFFF' : '#A0A0A0',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Stat Card
          </button>
          <button
            onClick={() => setActiveVariant('concentric-rings')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: activeVariant === 'concentric-rings' ? '#F15A8A' : 'transparent',
              color: activeVariant === 'concentric-rings' ? '#FFFFFF' : '#A0A0A0',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Concentric Rings
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 16:9 Video Frame (Max-Width 900px, Centered, #1A0A1F Radial)    */}
      {/* ============================================================== */}
      <div
        ref={videoFrameRef}
        className="academy-video-frame"
        style={{
          width: '90vw',
          maxWidth: '900px',
          aspectRatio: '16 / 9',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at center, #1A0A1F 0%, #000000 100%)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.7) 100%)',
            zIndex: 1,
          }}
        />

        {/* Central Content Area based on Variant */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '32px 28px',
          }}
        >
          {/* VARIANT 1: VIDEO PLAYER SCREEN */}
          {activeVariant === 'video' && (
            <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto' }}>
              {/* Chapter Label: "Lesson 5" in muted rose (#F15A8A) */}
              <div
                ref={chapterLabelRef}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '1.25rem', // 20px
                  lineHeight: 1.2,
                  letterSpacing: 0,
                  color: '#F15A8A',
                  textTransform: 'none',
                  marginBottom: '24px',
                }}
              >
                {activeLesson.lessonNumber}
              </div>

              {/* Main Heading: "The art of A/B testing" */}
              <h1
                ref={headingRef}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '4.75rem', // scaled cleanly within 900px frame
                  lineHeight: 1.05,
                  letterSpacing: 0,
                  color: '#FFFFFF',
                  textTransform: 'none',
                  margin: '0 auto 20px auto',
                  maxWidth: '780px',
                }}
              >
                {activeLesson.title}
              </h1>

              {/* Subtitle: "Building a World-Class Outbound Program | Josh Garrison" */}
              <p
                ref={subtitleRef}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: '1.125rem', // 18px
                  lineHeight: 1.3,
                  letterSpacing: 0,
                  color: '#A0A0A0',
                  textTransform: 'none',
                  margin: '0 auto',
                  maxWidth: '680px',
                }}
              >
                {activeLesson.subtitle}
              </p>
            </div>
          )}

          {/* VARIANT 2: STAT CARD COMPONENT */}
          {activeVariant === 'stat-card' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  fontSize: '1.125rem',
                  color: '#F15A8A',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Key Conversion Metric
              </div>
              <StatCardVisual
                statText="84%"
                hasExtension={true}
                extensionTitle="Outbound Connect Rate"
                extensionSubtitle="High-velocity verified investor defense"
              />
            </div>
          )}

          {/* VARIANT 3: CONCENTRIC RINGS VISUAL */}
          {activeVariant === 'concentric-rings' && (
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ConcentricRingsVisual />
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                Muted Rose Continuous Sensor Rings
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* Video Player Controls Bar (48px, Dark Gray Background)          */}
        {/* ============================================================== */}
        <div
          ref={controlsBarRef}
          style={{
            position: 'relative',
            zIndex: 10,
            backgroundColor: '#1E1E1E',
            width: '100%',
            height: '48px',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxSizing: 'border-box',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            gap: '14px',
          }}
        >
          {/* Left Section: Play/Pause button + Timestamp ("0:31") + Progress Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              gap: '12px',
              marginRight: '16px',
            }}
          >
            {/* Play/Pause Button */}
            <ControlIconButton
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseIconSvg size={18} color="#A0A0A0" />
              ) : (
                <PlayIconSvg size={18} color="#A0A0A0" />
              )}
            </ControlIconButton>

            {/* Timestamp on Left ("0:31") */}
            <span
              style={{
                fontFamily: "'Inter', monospace, sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                color: '#A0A0A0',
                minWidth: '34px',
                userSelect: 'none',
              }}
            >
              {formatTime(currentTime)}
            </span>

            {/* Progress Bar (Thin, #F15A8A active fill, #3A3535 inactive track) */}
            <div
              onClick={handleProgressClick}
              style={{
                height: '4px',
                backgroundColor: '#3A3535',
                borderRadius: '9999px',
                flex: 1,
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              title="Seek progress"
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${progressPercent}%`,
                  backgroundColor: '#F15A8A',
                  borderRadius: '9999px',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>

          {/* Right Section: Control Icons (CC, Volume, Settings, Fullscreen) + Academy Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Volume Button */}
            <ControlIconButton
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute' : 'Mute'}
              active={!isMuted}
            >
              {isMuted ? (
                <VolumeMuteIconSvg size={18} color="#A0A0A0" />
              ) : (
                <VolumeIconSvg size={18} color="#A0A0A0" />
              )}
            </ControlIconButton>

            {/* Captions Button */}
            <ControlIconButton
              onClick={() => setShowCaptions(!showCaptions)}
              title={showCaptions ? 'Captions On' : 'Captions Off'}
              active={showCaptions}
            >
              <CaptionsIconSvg size={18} color={showCaptions ? '#F15A8A' : '#A0A0A0'} />
            </ControlIconButton>

            {/* Settings (Gear) Button */}
            <ControlIconButton
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              title="Settings"
            >
              <SettingsIconSvg size={18} color="#A0A0A0" />
            </ControlIconButton>

            {/* Fullscreen Button */}
            <ControlIconButton
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <ExitFullscreenIconSvg size={18} color="#A0A0A0" />
              ) : (
                <FullscreenIconSvg size={18} color="#A0A0A0" />
              )}
            </ControlIconButton>

            {/* Academy Wordmark Logo on the Right */}
            <div style={{ marginLeft: '8px' }}>
              <AcademyLogoSvg height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
