import React, { useState } from 'react';
import {
  CheckCircle2,
  Upload,
  ExternalLink,
  ArrowRight,
  Copy,
  Check,
  Shield,
  FileText,
} from 'lucide-react';
import { AnalysisResponse, RiskLevel } from '../../types';

interface MessageAnalysisPipelineProps {
  onAnalyzeText: (text: string) => Promise<AnalysisResponse>;
  onAnalyzeImage?: (file: File) => Promise<AnalysisResponse>;
  onQuarantineMessage?: (text: string, analysis: AnalysisResponse) => void;
  onViewEvidence?: (analysis: AnalysisResponse) => void;
  onProtectionOptions?: (analysis: AnalysisResponse) => void;
  initialText?: string;
}

const PIPELINE_STAGES = [
  { id: 'received', label: 'MESSAGE RECEIVED' },
  { id: 'extraction', label: 'TEXT / OCR EXTRACTION' },
  { id: 'normalization', label: 'NORMALIZATION' },
  { id: 'claims', label: 'CLAIM EXTRACTION' },
  { id: 'signals', label: 'SCAM SIGNAL DETECTION' },
  { id: 'ai_rules', label: 'AI + RULES' },
  { id: 'verification', label: 'OFFICIAL VERIFICATION' },
  { id: 'risk_engine', label: 'RISK ENGINE' },
  { id: 'result', label: 'RESULT' },
];

