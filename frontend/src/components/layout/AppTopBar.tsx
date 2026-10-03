import React, { useState } from 'react';
import { Shield, ArrowUpRight, Globe, PhoneCall, PlayCircle, Watch, Search, Sliders, Video, ChevronDown } from 'lucide-react';
import { OwnerProfile } from '../../types/auth';
import { OwnerProfileBadge } from '../auth/OwnerProfileBadge';

interface AppTopBarProps {
  // Mode
  mode: 'landing' | 'console' | 'auth';

  // Auth state
  ownerProfile: OwnerProfile | null;

  // Landing actions
  onOpenConsole?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
  onOpenDevices?: () => void;
  onOpenSecurityPrivacy?: () => void;

  // Console actions
  onOpenLanding?: () => void;
  onOpenDemoFlow?: () => void;
  onOpenWatchAlert?: () => void;
  onOpenVerify?: () => void;
  onOpenAcademy?: () => void;
  onOpenSetup?: () => void;

  // Language (console)
  language?: 'en' | 'hi' | 'hinglish';
  onSetLanguage?: (lang: 'en' | 'hi' | 'hinglish') => void;

  // System status (console)
  systemProtected?: boolean;
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  mode,
  ownerProfile,
  onOpenConsole,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onOpenDevices,
  onOpenSecurityPrivacy,
  onOpenLanding,
  onOpenDemoFlow,
  onOpenWatchAlert,
  onOpenVerify,
  onOpenAcademy,
  onOpenSetup,
  language = 'en',
  onSetLanguage,
  systemProtected = true,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        backgroundColor: 'rgba(10, 10, 10, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 999,
      }}
    >
      {/* ── LEFT: Logo ── */}
      <div
        onClick={onOpenLanding}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          cursor: onOpenLanding ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shield style={{ width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          IN.V.PROTECT
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 500,
            color: 'var(--accent)',
            letterSpacing: '0.04em',
            opacity: 0.8,
          }}
        >
          SANGYAN
        </span>

        {/* Console mode: "Console" label pill */}
        {mode === 'console' && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              padding: '2px 7px',
              borderRadius: '4px',
              marginLeft: '4px',
            }}
          >
            Console
          </span>
        )}
      </div>

      {/* ── RIGHT: Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* ── LANDING mode ── */}
        {mode === 'landing' && (
          <>
            {ownerProfile ? (
              <>
                {onLogout && onOpenDevices && onOpenSecurityPrivacy && (
                  <OwnerProfileBadge
                    profile={ownerProfile}
                    onLogout={onLogout}
                    onOpenDevices={onOpenDevices}
                    onOpenSecurityPrivacy={onOpenSecurityPrivacy}
                  />
                )}
                <button
                  onClick={onOpenConsole}
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                >
                  <span>Shield Console</span>
                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="btn-ghost"
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                >
                  Log in
                </button>
                <button
                  onClick={onOpenConsole}
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                >
                  <span>Get a demo</span>
                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                </button>
              </>
            )}
          </>
        )}

        {/* ── CONSOLE mode ── */}
        {mode === 'console' && (
          <>
            {/* Status dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: systemProtected ? 'var(--color-trusted)' : 'var(--color-review)',
                  boxShadow: systemProtected ? '0 0 6px var(--color-trusted)' : '0 0 6px var(--color-review)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: systemProtected ? 'var(--color-trusted)' : 'var(--color-review)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {systemProtected ? 'Protected' : 'Evaluation'}
              </span>
            </div>

            {/* Language toggle — compact */}
            {onSetLanguage && (
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  padding: '2px',
                }}
              >
                {(['en', 'hi', 'hinglish'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onSetLanguage(lang)}
                    style={{
                      backgroundColor: language === lang ? 'rgba(255,255,255,0.10)' : 'transparent',
                      color: language === lang ? 'var(--text-primary)' : 'var(--text-muted)',
                      border: 'none',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'HG'}
                  </button>
                ))}
              </div>
            )}

            {/* Helpline */}
            <a
              href="tel:1930"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--color-risk)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                textDecoration: 'none',
                backgroundColor: 'var(--color-risk-bg)',
                border: '1px solid var(--color-risk-border)',
                padding: '5px 10px',
                borderRadius: '6px',
                transition: 'all 0.15s ease',
              }}
              title="National Cyber Crime Helpline"
            >
              <PhoneCall style={{ width: '11px', height: '11px' }} />
              1930
            </a>

            {/* "More" dropdown for secondary actions */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="btn-ghost"
                style={{ padding: '5px 10px', fontSize: '12px', gap: '4px' }}
              >
                Tools
                <ChevronDown style={{ width: '12px', height: '12px' }} />
              </button>

              {moreOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                    onClick={() => setMoreOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '6px',
                      minWidth: '180px',
                      zIndex: 100,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {[
                      { icon: PlayCircle, label: '9-Step Threat Demo', onClick: onOpenDemoFlow, color: 'var(--color-review)' },
                      { icon: Watch, label: 'Watch Alert HUD', onClick: onOpenWatchAlert },
                      { icon: Search, label: 'Verify SEBI ID', onClick: onOpenVerify },
                      { icon: Video, label: 'Academy (16:9)', onClick: onOpenAcademy, color: 'var(--accent)' },
                      { icon: Sliders, label: 'Setup Wizard', onClick: onOpenSetup },
                    ].map(({ icon: Icon, label, onClick, color }) => (
                      <button
                        key={label}
                        onClick={() => { onClick?.(); setMoreOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: color || 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'background 0.12s ease, color 0.12s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = color || 'var(--text-secondary)';
                        }}
                      >
                        <Icon style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Owner Badge */}
            {ownerProfile && onLogout && onOpenDevices && onOpenSecurityPrivacy && (
              <OwnerProfileBadge
                profile={ownerProfile}
                onLogout={onLogout}
                onOpenDevices={onOpenDevices}
                onOpenSecurityPrivacy={onOpenSecurityPrivacy}
              />
            )}

            {/* Back to site */}
            {onOpenLanding && (
              <button
                onClick={onOpenLanding}
                className="btn-ghost"
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                <Globe style={{ width: '12px', height: '12px' }} />
                Site
              </button>
            )}
          </>
        )}

        {/* ── AUTH mode ── */}
        {mode === 'auth' && (
          <>
            <button
              onClick={onOpenLogin}
              className="btn-ghost"
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              Log in
            </button>
            <button
              onClick={onOpenRegister}
              className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
};
