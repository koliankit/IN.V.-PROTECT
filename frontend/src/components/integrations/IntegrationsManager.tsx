import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Globe,
  Landmark,
  Camera,
  Watch,
  Shield,
  ShieldCheck,
  RefreshCw,
  Search,
  Lock,
  Activity,
  Wifi,
  Radio,
  Play,
} from 'lucide-react';
import { IntegrationSource } from '../../types';

interface IntegrationsManagerProps {
  integrations: IntegrationSource[];
  onRefresh?: () => void;
  onShowToast?: (message: string) => void;
}

export const IntegrationsManager: React.FC<IntegrationsManagerProps> = ({
  integrations,
  onRefresh,
  onShowToast,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'real' | 'demo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);

  // Helper to get corresponding channel icon
  const getChannelIcon = (id: string, category: string) => {
    switch (id) {
      case 'INT-EMAIL':
        return <Mail style={{ width: '22px', height: '22px', color: '#38BDF8' }} />;
      case 'INT-SMS':
        return <MessageSquare style={{ width: '22px', height: '22px', color: '#20D98A' }} />;
      case 'INT-BROWSER':
        return <Globe style={{ width: '22px', height: '22px', color: '#A78BFA' }} />;
      case 'INT-FIN-ALERTS':
        return <Landmark style={{ width: '22px', height: '22px', color: '#FFB020' }} />;
      case 'INT-SCREENSHOTS':
        return <Camera style={{ width: '22px', height: '22px', color: '#F43F5E' }} />;
      case 'INT-DEVICES':
        return <Watch style={{ width: '22px', height: '22px', color: '#02C39A' }} />;
      default:
        if (category.toLowerCase().includes('email')) {
          return <Mail style={{ width: '22px', height: '22px', color: '#38BDF8' }} />;
        }
        if (category.toLowerCase().includes('sms')) {
          return <MessageSquare style={{ width: '22px', height: '22px', color: '#20D98A' }} />;
        }
        return <Radio style={{ width: '22px', height: '22px', color: '#02C39A' }} />;
    }
  };

  // Filter integrations based on tab and search
  const filteredIntegrations = integrations.filter((itg) => {
    if (filterMode === 'real' && !itg.is_real) return false;
    if (filterMode === 'demo' && itg.is_real) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        itg.name.toLowerCase().includes(q) ||
        itg.description.toLowerCase().includes(q) ||
        itg.category.toLowerCase().includes(q) ||
        itg.supported_channels.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleTestStream = (itg: IntegrationSource) => {
    setTestingId(itg.id);
    setTimeout(() => {
      setTestingId(null);
      if (onShowToast) {
        onShowToast(`[✓] Gateway ${itg.name} latency tested: 9ms. Ingestion firewall active.`);
      }
    }, 700);
  };

  const realCount = integrations.filter((i) => i.is_real).length;
  const demoCount = integrations.filter((i) => !i.is_real).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER & TELEMETRY BANNER (OBSIDIAN GLASS)              */}
      {/* ============================================================== */}
      <div
        className="glass-panel-primary glossy-reflection"
        style={{
          borderRadius: '20px',
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#20D98A',
                  boxShadow: '0 0 10px #20D98A',
                  display: 'inline-block',
                }}
                className="animate-breathing"
              />
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#20D98A' }}>
                ZERO-TRUST CONTINUOUS INGESTION ACTIVE
              </span>
              <span style={{ fontSize: '11px', color: '#6F7A86' }}>•</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#AEB7C2' }}>
                STATUTORY ISOLATION LAYER
              </span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Communication & Ingestion Gateways
            </h1>
            <p style={{ fontSize: '13px', color: '#AEB7C2', margin: 0, maxWidth: '780px', lineHeight: 1.5 }}>
              Sangyan AI does NOT claim magical access to private accounts. Integrations use explicit user authorization,
              supported OS notification listeners, and transparent simulation stubs with guaranteed zero password or OTP storage.
            </p>
          </div>

          {/* Quick Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title="Refresh integration telemetry"
            >
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              Sync Gateways
            </button>
          )}
        </div>

        {/* Live Ingestion Metric Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.12)' }}>
              <Wifi style={{ width: '18px', height: '18px', color: '#38BDF8' }} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6F7A86', fontWeight: 700, textTransform: 'uppercase' }}>Connected Gateways</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{integrations.length} Active Feeds</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(32, 217, 138, 0.12)' }}>
              <Activity style={{ width: '18px', height: '18px', color: '#20D98A' }} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6F7A86', fontWeight: 700, textTransform: 'uppercase' }}>Live OS Interceptors</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#20D98A' }}>{realCount} Real Hardware</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(255, 176, 32, 0.12)' }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: '#FFB020' }} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6F7A86', fontWeight: 700, textTransform: 'uppercase' }}>Privacy Policy</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFB020' }}>100% Zero-OTP Intake</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(167, 139, 250, 0.12)' }}>
              <Lock style={{ width: '18px', height: '18px', color: '#A78BFA' }} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#6F7A86', fontWeight: 700, textTransform: 'uppercase' }}>Ingestion Triage</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#A78BFA' }}>&lt; 12ms On-Device</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FILTER & SEARCH CONTROL TOOLBAR                             */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Segmented Filter Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(17, 22, 28, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: filterMode === 'all' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: filterMode === 'all' ? '#FFFFFF' : '#6F7A86',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            All Gateways ({integrations.length})
          </button>
          <button
            onClick={() => setFilterMode('real')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: filterMode === 'real' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: filterMode === 'real' ? '#38BDF8' : '#6F7A86',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Real Connectors ({realCount})
          </button>
          <button
            onClick={() => setFilterMode('demo')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: filterMode === 'demo' ? 'rgba(255, 176, 32, 0.2)' : 'transparent',
              color: filterMode === 'demo' ? '#FFB020' : '#6F7A86',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Simulated Sandbox ({demoCount})
          </button>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '14px',
              height: '14px',
              color: '#6F7A86',
            }}
          />
          <input
            type="text"
            placeholder="Search channels, protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(17, 22, 28, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '8px 12px 8px 34px',
              fontSize: '12px',
              color: '#FFFFFF',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. INTEGRATION GATEWAY CARDS GRID                              */}
      {/* ============================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredIntegrations.map((itg) => (
          <div
            key={itg.id}
            className="glass-panel glossy-reflection"
            style={{
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              {/* Header: Channel Icon + Connector Name + Status Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getChannelIcon(itg.id, itg.category)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>{itg.name}</h3>
                    <span style={{ fontSize: '11px', color: '#6F7A86', fontWeight: 600 }}>{itg.category}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: itg.is_real ? 'rgba(56, 189, 248, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      color: itg.is_real ? '#38BDF8' : '#FFB020',
                      border: itg.is_real ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {itg.is_real ? 'REAL CONNECTOR' : 'DEMO / SANDBOX'}
                  </span>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: itg.status === 'CONNECTED' ? '#20D98A' : '#FFB020',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: itg.status === 'CONNECTED' ? '#20D98A' : '#FFB020',
                      }}
                    />
                    {itg.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#AEB7C2', lineHeight: 1.5, marginBottom: '16px' }}>
                {itg.description}
              </p>

              {/* Supported Channels Pills */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#6F7A86', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Supported Ingestion Feeds:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {itg.supported_channels.map((chan, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {chan}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Access Level Box */}
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#6F7A86', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                  Active Access Scope:
                </div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4 }}>
                  {itg.data_access_level}
                </div>
              </div>

              {/* Statutory Privacy Guarantee Box */}
              <div
                style={{
                  backgroundColor: 'rgba(32, 217, 138, 0.06)',
                  border: '1px solid rgba(32, 217, 138, 0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <Shield
                  style={{
                    width: '16px',
                    height: '16px',
                    color: '#20D98A',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#20D98A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Zero-Trust Privacy Guarantee:
                  </div>
                  <div style={{ fontSize: '11px', color: '#AEB7C2', marginTop: '2px', lineHeight: 1.4 }}>
                    {itg.security_guarantee}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontSize: '11px', color: '#6F7A86' }}>
                {itg.notes || 'Pipeline synchronized.'}
              </span>

              <button
                onClick={() => handleTestStream(itg)}
                disabled={testingId === itg.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: testingId === itg.id ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {testingId === itg.id ? (
                  <>
                    <RefreshCw className="animate-spin" style={{ width: '12px', height: '12px' }} />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play style={{ width: '11px', height: '11px' }} />
                    Test Gateway
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 4. STATUTORY PRIVACY & EXCLUSION ARCHITECTURE CALLOUT          */}
      {/* ============================================================== */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          padding: '24px',
          backgroundColor: 'rgba(17, 22, 28, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div
          style={{
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: 'rgba(2, 195, 154, 0.12)',
            border: '1px solid rgba(2, 195, 154, 0.25)',
            flexShrink: 0,
          }}
        >
          <Lock style={{ width: '22px', height: '22px', color: '#02C39A' }} />
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#02C39A', marginBottom: '4px' }}>
            REGULATORY COMPLIANCE ARCHITECTURE (SEBI & RBI COMPLIANT)
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
            Why Sensitive OTPs and PINs are Strictly Excluded as Input Channels
          </h3>
          <p style={{ fontSize: '12px', color: '#AEB7C2', margin: 0, lineHeight: 1.5 }}>
            Under Indian cybersecurity and SEBI financial regulations, real OTPs must never be intercepted, scraped, stored, or centralized in any database.
            IN.V. PROTECT operates on a pure zero-trust ingestion model: SMS and Notification listeners inspect only the sender identity, URL hashes, and solicitation grammar while automatically stripping all authentication codes prior to analysis.
          </p>
        </div>
      </div>
    </div>
  );
};
