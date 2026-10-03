import React from 'react';

interface SvgIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 1. Academy Stylized Wordmark Logo
export const AcademyLogoSvg: React.FC<{ height?: number; className?: string; style?: React.CSSProperties }> = ({
  height = 24,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`academy-logo-container ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', height: `${height}px`, userSelect: 'none', ...style }}
    >
      <svg
        height={height}
        viewBox="0 0 148 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      >
        {/* Geometric Stylized 'A' with sharp silhouette & transparent triangle cutout */}
        <path
          d="M12 2L22 22H17.2L15.1 17.5H8.9L6.8 22H2L12 2ZM12 8.5L10 13.8H14L12 8.5Z"
          fill="#FFFFFF"
          fillRule="evenodd"
        />
        {/* Modern Geometric Sans 'cademy' */}
        <text
          x="28"
          y="18.5"
          fill="#FFFFFF"
          fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          cademy
        </text>
      </svg>
    </div>
  );
};

// 2. Play Icon (Inline SVG)
export const PlayIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <path d="M8 5.14V19.14L19 12.14L8 5.14Z" />
  </svg>
);

// 3. Pause Icon (Inline SVG)
export const PauseIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" />
  </svg>
);

// 4. Captions (CC) Icon (Inline SVG)
export const CaptionsIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <rect x="2" y="4" width="20" height="16" rx="4" />
    <path d="M10 9.5C9.5 9 8.5 9 7.5 9.5C6.5 10 6 11 6 12C6 13 6.5 14 7.5 14.5C8.5 15 9.5 15 10 14.5" />
    <path d="M18 9.5C17.5 9 16.5 9 15.5 9.5C14.5 10 14 11 14 12C14 13 14.5 14 15.5 14.5C16.5 15 17.5 15 18 14.5" />
  </svg>
);

// 5. Volume Icon (Inline SVG)
export const VolumeIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

// 6. Volume Mute Icon (Inline SVG)
export const VolumeMuteIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

// 7. Settings (Gear) Icon (Inline SVG)
export const SettingsIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// 8. Fullscreen Icon (Inline SVG)
export const FullscreenIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

// 9. Exit Fullscreen Icon (Inline SVG)
export const ExitFullscreenIconSvg: React.FC<SvgIconProps> = ({ size = 20, color = '#FFFFFF', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color, display: 'block', ...style }}
  >
    <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6 7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6 7-7" />
  </svg>
);

// 10. Phone / Arrow Icon for Stat Card (64px × 64px, black stroke, ~2.5px stroke width)
export const PhoneArrowIconSvg: React.FC<{ size?: number; strokeWidth?: number; className?: string }> = ({
  size = 64,
  strokeWidth = 2.5,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="#000000"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Outbound Arrow Upper Right */}
      <line x1="38" y1="12" x2="52" y2="12" />
      <polyline points="42 22 52 12 42 2" />
      <line x1="34" y1="30" x2="52" y2="12" />

      {/* Phone Receiver Silhouette */}
      <path d="M37 34C35 37.5 31.5 41 28 43L23 38C22.2 37.2 21 37 20 37.5C18 38.5 15.5 39 13 39C11.9 39 11 39.9 11 41V48.5C11 49.6 11.9 50.5 13 50.5C33.5 50.5 50 34 50 13.5C50 12.4 49.1 11.5 48 11.5H40.5C39.4 11.5 38.5 12.4 38.5 13.5C38.5 16 38 18.5 37 20.5C36.5 21.5 36.7 22.7 37.5 23.5L40 26" />
    </svg>
  );
};