export const MessageAnalysisPipeline: React.FC<MessageAnalysisPipelineProps> = ({
  onAnalyzeText,
  onAnalyzeImage,
  onQuarantineMessage,
  onViewEvidence,
  onProtectionOptions,
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
  const [showProtectionMenu, setShowProtectionMenu] = useState(false);

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
    setAnalyzedText(target || (selectedFile ? `Image: ${selectedFile.name}` : ''));

    // Animate sequentially through 9 stages (approx 220ms per stage = ~2.0s)
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 220);

    try {
      let result: AnalysisResponse;
      if (activeTab === 'image' && selectedFile && onAnalyzeImage) {
        result = await onAnalyzeImage(selectedFile);
      } else {
        result = await onAnalyzeText(target);
      }

      setTimeout(() => {
        clearInterval(interval);
        setCurrentStepIndex(PIPELINE_STAGES.length);
        setIsAnalyzing(false);
        setAnalysisResult(result);
      }, 2000);
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

  const getRiskStatusInfo = (level?: RiskLevel) => {
    if (level === 'High Concern') {
      return {
        label: 'HIGH RISK',
        color: '#EF4444',
        badgeBg: 'rgba(239, 68, 68, 0.12)',
        badgeBorder: 'rgba(239, 68, 68, 0.35)',
      };
    }
    if (level === 'Needs Verification') {
      return {
        label: 'REVIEW',
        color: '#F59E0B',
        badgeBg: 'rgba(245, 158, 11, 0.12)',
        badgeBorder: 'rgba(245, 158, 11, 0.35)',
      };
    }
    return {
      label: 'TRUSTED',
      color: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeBorder: 'rgba(16, 185, 129, 0.35)',
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Input & Preset Section */}
      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
              Message Security Inspection & Analysis
            </h2>
            <p style={{ fontSize: '13px', color: '#A7A7A7', margin: 0 }}>
              Analyze incoming WhatsApp, Telegram, SMS, or email communications for scam indicators and regulatory compliance.
            </p>
          </div>
        </div>

        {/* Tab Toggle: Text vs Image OCR */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: activeTab === 'text' ? 'rgba(2, 195, 154, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'text' ? '#02C39A' : '#A7A7A7',
              border: activeTab === 'text' ? '1px solid rgba(2, 195, 154, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Direct Text Input
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: activeTab === 'image' ? 'rgba(2, 195, 154, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === 'image' ? '#02C39A' : '#A7A7A7',
              border: activeTab === 'image' ? '1px solid rgba(2, 195, 154, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Screenshot / OCR Analysis
          </button>
        </div>

        {/* Input Area */}
        {activeTab === 'text' ? (
          <div>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste suspicious financial message, SMS, Telegram alert, or advisor claim here..."
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '10px',
                color: '#FFFFFF',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.5,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#02C39A';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(2, 195, 154, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        ) : (
          <div
            style={{
              border: '2px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <input
              type="file"
              accept="image/*"
              id="ocr-upload-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="ocr-upload-input"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Upload style={{ width: '28px', height: '28px', color: '#02C39A' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                {selectedFile ? selectedFile.name : 'Upload Screenshot (PNG, JPG)'}
              </span>
              <span style={{ fontSize: '11px', color: '#A7A7A7' }}>
                OCR pipeline extracts text, checks SEBI/RBI claims & detects fake certifications
              </span>
            </label>
            {imagePreview && (
              <div style={{ marginTop: '12px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#A7A7A7', fontWeight: 600 }}>Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveTab('text');
                setInputText(p.text);
                setSelectedFile(null);
                setImagePreview(null);
                handleRunAnalysis(p.text);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#02C39A';
                e.currentTarget.style.color = '#02C39A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Trigger Button */}
        <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing || (!inputText.trim() && !selectedFile)}
            style={{
              backgroundColor: '#02C39A',
              color: '#171717',
              fontWeight: 800,
              fontSize: '13px',
              padding: '11px 24px',
              borderRadius: '10px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(2, 195, 154, 0.35)',
              cursor: isAnalyzing || (!inputText.trim() && !selectedFile) ? 'not-allowed' : 'pointer',
              opacity: isAnalyzing || (!inputText.trim() && !selectedFile) ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isAnalyzing ? 'Inspecting Communication...' : 'Analyze Financial Communication'}</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>

      {/* 9-Stage Animated Sequential Pipeline */}
      {isAnalyzing && (
        <div
          className="glass-panel"
          style={{
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(2, 195, 154, 0.35)',
            boxShadow: '0 0 24px rgba(2, 195, 154, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#02C39A',
                boxShadow: '0 0 8px #02C39A',
              }}
              className="animate-breathing"
            />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#02C39A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Sequential Inspection Pipeline Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: isCurrent
                      ? 'rgba(2, 195, 154, 0.08)'
                      : isDone
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'transparent',
                    border: isCurrent
                      ? '1px solid rgba(2, 195, 154, 0.30)'
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
                        ? '#02C39A'
                        : isCurrent
                        ? 'rgba(2, 195, 154, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isDone ? '#171717' : isCurrent ? '#02C39A' : '#A7A7A7',
                    }}
                  >
                    {isDone ? '✓' : isCurrent ? '◉' : '○'}
                  </div>

                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isCurrent ? 800 : isDone ? 600 : 500,
                      color: isCurrent ? '#FFFFFF' : isDone ? '#A7A7A7' : '#555555',
                      letterSpacing: '0.04em',
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

      {/* Analysis Results View */}
      {analysisResult && !isAnalyzing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Main Split Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {/* Left: Original Message Card */}
            <div
              className="glass-panel"
              style={{
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#A7A7A7', letterSpacing: '0.08em' }}>
                    Incoming Financial Communication
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analyzedText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{ background: 'none', border: 'none', color: '#A7A7A7', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    {copied ? <Check style={{ width: '12px', height: '12px', color: '#02C39A' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '16px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#FFFFFF',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  "{analyzedText}"
                </div>
              </div>

              <div style={{ marginTop: '18px', fontSize: '11px', color: '#A7A7A7' }}>
                Channel: Direct Inspection • Language: Auto-detected (En/Hi/Hinglish)
              </div>
            </div>

            {/* Right: Security Analysis Card (Matching Section 9 Specification) */}
            <div
              className="glass-panel"
              style={{
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Subtle status indicator dot */}
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getRiskStatusInfo(analysisResult.risk_level).color,
                        boxShadow: `0 0 6px ${getRiskStatusInfo(analysisResult.risk_level).color}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        color: getRiskStatusInfo(analysisResult.risk_level).color,
                      }}
                    >
                      {getRiskStatusInfo(analysisResult.risk_level).label}
                    </span>
                  </div>

                  {/* Real numerical score ONLY if provided by backend */}
                  {(analysisResult as any).risk_score !== undefined && (analysisResult as any).risk_score !== null && (
                    <span style={{ fontSize: '11px', color: '#A7A7A7' }}>
                      Risk Score: <strong style={{ color: '#FFFFFF' }}>{(analysisResult as any).risk_score}/100</strong>
                    </span>
                  )}
                </div>

                {/* Indicator Count */}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                  {analysisResult.detected_signals.length} security indicator{analysisResult.detected_signals.length === 1 ? '' : 's'} detected
                </div>

                {/* Bullet list of detected signals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {analysisResult.detected_signals.length > 0 ? (
                    analysisResult.detected_signals.map((sig, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '12px',
                          color: '#FFFFFF',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: getRiskStatusInfo(analysisResult.risk_level).color, marginTop: '2px' }}>
                          •
                        </span>
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>{sig.name}</strong>
                          {sig.description && (
                            <span style={{ color: '#A7A7A7', marginLeft: '6px' }}>
                              — {sig.description}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                      <span>No unauthorized harvest, credential, or urgency indicators detected.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons as specified in Section 9: [ View Evidence ] [ Protection Options ] */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (onViewEvidence) onViewEvidence(analysisResult);
                    const el = document.getElementById('official-evidence-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontWeight: 700,
                    fontSize: '12px',
                    padding: '11px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#02C39A';
                    e.currentTarget.style.color = '#02C39A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  <FileText style={{ width: '14px', height: '14px' }} />
                  View Evidence
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onProtectionOptions) {
                      onProtectionOptions(analysisResult);
                    } else if (onQuarantineMessage) {
                      onQuarantineMessage(analyzedText, analysisResult);
                    } else {
                      setShowProtectionMenu(!showProtectionMenu);
                    }
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: analysisResult.risk_level === 'High Concern' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(2, 195, 154, 0.12)',
                    color: analysisResult.risk_level === 'High Concern' ? '#F87171' : '#02C39A',
                    border: `1px solid ${analysisResult.risk_level === 'High Concern' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(2, 195, 154, 0.35)'}`,
                    fontWeight: 700,
                    fontSize: '12px',
                    padding: '11px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <Shield style={{ width: '14px', height: '14px' }} />
                  Protection Options
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Official Evidence Panel (Investigation Format as in Section 11) */}
          <div
            id="official-evidence-panel"
            className="glass-panel"
            style={{
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    margin: '0 0 2px 0',
                  }}
                >
                  OFFICIAL EVIDENCE
                </h3>
                <span style={{ fontSize: '11px', color: '#A7A7A7' }}>
                  Authoritative cross-reference against SEBI, RBI, I4C & CERT-In registries
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(2, 195, 154, 0.08)',
                  color: '#02C39A',
                  border: '1px solid rgba(2, 195, 154, 0.25)',
                }}
              >
                Security Investigation Dossier
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysisResult.evidence.length > 0 ? (
                analysisResult.evidence.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(2, 195, 154, 0.12)',
                            color: '#02C39A',
                            border: '1px solid rgba(2, 195, 154, 0.25)',
                          }}
                        >
                          {ev.source_id || 'SEBI'}
                        </span>
                        <strong style={{ color: '#FFFFFF', fontSize: '13px' }}>
                          {ev.title || ev.source_name || ev.publisher}
                        </strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                        ✓ Source checked
                      </span>
                    </div>

                    <div style={{ color: '#A7A7A7', fontSize: '12px', lineHeight: 1.6, marginBottom: '10px' }}>
                      {ev.passage || ev.summary}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#A7A7A7' }}>
                      <span>Date: {(ev as any).date || 'Active Circular / Regulation'}</span>
                      {ev.url && (
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#02C39A',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <span>Open Official Source</span>
                          <ExternalLink style={{ width: '11px', height: '11px' }} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    fontSize: '12px',
                    color: '#FDE68A',
                  }}
                >
                  <strong>⚠️ Unverified Claims Detected:</strong> No supporting official circulars, broker registrations, or authorizations were confirmed in checked regulatory repositories (SEBI, RBI, I4C).
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
