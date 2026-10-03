import React from 'react';
import { ArrowUpRight, PhoneCall } from 'lucide-react';

interface FooterLink {
  label: string;
  href?: string;
  external?: boolean;
}

interface FooterCol {
  title: string;
  links: FooterLink[];
}

export const Footer: React.FC = () => {
  const cols: FooterCol[] = [
    {
      title: 'Product',
      links: [
        { label: 'Overview', href: '#overview' },
        { label: 'Defense Plane', href: '#product-showcase' },
        { label: 'Capabilities', href: '#capabilities' },
        { label: 'Interactive Demo', href: '#interactive-demo' },
        { label: 'Threat Radar', href: '#telemetry' },
        { label: 'Capital Isolation', href: '#portfolio-shield' },
      ],
    },
    {
      title: 'Registries',
      links: [
        { label: 'SEBI Official Gazette', href: 'https://www.sebi.gov.in', external: true },
        { label: 'RBI Master Directions', href: 'https://www.rbi.org.in', external: true },
        { label: 'I4C Cybercrime Portal', href: 'https://cybercrime.gov.in', external: true },
        { label: 'SEBI SCORES Grievance', href: 'https://scores.gov.in', external: true },
      ],
    },
    {
      title: 'Architecture',
      links: [
        { label: 'FIDO2 WebAuthn Passkeys' },
        { label: 'HMAC-SHA256 Token Salts' },
        { label: 'Zero Biometric Storage' },
        { label: 'Air-Gapped ML Classifiers' },
      ],
    },
    {
      title: 'Legal & Privacy',
      links: [
        { label: 'Privacy Manifesto' },
        { label: 'Terms of Defense' },
        { label: 'Regulatory Grounding Protocol' },
        { label: 'Statutory Disclaimers' },
      ],
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#060507',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '96px 0 48px 0',
      }}
    >
      <div className="editorial-container">
        {/* Top — Brand & Columns Grid */}
        <div
          className="footer-editorial-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '2.2fr 1fr 1fr 1fr 1fr',
            gap: '48px',
            marginBottom: '72px',
          }}
        >
          {/* Brand Column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '14px',
              }}
            >
              IN.V.PROTECT
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                lineHeight: 1.68,
                color: 'rgba(255, 255, 255, 0.45)',
                maxWidth: '300px',
                marginBottom: '24px',
              }}
            >
              Digital Fraud &amp; Scam Resilience Engine for Indian Investors. Grounded in statutory SEBI circulars, RBI Master Directions, and I4C national advisories.
            </p>
            <a
              href="tel:1930"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 77, 77, 0.25)',
                backgroundColor: 'rgba(255, 77, 77, 0.06)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FF6B6B',
                letterSpacing: '0.04em',
                textDecoration: 'none',
              }}
            >
              <PhoneCall style={{ width: '13px', height: '13px' }} />
              <span>National Cybercrime Helpline: 1930</span>
            </a>
          </div>

          {/* Link Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.3)',
                  marginBottom: '20px',
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.55)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'color 0.18s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)')}
                      >
                        <span>{link.label}</span>
                        {link.external && <ArrowUpRight style={{ width: '11px', height: '11px', opacity: 0.5 }} />}
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.35)',
                        }}
                      >
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.02em',
            }}
          >
            © 2026 Sangyan AI Investor Shield • Sovereign Investor Resilience Infrastructure.
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.22)',
            }}
          >
            Ground truth anchored in official public gazettes and statutory enforcement directives.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .footer-editorial-layout {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 560px) {
          .footer-editorial-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
