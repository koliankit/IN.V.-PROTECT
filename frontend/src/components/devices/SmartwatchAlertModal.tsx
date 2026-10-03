import React from 'react';
import { X, AlertOctagon } from 'lucide-react';

interface SmartwatchAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertText?: string;
  alertData?: any;
  onViewDetails?: () => void;
}

export const SmartwatchAlertModal: React.FC<SmartwatchAlertModalProps> = ({
  isOpen,
  onClose,
  alertText = 'Demat blocked. Send OTP immediately.',
  alertData,
  onViewDetails,
}) => {
  if (!isOpen) return null;

  const displayMessage = alertData?.message || alertData?.text || alertData?.headline || alertText;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-36px',
            right: '0px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Physical Smartwatch Chassis */}
        <div
          style={{
            width: '240px',
            height: '280px',
            borderRadius: '48px',
            backgroundColor: '#0a0d14',
            border: '8px solid #1e293b',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(0, 0, 0, 0.8)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Haptic Alert Pulse Ring */}
          <div
            className="haptic-ring"
            style={{
              width: '90px',
              height: '90px',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              top: '46px',
            }}
          />

          {/* Watch Top Bar */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', color: '#64748b' }}>
              IN V PROTECT
            </div>
            <div style={{ fontSize: '9px', color: '#475569' }}>
              WEAR COMPANION
            </div>
          </div>

          {/* Center Alert Icon & Risk State */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
              }}
            >
              <AlertOctagon style={{ width: '22px', height: '22px', color: '#ef4444' }} />
            </div>

            <div style={{ fontSize: '14px', fontWeight: 900, color: '#ef4444', letterSpacing: '0.04em' }}>
              HIGH RISK
            </div>

            <div
              style={{
                fontSize: '11px',
                color: '#cbd5e1',
                marginTop: '4px',
                lineHeight: 1.3,
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayMessage}
            </div>
          </div>

          {/* Bottom Action Pill */}
          <button
            onClick={() => {
              if (onViewDetails) onViewDetails();
              onClose();
            }}
            style={{
              width: '100%',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '12px',
              padding: '8px',
              borderRadius: '20px',
              letterSpacing: '0.04em',
            }}
          >
            VIEW
          </button>
        </div>

        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
          Simulated Bluetooth LE Smartwatch Threat Interception
        </div>
      </div>
    </div>
  );
};
