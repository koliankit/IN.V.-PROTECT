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
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: messagesCount },
    { id: 'alerts', label: 'Alerts', icon: AlertOctagon, badge: quarantineCount, badgeColor: '#ef4444' },
    { id: 'facescan', label: 'Face Scan', icon: Camera },
    { id: 'verify', label: 'Verify', icon: ShieldCheck },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#090d18',
        borderRight: '1px solid #1e293b',
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
      <div style={{ padding: '16px 10px' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#475569',
            padding: '0 12px 10px 12px',
          }}
        >
          Security Hub
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                  padding: '9px 12px 9px 14px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {/* Active Cyan Indicator Line */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '6px',
                      bottom: '6px',
                      width: '3px',
                      borderRadius: '0 3px 3px 0',
                      backgroundColor: '#06b6d4',
                      boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <Icon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: isActive ? '#06b6d4' : '#64748b',
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '10px',
                      backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'rgba(255, 255, 255, 0.08)',
                      color: item.badgeColor || '#94a3b8',
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
      <div style={{ padding: '14px', borderTop: '1px solid #1e293b' }}>
        {/* National Helpline 1930 */}
        <a
          href="tel:1930"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            fontSize: '11px',
            fontWeight: 700,
            marginBottom: '10px',
            textDecoration: 'none',
          }}
          onClick={onEmergencyCall}
          title="National Cyber Financial Fraud Helpline (24x7)"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall style={{ width: '12px', height: '12px' }} />
            Helpline 1930
          </span>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#fca5a5' }}>
            Citizen Cyber Crime
          </span>
        </a>

        {/* Protection Posture Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '11px',
            color: '#94a3b8',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: systemProtected ? '#10b981' : '#f59e0b',
              boxShadow: systemProtected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
            }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '11px' }}>
              {systemProtected ? 'PROTECTION ACTIVE' : 'EVALUATION MODE'}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              Zero-Credentials Rule Enforced
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
