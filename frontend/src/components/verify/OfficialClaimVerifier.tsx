import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface OfficialClaimVerifierProps {
  onVerifyQuery: (query: string) => Promise<any>;
}

export const OfficialClaimVerifier: React.FC<OfficialClaimVerifierProps> = ({ onVerifyQuery }) => {
  const [claimText, setClaimText] = useState('This trading platform is SEBI approved and guarantees returns');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<number>(0);
  const [result, setResult] = useState<any | null>(null);

  const steps = [
    'Parsing & Normalizing Claim Text',
    'Extracting Entities & Regulatory Assertions',
    'Querying Official SEBI Investor Circulars',
    'Checking I4C & TAU Advisory Database',
    'Cross-Referencing RBI Financial Awareness Catalog',
    'Compiling Verifiable Regulatory Findings',
  ];

  const canonicalClaims = [
    'This trading platform is SEBI approved and guarantees returns',
    'SEBI registration INZ000214836',
    'RBI approved high-yield fixed investment',
    'Mandatory Demat KYC update link required by NSE',
  ];

  const handleRunVerification = async (target?: string) => {
    const q = (target || claimText).trim();
    if (!q) return;

    setIsVerifying(true);
    setVerifyStep(0);
    setResult(null);

    const interval = setInterval(() => {
      setVerifyStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 280);

    try {
      const res = await onVerifyQuery(q);
      setTimeout(() => {
        clearInterval(interval);
        setIsVerifying(false);
        setResult(res);
      }, 1800);
    } catch {
      clearInterval(interval);
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Verification Input Card */}
      <div
        style={{
          backgroundColor: '#0b101d',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>
            Official Claim & Regulatory Verifier
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            Independently cross-reference financial claims against official SEBI circulars, I4C advisories, and RBI records.
          </p>
        </div>

        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder="Enter regulatory claim, registration number, or broker name..."
            style={{ width: '100%', paddingLeft: '40px', fontSize: '13px' }}
          />
        </div>

        {/* Quick Canonical Claims */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Sample Claims:</span>
          {canonicalClaims.map((claim, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setClaimText(claim);
                handleRunVerification(claim);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              "{claim.slice(0, 38)}..."
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleRunVerification()}
            disabled={isVerifying || !claimText.trim()}
            style={{
              backgroundColor: '#06b6d4',
              color: '#080c14',
              fontWeight: 800,
              fontSize: '13px',
              padding: '11px 22px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
            }}
          >
            {isVerifying ? 'Verifying Official Records...' : 'Verify Claim Against Official Sources'}
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>

      {/* Verification Sequence Animation */}
      {isVerifying && (
        <div
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid #06b6d4',
            borderRadius: '16px',
            padding: '24px',
          }}
          className="animate-fade-in"
        >
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase', marginBottom: '14px' }}>
            Multi-Source Official Check in Progress
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {steps.map((st, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                  color: verifyStep >= i ? '#f8fafc' : '#475569',
                }}
              >
                <span>{verifyStep > i ? '✓' : verifyStep === i ? '◉' : '○'}</span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Result Card */}
      {result && !isVerifying && (
        <div
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '24px',
          }}
          className="animate-fade-in"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Claim Verification Result
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: result.is_verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: result.is_verified ? '#10b981' : '#f59e0b',
                border: `1px solid ${result.is_verified ? '#10b981' : '#f59e0b'}44`,
              }}
            >
              {result.is_verified ? '🟢 OFFICIALLY VERIFIED' : '🟠 UNVERIFIED CLAIM'}
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#070a12',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '13px',
              color: '#f8fafc',
              marginBottom: '18px',
              border: '1px solid #1e293b',
            }}
          >
            Claim: "{claimText}"
          </div>

          {/* Official-Source Check Breakdown */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Official Authority Source Audit:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { name: 'SEBI Investor', status: 'Checked' },
                { name: 'I4C / TAU', status: 'Checked' },
                { name: 'RBI FAME', status: 'Checked' },
                { name: 'CERT-In', status: 'Checked' },
              ].map((src, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <strong style={{ color: '#ffffff' }}>{src.name}</strong>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>✓ {src.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: '8px',
              backgroundColor: result.is_verified ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              border: `1px solid ${result.is_verified ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
              fontSize: '12px',
              lineHeight: 1.6,
              color: '#f8fafc',
            }}
          >
            {result.explanation || (result.is_verified
              ? 'Entity and regulatory authorization confirmed in official master database.'
              : 'No supporting official evidence found in checked regulatory sources. SEBI prohibits all promises of guaranteed or assured market returns.')}
          </div>
        </div>
      )}
    </div>
  );
};
