import React from 'react';
import { Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#08080B',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '80px 24px 48px 24px',
        color: '#8E8E93',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '48px',
            marginBottom: '64px',
          }}
          className="footer-grid"
        >
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#121318',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield style={{ width: '15px', height: '15px', color: '#38BDF8' }} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                SANGYAN AI
              </span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#8E8E93', maxWidth: '320px', marginBottom: '24px' }}>
              Digital Fraud & Scam Resilience Engine for Indian Investors. Grounded in statutory SEBI circulars, RBI Master Directions, and I4C national advisories.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: '11px',
                fontWeight: 600,
                color: '#EF4444',
              }}
            >
              <span>National Cybercrime Helpline: 1930</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li><a href="#overview" style={{ color: '#8E8E93' }}>Overview</a></li>
              <li><a href="#capabilities" style={{ color: '#8E8E93' }}>Capabilities</a></li>
              <li><a href="#interactive-demo" style={{ color: '#8E8E93' }}>Interactive Demo</a></li>
              <li><a href="#telemetry" style={{ color: '#8E8E93' }}>Threat Radar</a></li>
              <li><a href="#portfolio-shield" style={{ color: '#8E8E93' }}>Capital Isolation</a></li>
            </ul>
          </div>

          {/* Col 3: Regulatory Registries */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Registries
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li>
                <a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer" style={{ color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>SEBI Official</span>
                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                </a>
              </li>
              <li>
                <a href="https://www.rbi.org.in" target="_blank" rel="noreferrer" style={{ color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>RBI Registry</span>
                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={{ color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>I4C Portal</span>
                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                </a>
              </li>
              <li>
                <a href="https://scores.gov.in" target="_blank" rel="noreferrer" style={{ color: '#8E8E93', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>SEBI SCORES</span>
                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Architecture */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Architecture
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li><span style={{ color: '#8E8E93' }}>FIDO2 WebAuthn</span></li>
              <li><span style={{ color: '#8E8E93' }}>HMAC Salted OTP</span></li>
              <li><span style={{ color: '#8E8E93' }}>Zero Biometric Storage</span></li>
              <li><span style={{ color: '#8E8E93' }}>Air-Gapped Models</span></li>
            </ul>
          </div>

          {/* Col 5: Legal & Ethics */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li><span style={{ color: '#8E8E93' }}>Privacy Manifesto</span></li>
              <li><span style={{ color: '#8E8E93' }}>Terms of Defense</span></li>
              <li><span style={{ color: '#8E8E93' }}>Regulatory Grounding</span></li>
              <li><span style={{ color: '#8E8E93' }}>Disclaimers</span></li>
            </ul>
          </div>
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
            fontSize: '12px',
            color: '#64748B',
          }}
        >
          <div>
            © 2026 Sangyan AI Investor Shield. Sovereign investor resilience infrastructure.
          </div>
          <div>
            Ground truth anchored in official public gazettes and statutory enforcement directives.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 500px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};
