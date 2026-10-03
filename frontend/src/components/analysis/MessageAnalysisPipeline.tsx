import React, { useState } from 'react';
import {
  CheckCircle2,
  Upload,
  ExternalLink,
  ArrowRight,
  AlertOctagon,
  Copy,
  Check,
} from 'lucide-react';
import { AnalysisResponse, RiskLevel } from '../../types';

interface MessageAnalysisPipelineProps {
  onAnalyzeText: (text: string) => Promise<AnalysisResponse>;
  onAnalyzeImage?: (file: File) => Promise<AnalysisResponse>;
  onQuarantineMessage?: (text: string, analysis: AnalysisResponse) => void;
  initialText?: string;
}

const PIPELINE_STAGES = [
  { id: 'received', label: 'Message Received & Ingested' },
  { id: 'extract', label: 'Text Normalization & Entity Extraction' },
  { id: 'signals', label: 'Scam Signal & Keyword Detection' },
  { id: 'claims', label: 'Checking Financial & Regulator Claims' },
  { id: 'sources', label: 'Verifying Official Repositories (SEBI, RBI, I4C)' },
  { id: 'risk', label: 'Executing Risk Evaluation Engine' },
];

export const MessageAnalysisPipeline: React.FC<MessageAnalysisPipelineProps> = ({
  onAnalyzeText,
  onAnalyzeImage,
  onQuarantineMessage,
  initialText = '',
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Animation Stage States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analyzedText, setAnalyzedText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Canonical Evaluation Presets from Hackathon Benchmark
  const presets = [
    {
      title: 'Guaranteed 30% Return Scam',
      text: 'Guaranteed 30% weekly return in VIP Institutional Trading group. SEBI approved fund manager. Deposit Rs 25,000 now to unlock your allocation.',
    },
    {
      title: 'Demat Blocked OTP Harvest',
      text: 'Your Demat and Trading account has been BLOCKED due to pending KYC verification. Send your login password and 6-digit OTP immediately to avoid account suspension.',
    },
    {
      title: 'Fake Trading App APK Link',
      text: 'Download SEBI-certified institutional profit app v2.4 from http://bit.ly/sebi-pro-apk. Zero brokerage and 10x leverage guaranteed.',
    },
    {
      title: 'Legitimate Broker Notice',
      text: 'NSE circular: Regular quarterly settlement of funds & securities for all trading accounts will be conducted on Friday as per SEBI regulations.',
    },
  ];

  const handleRunAnalysis = async (textToAnalyze?: string) => {
    const target = (textToAnalyze || inputText).trim();
    if (!target && !selectedFile) return;

    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setAnalysisResult(null);
    setAnalyzedText(target);

    // Sequential light-up sequence (roughly 300ms per step = 1.8s total)
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 280);

    try {
      let result: AnalysisResponse;
      if (activeTab === 'image' && selectedFile && onAnalyzeImage) {
        result = await onAnalyzeImage(selectedFile);
      } else {
        result = await onAnalyzeText(target);
      }

      // Ensure pipeline completes smoothly before showing final card
      setTimeout(() => {
        clearInterval(interval);
        setCurrentStepIndex(PIPELINE_STAGES.length);
        setIsAnalyzing(false);
        setAnalysisResult(result);
      }, 1800);
    } catch (err) {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setInputText('');
    }
  };

  const getRiskColor = (level?: RiskLevel) => {
    if (level === 'High Concern') return '#ef4444';
    if (level === 'Needs Verification') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Input & Preset Section */}
      <div
        style={{
          backgroundColor: '#0b101d',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>
              Message Security Inspection & Analysis
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Analyze incoming WhatsApp, Telegram, SMS, or email communications for scam indicators and verify regulatory claims.
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', backgroundColor: '#070a12', borderRadius: '8px', padding: '3px', border: '1px solid #1e293b' }}>
            <button
              onClick={() => setActiveTab('text')}
              style={{
                backgroundColor: activeTab === 'text' ? '#06b6d4' : 'transparent',
                color: activeTab === 'text' ? '#080c14' : '#94a3b8',
                fontWeight: 700,
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: '6px',
              }}
            >
              Text / SMS
            </button>
            <button
              onClick={() => setActiveTab('image')}
              style={{
                backgroundColor: activeTab === 'image' ? '#06b6d4' : 'transparent',
                color: activeTab === 'image' ? '#080c14' : '#94a3b8',
                fontWeight: 700,
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: '6px',
              }}
            >
              Screenshot / OCR
            </button>
          </div>
        </div>

        {/* Input Area */}
        {activeTab === 'text' ? (
          <div>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious communication text here (e.g., 'Guaranteed 30% return in SEBI trading group...')"
              style={{
                width: '100%',
                fontSize: '13px',
                lineHeight: 1.6,
                backgroundColor: '#070a12',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '12px',
                color: '#f8fafc',
                resize: 'vertical',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              border: '2px dashed #1e293b',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#070a12',
            }}
          >
            {imagePreview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <img
                  src={imagePreview}
                  alt="Screenshot Preview"
                  style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid #1e293b' }}
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Upload style={{ width: '28px', height: '28px', color: '#06b6d4' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  Upload chat screenshot or advisory document
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Tesseract OCR extracts Hindi, English, and Hinglish text locally
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        )}

        {/* Quick Canonical Presets */}
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Test Cases:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(p.text);
                setActiveTab('text');
                handleRunAnalysis(p.text);
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
              {p.title}
            </button>
          ))}
        </div>

        {/* Trigger Button */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing || (!inputText.trim() && !selectedFile)}
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
              cursor: isAnalyzing || (!inputText.trim() && !selectedFile) ? 'not-allowed' : 'pointer',
              opacity: isAnalyzing || (!inputText.trim() && !selectedFile) ? 0.6 : 1,
            }}
          >
            {isAnalyzing ? 'Running Inspection...' : 'Analyze Financial Communication'}
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>

      {/* Sequential Animation Pipeline */}
      {isAnalyzing && (
        <div
          style={{
            backgroundColor: '#0b101d',
            border: '1px solid #06b6d4',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 0 24px rgba(6, 182, 212, 0.15)',
          }}
          className="animate-fade-in"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#06b6d4',
              }}
              className="step-active-pulse"
            />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Real-Time Security Pipeline Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PIPELINE_STAGES.map((step, idx) => {
              const isDone = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isCurrent
                      ? 'rgba(6, 182, 212, 0.08)'
                      : isDone
                      ? 'rgba(16, 185, 129, 0.04)'
                      : 'transparent',
                    border: isCurrent
                      ? '1px solid rgba(6, 182, 212, 0.3)'
                      : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: isDone
                        ? '#10b981'
                        : isCurrent
                        ? '#06b6d4'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isDone || isCurrent ? '#080c14' : '#64748b',
                    }}
                  >
                    {isDone ? '✓' : isCurrent ? '◉' : '○'}
                  </div>

                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? '#ffffff' : isDone ? '#cbd5e1' : '#64748b',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Split Analysis Results Page */}
      {analysisResult && !isAnalyzing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          {/* Main Split Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {/* Left: Message Card */}
            <div
              style={{
                backgroundColor: '#0b101d',
                border: '1px solid #1e293b',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
                    Incoming Financial Communication
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analyzedText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    {copied ? <Check style={{ width: '12px', height: '12px', color: '#10b981' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: '#070a12',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#f8fafc',
                    fontFamily: 'inherit',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  "{analyzedText}"
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '11px', color: '#64748b' }}>
                Channel: Direct Inspection • Language: Auto-detected (En/Hi/Hinglish)
              </div>
            </div>

            {/* Right: Security Analysis Card */}
            <div
              style={{
                backgroundColor: '#0b101d',
                border: `1px solid ${getRiskColor(analysisResult.risk_level)}44`,
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em' }}>
                    Security Analysis Verdict
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: `${getRiskColor(analysisResult.risk_level)}18`,
                      color: getRiskColor(analysisResult.risk_level),
                      border: `1px solid ${getRiskColor(analysisResult.risk_level)}44`,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {analysisResult.risk_level.toUpperCase()}
                  </span>
                </div>

                {/* Risk Indicators Header */}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
                  Explainable Risk Indicators ({analysisResult.detected_signals.length} detected)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {analysisResult.detected_signals.length > 0 ? (
                    analysisResult.detected_signals.map((sig, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: sig.severity === 'high' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                          border: `1px solid ${sig.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ fontSize: '12px' }}>{sig.severity === 'high' ? '🔴' : '🟠'}</span>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: sig.severity === 'high' ? '#fca5a5' : '#fde68a' }}>
                            {sig.name}
                          </strong>
                          <span style={{ color: '#94a3b8', marginLeft: '6px' }}>— {sig.description}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                      No deceptive or high-urgency harvest patterns found.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              {analysisResult.risk_level === 'High Concern' && onQuarantineMessage && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => onQuarantineMessage(analyzedText, analysisResult)}
                    style={{
                      flex: 1,
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <AlertOctagon style={{ width: '14px', height: '14px' }} />
                    Quarantine Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Official Source Evidence Panel */}
          <div
            style={{
              backgroundColor: '#0b101d',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '20px 22px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#06b6d4' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Official Source Verification & Evidence
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Authoritative Cross-Reference
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analysisResult.evidence.length > 0 ? (
                analysisResult.evidence.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(6, 182, 212, 0.12)',
                            color: '#22d3ee',
                          }}
                        >
                          {ev.source_id || 'OFFICIAL'}
                        </span>
                        <strong style={{ color: '#f8fafc' }}>{ev.title || ev.source_name || ev.publisher}</strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                        ✓ Checked
                      </span>
                    </div>

                    <div style={{ color: '#94a3b8', lineHeight: 1.5, marginBottom: '8px' }}>
                      {ev.passage || ev.summary}
                    </div>

                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#06b6d4',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        View Official Regulatory Document
                        <ExternalLink style={{ width: '11px', height: '11px' }} />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    fontSize: '12px',
                    color: '#fde68a',
                  }}
                >
                  <strong>⚠️ Unverified Claims Detected:</strong> No supporting official circulars or authorizations were found in SEBI, RBI, or I4C repositories for this entity or return claim.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
