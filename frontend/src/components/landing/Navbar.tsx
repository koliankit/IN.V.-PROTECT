import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Lock } from 'lucide-react';
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Interactive Demo', href: '#interactive-demo' },
    { label: 'Telemetry', href: '#telemetry' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(8, 8, 11, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              height: '32px',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.15)',
            }}
          >
            <img
              src="/logo.png"
              alt="SecurityDoor Solutions Logo"
              style={{
                height: '20px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              IN V PROTECT
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#8E8E93',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              SANGYAN • INVESTOR SECURITY
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA / Auth Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          {ownerProfile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                style={{
                  backgroundColor: '#38BDF8',
                  color: '#08080B',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284C7';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#38BDF8';
                  e.currentTarget.style.color = '#08080B';
                }}
              >
                <span>Shield Console</span>
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={onOpenLogin}
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <Lock style={{ width: '13px', height: '13px', color: '#8E8E93' }} />
                <span>Sign In</span>
              </button>
              <button
                onClick={onOpenRegister}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#08080B',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <span>Get Started</span>
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            padding: '6px',
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
        </button>
      </div>

      {/* Mobile Slide-down Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              backgroundColor: '#0A0A0D',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  padding: '8px 0',
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsole();
                }}
                style={{
                  backgroundColor: '#38BDF8',
                  color: '#08080B',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >
                Launch Shield Console
              </button>
              {!ownerProfile && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    fontSize: '14px',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </motion.header>
  );
};
