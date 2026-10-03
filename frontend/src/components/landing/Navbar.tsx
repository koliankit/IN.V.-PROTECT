import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OwnerProfile } from '../../types/auth';
import { OwnerProfileBadge } from '../auth/OwnerProfileBadge';

interface NavbarProps {
  ownerProfile: OwnerProfile | null;
  onOpenConsole: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout?: () => void;
  onOpenDevices?: () => void;
  onOpenSecurityPrivacy?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  ownerProfile,
  onOpenConsole,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onOpenDevices,
  onOpenSecurityPrivacy,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Defense Plane', href: '#product-showcase' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Live Inspector', href: '#interactive-demo' },
    { label: 'Telemetry', href: '#telemetry' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid transparent',
        transition: 'background-color 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease',
      }}
    >
      <div
        className="editorial-container"
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            IN.V.PROTECT
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'var(--accent)',
              letterSpacing: '0.04em',
              opacity: 0.85,
            }}
          >
            / SANGYAN
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="inv-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 450,
                color: 'rgba(255, 255, 255, 0.55)',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'color 0.18s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="inv-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                className="btn-primary-titanium"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <span>Shield Console</span>
                <ArrowUpRight style={{ width: '13px', height: '13px' }} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenLogin}
                className="btn-secondary-hairline"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Sign In
              </button>
              <button
                onClick={onOpenRegister}
                className="btn-secondary-hairline"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Get Started
              </button>
              <button
                onClick={onOpenConsole}
                className="btn-primary-titanium"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <span>Launch Console</span>
                <ArrowUpRight style={{ width: '13px', height: '13px' }} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inv-mobile-toggle"
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#FFFFFF',
            padding: '6px 8px',
            cursor: 'pointer',
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              overflow: 'hidden',
              backgroundColor: 'rgba(10, 10, 10, 0.98)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.75)',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: 'var(--accent)', fontSize: '13px' }}>↗</span>
                </a>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsole();
                  }}
                  className="btn-primary-titanium"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Launch Shield Console
                </button>
                {!ownerProfile && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="btn-secondary-hairline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .inv-desktop-nav { display: none !important; }
          .inv-mobile-toggle { display: block !important; }
        }
      `}</style>
    </motion.header>
  );
};
