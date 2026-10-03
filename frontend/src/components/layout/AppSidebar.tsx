import React from 'react';
import {
  Activity,
  Inbox,
  AlertOctagon,
  ShieldCheck,
  Database,
  Smartphone,
  TrendingUp,
  Settings,
  PhoneCall,
  Camera,
  Video,
  Globe,
} from 'lucide-react';

export type NavSection =
  | 'dashboard'
  | 'messages'
  | 'alerts'
  | 'facescan'
  | 'verify'
  | 'evidence'
  | 'devices'
  | 'reports'
  | 'settings'
  | 'analyze'
  | 'quarantine'
  | 'integrations'
  | 'incidents'
  | 'privacy'
  | 'architecture'
  | 'academy';

interface AppSidebarProps {
  activeNav: string;
  onSelectNav: (nav: any) => void;
  quarantineCount: number;
  messagesCount?: number;
  reviewCount?: number;
  incidentsCount?: number;
  systemProtected?: boolean;
  onEmergencyCall?: () => void;
  onOpenLanding?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeNav,
  onSelectNav,
  quarantineCount,
  messagesCount = 0,
  systemProtected = true,
  onEmergencyCall,
  onOpenLanding,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.FC<{ style?: React.CSSProperties }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: messagesCount },
    { id: 'alerts', label: 'Alerts', icon: AlertOctagon, badge: quarantineCount, badgeColor: 'var(--color-risk)' },
    { id: 'verify', label: 'Verify', icon: ShieldCheck },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'facescan', label: 'Face Scan', icon: Camera },
    { id: 'academy', label: 'Academy', icon: Video },
  ];

  return (
    <aside
      style={{
        width: '220px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: 'calc(100vh - 56px)',
        position: 'sticky',
        top: '56px',
        zIndex: 50,
      }}
    >
      {/* Navigation List */}
      <div style={{ padding: '16px 12px', overflowY: 'auto', flex: 1 }}>
        {/* Section label */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 8px 10px 8px',
          marginBottom: '4px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--text-faint)',
          }}>
            Security Hub
          </span>
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              title="Return to Website"
            >
              <Globe style={{ width: '11px', height: '11px' }} />
              Site
            </button>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '8px' }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNav(item.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {/* Active Indicator — thin red line left edge */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '20%',
                      bottom: '20%',
                      width: '2px',
                      borderRadius: '0 2px 2px 0',
                      backgroundColor: 'var(--accent)',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon
                    style={{
                      width: '15px',
                      height: '15px',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                      transition: 'color 0.15s ease',
                    }}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                      backgroundColor: item.badgeColor
                        ? `${item.badgeColor}18`
                        : 'rgba(255, 255, 255, 0.06)',
                      color: item.badgeColor || 'var(--text-muted)',
                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'var(--border)'}`,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Emergency Helpline */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* National Helpline 1930 */}
        <a
          href="tel:1930"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-risk-bg)',
            border: '1px solid var(--color-risk-border)',
            color: 'var(--color-risk)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '8px',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
          onClick={onEmergencyCall}
          title="National Cyber Financial Fraud Helpline (24x7)"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <PhoneCall style={{ width: '12px', height: '12px' }} />
            1930
          </span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.7 }}>
            Cyber Crime
          </span>
        </a>

        {/* Protection Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: systemProtected ? 'var(--color-trusted)' : 'var(--color-review)',
              boxShadow: systemProtected ? '0 0 8px var(--color-trusted)' : '0 0 8px var(--color-review)',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              {systemProtected ? 'PROTECTED' : 'EVALUATION'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px' }}>
              Zero-Credentials Active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
