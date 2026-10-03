import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Smartphone, LogOut, ChevronDown, Lock } from 'lucide-react';
import { OwnerProfile } from '../../types/auth';

interface OwnerProfileBadgeProps {
  profile: OwnerProfile;
  onOpenDevices: () => void;
  onOpenSecurityPrivacy: () => void;
  onLogout: () => void;
}

export const OwnerProfileBadge: React.FC<OwnerProfileBadgeProps> = ({
  profile,
  onOpenDevices,
  onOpenSecurityPrivacy,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#0d1322',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '6px 12px',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
        }}>
          <ShieldCheck style={{ width: '18px', height: '18px' }} />
        </div>

        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {profile.full_name}
            {profile.identity_verified && (
              <CheckCircle2 style={{ width: '12px', height: '12px', color: '#e53e3e' }} />
            )}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
            {profile.masked_email}
          </div>
        </div>

        <ChevronDown style={{ width: '14px', height: '14px', color: '#64748b' }} />
      </button>

      {dropdownOpen && (
        <>
          <div
            onClick={() => setDropdownOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
          />

          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '240px',
            backgroundColor: '#0d1322',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            {/* Status overview */}
            <div style={{ padding: '6px 8px 10px 8px', borderBottom: '1px solid #1e293b', fontSize: '11px' }}>
              <div style={{ color: '#64748b', marginBottom: '2px' }}>STATUS:</div>
              <div style={{ color: '#e53e3e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 style={{ width: '12px', height: '12px' }} /> Verified Owner Account
              </div>
            </div>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenDevices();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                background: 'none',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Smartphone style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> Protected Devices
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenSecurityPrivacy();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                background: 'none',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Lock style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> Security & Privacy
            </button>

            <div style={{ borderTop: '1px solid #1e293b', margin: '4px 0' }} />

            <button
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                background: 'none',
                border: 'none',
                color: '#f87171',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <LogOut style={{ width: '14px', height: '14px' }} /> Secure Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
