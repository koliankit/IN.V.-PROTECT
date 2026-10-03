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
  | 'architecture';

interface AppSidebarProps {
  activeNav: string;
  onSelectNav: (nav: any) => void;
  quarantineCount: number;
  messagesCount?: number;
  reviewCount?: number;
  incidentsCount?: number;
  systemProtected?: boolean;
  onEmergencyCall?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeNav,
  onSelectNav,
  quarantineCount,
  messagesCount = 0,
  systemProtected = true,
  onEmergencyCall,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.FC<{ style?: React.CSSProperties }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: messagesCount },
    { id: 'alerts', label: 'Alerts', icon: AlertOctagon, badge: quarantineCount, badgeColor: '#EF4444' },
    { id: 'verify', label: 'Verify', icon: ShieldCheck },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'facescan', label: 'Face Scan', icon: Camera },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#171717',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: 'calc(100vh - 65px)',
        position: 'sticky',
        top: '65px',
        zIndex: 50,
      }}
    >
      {/* Navigation List */}
      <div style={{ padding: '18px 12px' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#A7A7A7',
            padding: '0 12px 12px 12px',
          }}
        >
          Security Hub
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(2, 195, 154, 0.08)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#A7A7A7',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: isActive ? '1px solid rgba(2, 195, 154, 0.20)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#A7A7A7';
                  }
                }}
              >
                {/* Active Teal Indicator Line */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '8px',
                      bottom: '8px',
                      width: '3px',
                      borderRadius: '0 3px 3px 0',
                      backgroundColor: '#02C39A',
                      boxShadow: '0 0 8px rgba(2, 195, 154, 0.8)',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: isActive ? '#02C39A' : '#A7A7A7',
                      flexShrink: 0,
                      transition: 'color 0.15s ease',
                    }}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'rgba(255, 255, 255, 0.08)',
                      color: item.badgeColor || '#A7A7A7',
                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'rgba(255, 255, 255, 0.12)'}`,
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

      {/* Bottom Status & Emergency Helpline Widget */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {/* National Helpline 1930 */}
        <a
          href="tel:1930"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#F87171',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '12px',
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
          }}
          onClick={onEmergencyCall}
          title="National Cyber Financial Fraud Helpline (24x7)"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall style={{ width: '13px', height: '13px' }} />
            Helpline 1930
          </span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#FCA5A5' }}>
            Cyber Crime
          </span>
        </a>

        {/* Protection Posture Pill */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            color: '#A7A7A7',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: systemProtected ? '#02C39A' : '#F59E0B',
              boxShadow: systemProtected ? '0 0 8px #02C39A' : '0 0 8px #F59E0B',
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '11px' }}>
              {systemProtected ? 'SYSTEM PROTECTED' : 'EVALUATION MODE'}
            </div>
            <div style={{ fontSize: '10px', color: '#A7A7A7' }}>
              Zero-Credentials Rule Enforced
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
