import React from 'react';
import { Activity, AlertOctagon, ShieldCheck, MoreHorizontal } from 'lucide-react';

interface MobileNavBarProps {
  activeNav: string;
  onSelectNav: (nav: any) => void;
  quarantineCount?: number;
  alertCount?: number;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeNav,
  onSelectNav,
  quarantineCount = 0,
  alertCount = 0,
}) => {
  const displayAlertCount = alertCount || quarantineCount;
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#090d18',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 4px',
        zIndex: 100,
      }}
    >
      <button
        onClick={() => onSelectNav('dashboard')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeNav === 'dashboard' ? '#06b6d4' : '#64748b',
          fontSize: '11px',
          fontWeight: 600,
          padding: '4px',
        }}
      >
        <Activity style={{ width: '18px', height: '18px' }} />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectNav('alerts')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeNav === 'alerts' ? '#ef4444' : '#64748b',
          fontSize: '11px',
          fontWeight: 600,
          padding: '4px',
          position: 'relative',
        }}
      >
        <AlertOctagon style={{ width: '18px', height: '18px' }} />
        <span>Alerts</span>
        {displayAlertCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '12px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }}
          />
        )}
      </button>

      <button
        onClick={() => onSelectNav('verify')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeNav === 'verify' ? '#06b6d4' : '#64748b',
          fontSize: '11px',
          fontWeight: 600,
          padding: '4px',
        }}
      >
        <ShieldCheck style={{ width: '18px', height: '18px' }} />
        <span>Verify</span>
      </button>

      <button
        onClick={() => onSelectNav('messages')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: activeNav === 'messages' || activeNav === 'settings' ? '#06b6d4' : '#64748b',
          fontSize: '11px',
          fontWeight: 600,
          padding: '4px',
        }}
      >
        <MoreHorizontal style={{ width: '18px', height: '18px' }} />
        <span>More</span>
      </button>
    </nav>
  );
};
