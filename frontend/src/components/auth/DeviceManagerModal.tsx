import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone, Watch, Trash2, X, QrCode } from 'lucide-react';
import { DeviceRecord, PairingSessionResponse } from '../../types/auth';

interface DeviceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshDevices?: () => void;
}

export const DeviceManagerModal: React.FC<DeviceManagerModalProps> = ({
  isOpen,
  onClose,
  onRefreshDevices,
}) => {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [pairingSession, setPairingSession] = useState<PairingSessionResponse | null>(null);
  const [pairingTimer, setPairingTimer] = useState<number>(300);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDevices();
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (pairingSession && pairingTimer > 0) {
      interval = setInterval(() => setPairingTimer((t) => t - 1), 1000);
    } else if (pairingTimer === 0) {
      setPairingSession(null);
    }
    return () => clearInterval(interval);
  }, [pairingSession, pairingTimer]);

  const fetchDevices = async () => {
    try {
      const resp = await fetch('/api/devices/my-devices');
      if (resp.ok) {
        const data = await resp.json();
        setDevices(data);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleCreatePairing = async (deviceType: 'MOBILE' | 'DESKTOP' | 'SMARTWATCH') => {
    setPairingError(null);
    setActionSuccess(null);
    try {
      const resp = await fetch('/api/devices/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_type: deviceType, device_name: `${deviceType} Companion` }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Failed to generate pairing session.');
      setPairingSession(data);
      setPairingTimer(data.expires_in_seconds || 300);
    } catch (err: any) {
      setPairingError(err.message || 'Pairing request failed.');
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to revoke this device? Its active sessions will be terminated.')) return;
    try {
      const resp = await fetch('/api/devices/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id: deviceId }),
      });
      if (resp.ok) {
        setActionSuccess(`Device ${deviceId} revoked.`);
        fetchDevices();
        if (onRefreshDevices) onRefreshDevices();
      }
    } catch (e) {
      // Ignore
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(pairingTimer / 60);
  const seconds = pairingTimer % 60;
  const formattedTimer = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        maxWidth: '640px',
        width: '100%',
        backgroundColor: '#0d1322',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '28px',
        color: '#f8fafc',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '0.04em' }}>
              YOUR PROTECTED DEVICES
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Multi-point device identity management with zero secret persistence
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {actionSuccess && (
          <div style={{ backgroundColor: 'rgba(229, 62, 62, 0.15)', border: '1px solid #e53e3e', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#ff7878' }}>
            {actionSuccess}
          </div>
        )}

        {pairingError && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#fca5a5' }}>
            {pairingError}
          </div>
        )}

        {/* Pairing Active Screen */}
        {pairingSession ? (
          <div style={{ backgroundColor: '#080d1a', border: '1px solid #38bdf8', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ display: 'inline-flex', padding: '10px', backgroundColor: '#111827', borderRadius: '12px', marginBottom: '12px' }}>
              <QrCode style={{ width: '48px', height: '48px', color: '#38bdf8' }} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>
              Device Pairing Session Active
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
              Scan the QR code or enter this pairing code on your mobile companion:
            </p>

            <div style={{
              display: 'inline-block',
              backgroundColor: '#1e293b',
              border: '2px solid #38bdf8',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '24px',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '4px',
              color: '#38bdf8',
              marginBottom: '14px',
            }}>
              {pairingSession.pairing_code}
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Code expires in: <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{formattedTimer}</strong>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setPairingSession(null)}
                style={{ background: 'none', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
              >
                Close Pairing Session
              </button>
            </div>
          </div>
        ) : (
          /* Add Device Action Buttons */
          <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
            <button
              onClick={() => handleCreatePairing('MOBILE')}
              style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Smartphone style={{ width: '15px', height: '15px', color: '#38bdf8' }} /> ADD MOBILE
            </button>
            <button
              onClick={() => handleCreatePairing('DESKTOP')}
              style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Laptop style={{ width: '15px', height: '15px', color: '#38bdf8' }} /> ADD COMPUTER
            </button>
            <button
              onClick={() => handleCreatePairing('SMARTWATCH')}
              style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Watch style={{ width: '15px', height: '15px', color: '#38bdf8' }} /> ADD WATCH
            </button>
          </div>
        )}

        {/* Registered Devices List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {devices.map((dev) => {
            const isDesktop = dev.device_type === 'DESKTOP';
            const isMobile = dev.device_type === 'MOBILE';
            const Icon = isDesktop ? Laptop : isMobile ? Smartphone : Watch;
            const isRevoked = dev.status === 'REVOKED';

            return (
              <div
                key={dev.device_id}
                style={{
                  backgroundColor: '#080d1a',
                  border: isRevoked ? '1px solid #334155' : '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: isRevoked ? 0.5 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <Icon style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                      {dev.device_name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      ID: {dev.device_id} • Platform: {dev.platform}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: isRevoked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(229, 62, 62, 0.15)',
                    color: isRevoked ? '#ef4444' : '#e53e3e',
                  }}>
                    {dev.status}
                  </span>

                  {!isRevoked && (
                    <button
                      onClick={() => handleRevokeDevice(dev.device_id)}
                      title="Revoke device"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
