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
  FileSearch,
  Wifi,
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
    { id: 'analyze', label: 'Analyze', icon: FileSearch },
    { id: 'verify', label: 'Verification', icon: ShieldCheck },
    { id: 'alerts', label: 'Alerts', icon: AlertOctagon, badge: quarantineCount, badgeColor: '#FF3B3B' },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: messagesCount },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'integrations', label: 'Integrations', icon: Wifi },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'facescan', label: 'Face Scan', icon: Camera },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#0D0D0D',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
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
      <div style={{ padding: '20px 12px' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#6F7A86',
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
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#AEB7C2',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)' : 'none',
                  transition: 'all 0.18s ease',
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
                    e.currentTarget.style.color = '#AEB7C2';
                  }
                }}
              >
                {/* Active Indicator Accent */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '8px',
                      bottom: '8px',
                      width: '3px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#20D98A',
                      boxShadow: '0 0 10px #20D98A',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: isActive ? '#FFFFFF' : '#AEB7C2',
                      flexShrink: 0,
                      transition: 'color 0.18s ease',
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
                      color: item.badgeColor || '#AEB7C2',
                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}55` : 'rgba(255, 255, 255, 0.14)'}`,
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
            backgroundColor: 'rgba(255, 59, 59, 0.08)',
            border: '1px solid rgba(255, 59, 59, 0.28)',
            color: '#FF5252',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '12px',
            textDecoration: 'none',
            transition: 'all 0.18s ease',
          }}
          onClick={onEmergencyCall}
          title="National Cyber Financial Fraud Helpline (24x7)"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall style={{ width: '13px', height: '13px' }} />
            Helpline 1930
          </span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#FF7B7B' }}>
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
            borderRadius: '12px',
            fontSize: '11px',
            color: '#AEB7C2',
            backgroundColor: 'rgba(255, 255, 255, 0.035)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: systemProtected ? '#20D98A' : '#FFB020',
              boxShadow: systemProtected ? '0 0 10px #20D98A' : '0 0 10px #FFB020',
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '11px' }}>
              {systemProtected ? 'SYSTEM PROTECTED' : 'EVALUATION MODE'}
            </div>
            <div style={{ fontSize: '10px', color: '#6F7A86' }}>
              Zero-Credentials Rule Enforced
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
