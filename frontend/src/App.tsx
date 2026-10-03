import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield,
  Activity,
  Settings,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  ExternalLink,
  CheckCircle2,
  Search,
  ArrowRight,
  Database,
  RefreshCw,
  FileText,
  Globe,
  Upload,
  Smartphone,
  Laptop,
  Watch,
  Lock,
  Bell,
  Inbox,
  AlertOctagon,
  Cpu,
  X,
  PhoneCall,
  Radio,
  Copy,
  Sliders,
  Check,
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  UserCheck,
  Video,
} from 'lucide-react';
import {
  AnalysisResponse,
  RiskLevel,
  ProtectionTier,
  SecureMessage,
  IncidentRecord,
  SecurityOverview,
  DeviceStatus,
  IntegrationSource,
  PrivacyStatus,
  ProtectionLevel,
  SecuritySettings,
  DemoAttackFlow,
  DemoAttackStep,
  DailySecurityReport,
  ScamTrendsResponse,
  InvestorSafetyReview,
} from './types';
import { AuthFlowStep, OwnerProfile } from './types/auth';
import { OwnerRegistration } from './components/auth/OwnerRegistration';
import { EmailOtpVerification } from './components/auth/EmailOtpVerification';
import { IdentityVerification } from './components/auth/IdentityVerification';
import { SecureLogin } from './components/auth/SecureLogin';
import { DeviceManagerModal } from './components/auth/DeviceManagerModal';
import { SecurityPrivacyModal } from './components/auth/SecurityPrivacyModal';
import { OwnerProfileBadge } from './components/auth/OwnerProfileBadge';
import { FirstLaunchSplash } from './components/auth/FirstLaunchSplash';
import { AppSidebar } from './components/layout/AppSidebar';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { SecurityStatusHero } from './components/dashboard/SecurityStatusHero';
import { MessageAnalysisPipeline } from './components/analysis/MessageAnalysisPipeline';
import { OfficialClaimVerifier } from './components/verify/OfficialClaimVerifier';
import { QuarantineManager } from './components/quarantine/QuarantineManager';
import { SmartwatchAlertModal } from './components/devices/SmartwatchAlertModal';
import { FaceScanStudio } from './components/biometrics/FaceScanStudio';
import { VideoLessonHero } from './components/academy/VideoLessonHero';
interface DemoExample {
  id: string;
  title: string;
  channel: string;
  text: string;
}

interface OfficialSource {
  source_id: string;
  title: string;
  publisher: string;
  url: string;
  allowed_use: string;
  description: string;
}

type NavSection =
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
  | 'architecture'
  | 'academy';

export default function App() {
  // View Mode: 'console' (Full shield dashboard) | 'auth' (Registration / Login)
  const [viewMode, setViewMode] = useState<'console' | 'auth'>('auth');
  const [activeNav, setActiveNav] = useState<NavSection>('dashboard');
  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');

  // Splash & Smartwatch HUD States
  const [hasSeenSplash, setHasSeenSplash] = useState<boolean>(() => {
    return sessionStorage.getItem('in_v_protect_splash_seen') === 'true';
  });
  const [showSmartwatchModal, setShowSmartwatchModal] = useState<boolean>(false);

  // Security Hub Live State
  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [activeMessageTier, setActiveMessageTier] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<SecureMessage | null>(null);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationSource[]>([]);
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus | null>(null);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);

  // IN V PROTECT Intelligence & Architecture States
  const [dailyReport, setDailyReport] = useState<DailySecurityReport | null>(null);
  const [scamTrends, setScamTrends] = useState<ScamTrendsResponse | null>(null);
  const [safetyReview, setSafetyReview] = useState<InvestorSafetyReview | null>(null);
  const [activeTierTab, setActiveTierTab] = useState<'quarantine' | 'review' | 'trusted'>('quarantine');
  const [evidenceModalMessage, setEvidenceModalMessage] = useState<SecureMessage | null>(null);
  const [reportConfirmMessage, setReportConfirmMessage] = useState<SecureMessage | null>(null);
  const [reportUserNotes, setReportUserNotes] = useState<string>('');
  const [reportingSubmitting, setReportingSubmitting] = useState<boolean>(false);
  const [quickAnalyzeText, setQuickAnalyzeText] = useState<string>('');
  const [quickAnalyzeResult, setQuickAnalyzeResult] = useState<AnalysisResponse | null>(null);
  const [quickAnalyzeLoading, setQuickAnalyzeLoading] = useState<boolean>(false);

  // Section 19 9-Step Demo Attack Flow State
  const [demoAttackFlow, setDemoAttackFlow] = useState<DemoAttackFlow | null>(null);
  const [showDemoFlowModal, setShowDemoFlowModal] = useState<boolean>(false);
  const [demoFlowStepIndex, setDemoFlowStepIndex] = useState<number>(0);

  // Section 20 Local User Mode / Onboarding State
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // Analysis / Inspector State
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'url'>('text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [urlAnalysisResult, setUrlAnalysisResult] = useState<any | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo & Knowledge Base State
  const [demoExamples, setDemoExamples] = useState<DemoExample[]>([]);
  const [officialSources, setOfficialSources] = useState<OfficialSource[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Alert & Feedback Modals
  const [watchAlertData, setWatchAlertData] = useState<any | null>(null);
  const [reportingIncident, setReportingIncident] = useState<IncidentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Authentication & Owner Verification State
  const [authFlowStep, setAuthFlowStep] = useState<AuthFlowStep>('FIRST_LAUNCH_REGISTER');
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [pendingRegEmail, setPendingRegEmail] = useState<string>('');
  const [pendingRegUserId, setPendingRegUserId] = useState<string>('');
  const [pendingRegMaskedEmail, setPendingRegMaskedEmail] = useState<string>('');
  const [pendingRegEmailConfigured, setPendingRegEmailConfigured] = useState<boolean>(true);
  const [pendingRegSandboxOtp, setPendingRegSandboxOtp] = useState<string | null>(null);
  const [showDeviceModal, setShowDeviceModal] = useState<boolean>(false);
  const [showSecurityPrivacyModal, setShowSecurityPrivacyModal] = useState<boolean>(false);

  // Initial Data & Auth Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'academy' || window.location.hash === '#academy') {
      setActiveNav('academy');
    }
    checkAuthStatus();
    fetchDemoExamples();
    fetchOfficialSources();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('sangyan_access_token');
      const meRes = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (meRes.ok) {
        const profile = await meRes.json();
        if (profile.account_status === 'ACTIVE' && profile.identity_verified) {
          setOwnerProfile(profile);
          setAuthFlowStep('AUTHENTICATED');
          setViewMode('console');
          fetchSecurityData();
          return;
        }
      }

      // Default directly to Owner Registration / Sign Up window
      setAuthFlowStep('FIRST_LAUNCH_REGISTER');
      setViewMode('auth');
    } catch {
      setAuthFlowStep('FIRST_LAUNCH_REGISTER');
      setViewMode('auth');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('sangyan_access_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}
    localStorage.removeItem('sangyan_access_token');
    setOwnerProfile(null);
    setAuthFlowStep('FIRST_LAUNCH_REGISTER');
    setViewMode('auth');
    showToast('Securely logged out from Sangyan AI Investor Shield.');
  };

  const toastTimeoutRef = useRef<any>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(null);
  }, []);

  const fetchSecurityData = async () => {
    try {
      const token = localStorage.getItem('sangyan_access_token');
      const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const [ovRes, msgRes, incRes, devRes, intRes, privRes, setRes, demoFlowRes, dailyRes, trendsRes, safetyRes] = await Promise.all([
        fetch('/api/security-overview', { headers: authHeaders }),
        fetch('/api/messages', { headers: authHeaders }),
        fetch('/api/incidents', { headers: authHeaders }),
        fetch('/api/devices', { headers: authHeaders }),
        fetch('/api/integrations', { headers: authHeaders }),
        fetch('/api/privacy/status', { headers: authHeaders }),
        fetch('/api/settings', { headers: authHeaders }),
        fetch('/api/demo/flow', { headers: authHeaders }),
        fetch('/api/security/daily-report', { headers: authHeaders }),
        fetch('/api/security/trends', { headers: authHeaders }),
        fetch('/api/security/safety-review', { headers: authHeaders }),
      ]);

      const [ov, msg, inc, dev, itg, priv, stg, dFlow, daily, trends, safety] = await Promise.all([
        ovRes.ok ? ovRes.json() : null,
        msgRes.ok ? msgRes.json() : null,
        incRes.ok ? incRes.json() : null,
        devRes.ok ? devRes.json() : null,
        intRes.ok ? intRes.json() : null,
        privRes.ok ? privRes.json() : null,
        setRes.ok ? setRes.json() : null,
        demoFlowRes.ok ? demoFlowRes.json() : null,
        dailyRes.ok ? dailyRes.json() : null,
        trendsRes.ok ? trendsRes.json() : null,
        safetyRes.ok ? safetyRes.json() : null,
      ]);

      // Batched update in one React render pass
      if (ov) setOverview(ov);
      if (msg) setMessages(msg);
      if (inc) setIncidents(inc);
      if (dev) setDevices(dev);
      if (itg) setIntegrations(itg);
      if (priv) setPrivacyStatus(priv);
      if (stg) setSettings(stg);
      if (dFlow) setDemoAttackFlow(dFlow);
      if (daily) setDailyReport(daily);
      if (trends) setScamTrends(trends);
      if (safety) setSafetyReview(safety);
    } catch (err) {
      console.error('Error fetching security data:', err);
    }
  };

  const handleUserConfirmedReport = async (msg: SecureMessage, notes?: string) => {
    setReportingSubmitting(true);
    try {
      const res = await fetch(`/api/messages/${msg.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_confirmed: true,
          user_notes: notes || reportUserNotes || 'Investor confirmed fraudulent communication.',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Incident #${data.incident_id} logged. Official reporting guidance provided.`);
        setReportConfirmMessage(null);
        setReportUserNotes('');
        fetchSecurityData();
      } else {
        showToast(data.detail || data.error || 'Failed to submit confirmed report.');
      }
    } catch {
      showToast('Error communicating with reporting service.');
    } finally {
      setReportingSubmitting(false);
    }
  };

  const handleQuickAnalyze = async () => {
    if (!quickAnalyzeText.trim()) {
      showToast('Please paste a communication snippet to analyze.');
      return;
    }
    setQuickAnalyzeLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'live_incoming_stream',
          text: quickAnalyzeText.trim(),
        }),
      });
      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        setQuickAnalyzeResult(data);
        showToast('Deep Scam Analysis Complete: ' + data.risk_level);
      } else {
        showToast('Analysis request failed.');
      }
    } catch {
      showToast('Failed to reach analysis engine.');
    } finally {
      setQuickAnalyzeLoading(false);
    }
  };

  const handleUpdateSettings = async (updates: Partial<SecuritySettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        showToast('Investor protection settings updated');
      }
    } catch {
      showToast('Settings update failed');
    }
  };

  const handlePurgeLogs = async () => {
    try {
      const res = await fetch('/api/settings/purge', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Audit logs successfully purged');
        fetchSecurityData();
      }
    } catch {
      showToast('Purge request failed');
    }
  };

  const fetchDemoExamples = async () => {
    try {
      const res = await fetch('/api/demo-examples');
      if (res.ok) setDemoExamples(await res.json());
    } catch {
      // Fallback demo examples
      setDemoExamples([
        {
          id: 'demo-1',
          title: 'Guaranteed Return Scam',
          channel: 'whatsapp',
          text: 'Invest ₹10,000 today and earn guaranteed returns of ₹50,000 within 7 days. This opportunity is 100% risk-free and approved by SEBI.',
        },
        {
          id: 'demo-2',
          title: 'OTP & Password Theft',
          channel: 'sms',
          text: 'URGENT SECURITY ALERT: Dear customer, your Demat account verification is pending. Please share your Demat login password and 6-digit OTP to complete verification immediately or your account will be suspended.',
        },
      ]);
    }
  };

  const fetchOfficialSources = async () => {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) setOfficialSources(await res.json());
    } catch (err) {
      console.error('Error fetching official sources:', err);
    }
  };

  // Perform User Actions on Messages (Release, Delete, Quarantine, Mark Safe)
  const handleMessageAction = async (messageId: string, action: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        if (selectedMessage && selectedMessage.id === messageId) {
          if (action === 'delete') {
            setSelectedMessage(null);
          } else {
            setSelectedMessage({
              ...selectedMessage,
              status: action === 'release' ? 'RELEASED' : action === 'mark_safe' ? 'MARKED_SAFE' : 'QUARANTINED',
              protection_tier: data.tier || selectedMessage.protection_tier,
            });
          }
        }
        fetchSecurityData();
      } else {
        showToast(data.error || 'Action could not be completed.');
      }
    } catch {
      showToast('Error communicating with security backend.');
    }
  };

  // Trigger Smartwatch Companion Alert Simulation
  const handleTriggerWatchAlert = async () => {
    try {
      const res = await fetch('/api/devices/DEV-WCH-01/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setWatchAlertData(data.alert_dispatched);
      } else {
        showToast('Watch device is offline or unlinked.');
      }
    } catch {
      showToast('Failed to trigger watch alert.');
    }
  };

  // Deep Analysis Handlers (Existing Tested Capabilities Preserved)
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please provide message or notification text to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, channel: 'manual_submission', language }),
      });
      if (!res.ok) throw new Error(`Analysis server returned HTTP ${res.status}`);
      const data: AnalysisResponse = await res.json();
      setAnalysisResult(data);
      showToast(`Communication analyzed and secured into ${data.protection_tier || 'Security Hub'}`);
      fetchSecurityData();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUpload = async () => {
    if (!selectedFile) {
      setError('Please select a screenshot image to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('channel', 'screenshot');
      formData.append('language', language);

      const res = await fetch('/api/analyze-upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload analysis returned HTTP ${res.status}`);
      const data: AnalysisResponse = await res.json();
      setAnalysisResult(data);
      showToast('Screenshot scanned & cataloged in Security Hub');
      fetchSecurityData();
    } catch (err: any) {
      setError(err.message || 'Error processing screenshot.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!inputUrl.trim()) {
      setError('Please provide a URL to inspect.');
      return;
    }
    setLoading(true);
    setError(null);
    setUrlAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      if (!res.ok) throw new Error(`URL inspector returned HTTP ${res.status}`);
      const data = await res.json();
      setUrlAnalysisResult(data);
      showToast('Domain analyzed against official registries');
    } catch (err: any) {
      setError(err.message || 'Error inspecting URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEntity = async () => {
    if (!verifyQuery.trim()) return;
    setVerifyLoading(true);
    try {
      const res = await fetch('/api/verify-entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: verifyQuery }),
      });
      if (res.ok) setVerifyResult(await res.json());
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleLoadDemo = (demo: DemoExample) => {
    setActiveNav('analyze');
    setActiveTab('text');
    setInputText(demo.text);
    setAnalysisResult(null);
    setError(null);
  };

  // Helper Styling
  const getRiskBadge = (level: RiskLevel | string) => {
    if (level === 'High Concern' || level === 'Quarantined / High Risk') {
      return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.35)', icon: ShieldAlert, label: 'High Concern' };
    }
    if (level === 'Needs Verification' || level === 'Review / Verify') {
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)', icon: AlertTriangle, label: 'Needs Verification' };
    }
    return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.35)', icon: ShieldCheck, label: 'Low Concern' };
  };

  const getTierColor = (tier: ProtectionTier | string) => {
    if (tier === 'Quarantined / High Risk') return '#f87171';
    if (tier === 'Review / Verify') return '#fbbf24';
    return '#34d399';
  };

  const filteredMessages = messages.filter((m) => {
    if (activeMessageTier === 'all') return true;
    if (activeMessageTier === 'important') return m.protection_tier === 'Trusted / Important';
    if (activeMessageTier === 'review') return m.protection_tier === 'Review / Verify';
    if (activeMessageTier === 'quarantine') return m.protection_tier === 'Quarantined / High Risk';
    return true;
  });

  const quarantinedMessages = messages.filter((m) => m.protection_tier === 'Quarantined / High Risk' || m.risk_level === 'High Concern');
  const reviewMessages = messages.filter((m) => m.protection_tier === 'Review / Verify' || m.risk_level === 'Needs Verification');
  const trustedMessages = messages.filter((m) => m.protection_tier === 'Trusted / Important' || m.risk_level === 'Low Concern');

  // =========================================================================
  // SHARED TOAST NOTIFICATION COMPONENT
  // =========================================================================
  const renderToastNotification = () => {
    if (!toastMessage) return null;
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 12px rgba(59, 130, 246, 0.25)',
          padding: '12px 18px',
          borderRadius: '12px',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: 600,
          maxWidth: 'calc(100vw - 48px)',
          backdropFilter: 'blur(12px)',
        }}
        className="animate-fade-in"
      >
        <Bell style={{ width: '16px', height: '16px', color: '#60a5fa', flexShrink: 0 }} />
        <span style={{ lineHeight: 1.4 }}>{toastMessage}</span>
        <button
          type="button"
          onClick={dismissToast}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '4px',
            borderRadius: '4px',
          }}
          aria-label="Dismiss notification"
        >
          <X style={{ width: '15px', height: '15px' }} />
        </button>
      </div>
    );
  };

  // =========================================================================
  // VIEW MODE ROUTING: AUTHENTICATION vs CONSOLE
  // =========================================================================
  if (!hasSeenSplash) {
    return (
      <FirstLaunchSplash
        onGetStarted={() => {
          setHasSeenSplash(true);
          sessionStorage.setItem('in_v_protect_splash_seen', 'true');
        }}
      />
    );
  }

  // Direct Fullscreen Academy Video Lesson View (Reference Spec)
  if (activeNav === 'academy') {
    return (
      <VideoLessonHero
        onBackToDashboard={() => {
          setActiveNav('dashboard');
        }}
      />
    );
  }

  if (viewMode === 'auth') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#171717', position: 'relative' }}>
        {/* Floating Quick Reference Preview Button */}
        <div style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 100 }}>
          <button
            onClick={() => setActiveNav('academy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 92, 141, 0.15)',
              color: '#FF5C8D',
              border: '1px solid rgba(255, 92, 141, 0.35)',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.18s ease',
            }}
            title="Preview 16:9 Video Lesson Hero (Josh Garrison Reference Spec)"
          >
            <Video style={{ width: '14px', height: '14px' }} />
            🎓 Video Lesson Hero (16:9)
          </button>
        </div>
        {renderToastNotification()}
        {authFlowStep === 'FIRST_LAUNCH_REGISTER' && (
          <OwnerRegistration
            onSuccess={(regData) => {
              setPendingRegUserId(regData.user_id);
              setPendingRegEmail(regData.email);
              setPendingRegMaskedEmail(regData.masked_email);
              setPendingRegEmailConfigured(regData.email_provider_configured ?? true);
              setPendingRegSandboxOtp(regData.sandbox_otp || null);
              setAuthFlowStep('EMAIL_OTP_VERIFY');
              if (regData.sandbox_otp) {
                showToast(`Verification code auto-filled: ${regData.sandbox_otp}`);
              } else {
                showToast('Owner registered. Verification code auto-filled.');
              }
            }}
            onSwitchToLogin={() => setAuthFlowStep('SECURE_LOGIN')}
          />
        )}

        {authFlowStep === 'EMAIL_OTP_VERIFY' && (
          <EmailOtpVerification
            email={pendingRegEmail}
            maskedEmail={pendingRegMaskedEmail}
            emailConfigured={pendingRegEmailConfigured}
            initialSandboxOtp={pendingRegSandboxOtp}
            onSuccess={() => {
              setAuthFlowStep('IDENTITY_LIVENESS_VERIFY');
              showToast('Email verified! Proceed to Identity & Liveness verification.');
            }}
            onBack={() => setAuthFlowStep('FIRST_LAUNCH_REGISTER')}
          />
        )}

        {authFlowStep === 'IDENTITY_LIVENESS_VERIFY' && (
          <IdentityVerification
            userId={pendingRegUserId}
            onSuccess={() => {
              showToast('Identity verified! Account activated.');
              setAuthFlowStep('SECURE_LOGIN');
            }}
            onBack={() => setAuthFlowStep('EMAIL_OTP_VERIFY')}
          />
        )}

        {authFlowStep === 'SECURE_LOGIN' && (
          <SecureLogin
            initialEmail={pendingRegEmail}
            onSuccess={(profile) => {
              setOwnerProfile(profile);
              setAuthFlowStep('AUTHENTICATED');
              setViewMode('console');
              fetchSecurityData();
              showToast(`Welcome back, ${profile.full_name}! Security Shield active.`);
            }}
            onSwitchToRegister={() => setAuthFlowStep('FIRST_LAUNCH_REGISTER')}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {renderToastNotification()}

      {/* Main Top Header */}
      {/* Main Top Header - Premium Security Command Bar */}
      <header
        className="glossy-reflection"
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(8, 11, 15, 0.92)',
          backdropFilter: 'blur(20px) saturate(140%)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '12px 28px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Logo & Product Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(32, 217, 138, 0.08)',
                border: '1px solid rgba(32, 217, 138, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(32, 217, 138, 0.18)',
              }}
              className="animate-breathing"
            >
              <Shield style={{ width: '22px', height: '22px', color: '#20D98A' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.03em', margin: 0, color: '#FFFFFF' }}>
                  IN.V. PROTECT
                </h1>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#AEB7C2',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Personal Digital Security Layer for Investors
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#AEB7C2', margin: 0 }}>
                {language === 'en'
                  ? 'Continuous Device Firewall & Official Regulatory Verification Engine (SEBI, RBI, I4C grounded)'
                  : 'भारतीय निवेशकों के लिए निरंतर डिजिटल वित्तीय सुरक्षा एवं साक्ष्य सत्यापन प्रणाली'}
              </p>
            </div>
          </div>

          {/* Top Actions - Professional Command Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* System Protected Live Status Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(32, 217, 138, 0.08)',
                color: '#20D98A',
                border: '1px solid rgba(32, 217, 138, 0.28)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                boxShadow: '0 0 12px rgba(32, 217, 138, 0.12)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#20D98A',
                  boxShadow: '0 0 10px #20D98A',
                }}
                className="animate-breathing"
              />
              <span>● SYSTEM PROTECTED</span>
            </div>

            {/* Smartwatch Wrist Notification Preview */}
            <button
              type="button"
              onClick={() => setShowSmartwatchModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title="Preview minimal Smartwatch Wrist Alert HUD"
            >
              <Watch style={{ width: '13px', height: '13px', color: '#20D98A' }} />
              Watch Alert
            </button>

            {/* National Helpline 1930 Pill */}
            <a
              href="tel:1930"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 59, 59, 0.08)',
                color: '#FF5252',
                border: '1px solid rgba(255, 59, 59, 0.28)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.18s ease',
              }}
              title="National 24x7 Citizen Cyber Financial Fraud Helpline"
            >
              <PhoneCall style={{ width: '13px', height: '13px' }} />
              Helpline 1930
            </a>

            {/* 9-Step Threat Interception Demo Trigger */}
            <button
              onClick={() => {
                setDemoFlowStepIndex(0);
                setShowDemoFlowModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 176, 32, 0.08)',
                color: '#FFB020',
                border: '1px solid rgba(255, 176, 32, 0.28)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title="Run 9-Stage Fake SEBI Interception Demonstration"
            >
              <PlayCircle style={{ width: '13px', height: '13px', color: '#FFB020' }} />
              ⚡ 9-Step Threat Demo
            </button>

            {/* Academy 16:9 Video Lesson Hero Trigger (Josh Garrison Reference Spec) */}
            <button
              onClick={() => setActiveNav('academy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 92, 141, 0.12)',
                color: '#FF5C8D',
                border: '1px solid rgba(255, 92, 141, 0.35)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title="Open 16:9 Academy Video Player (Josh Garrison Reference)"
            >
              <Video style={{ width: '13px', height: '13px', color: '#FF5C8D' }} />
              🎓 Academy Lesson (16:9)
            </button>

            <button
              onClick={() => setShowVerifyModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <Search style={{ width: '13px', height: '13px', color: '#AEB7C2' }} />
              Verify SEBI ID
            </button>

            {/* 9-Stage Attack Demo Walkthrough Trigger */}
            <button
              onClick={() => {
                fetchSecurityData();
                setShowDemoFlowModal(true);
              }}
              style={{
                backgroundColor: 'rgba(255, 59, 59, 0.08)',
                color: '#FF5252',
                border: '1px solid rgba(255, 59, 59, 0.28)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title="Run interactive 9-stage scam interception walkthrough"
            >
              <PlayCircle style={{ width: '13px', height: '13px' }} />
              ⚡ 9-Stage Attack Demo
            </button>

            {/* Local Setup Wizard Button */}
            <button
              onClick={() => {
                setOnboardingStep(1);
                setShowOnboardingModal(true);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#AEB7C2',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <Sliders style={{ width: '13px', height: '13px' }} />
              Setup Wizard
            </button>

            {/* 3-Language Selector: English / हिन्दी / Hinglish */}
            <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.10)', padding: '2px' }}>
              {(['en', 'hi', 'hinglish'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    backgroundColor: language === lang ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    color: language === lang ? '#FFFFFF' : '#6F7A86',
                    border: 'none',
                    padding: '4px 9px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'Hinglish'}
                </button>
              ))}
            </div>

            {/* Owner Profile Badge & Quick Menu */}
            {ownerProfile && (
              <OwnerProfileBadge
                profile={ownerProfile}
                onOpenDevices={() => setShowDeviceModal(true)}
                onOpenSecurityPrivacy={() => setShowSecurityPrivacyModal(true)}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Container with Professional Sidebar */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)', backgroundColor: 'var(--bg-primary)' }}>
        {/* Professional FinTech Sidebar */}
        <AppSidebar
          activeNav={activeNav}
          onSelectNav={(nav: any) => setActiveNav(nav)}
          quarantineCount={quarantinedMessages.length}
          reviewCount={reviewMessages.length}
          incidentsCount={incidents.length}
          onEmergencyCall={() => window.open('tel:1930')}
        />

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '24px 32px', maxWidth: '1440px', overflowX: 'hidden', paddingBottom: '90px' }}>
          {/* ============================================================== */}
          {/* VIEW 1: DASHBOARD                                              */}
          {/* ============================================================== */}
          {activeNav === 'dashboard' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Primary Security Hero Component with Breathing Shield */}
              <SecurityStatusHero
                trustedCount={trustedMessages.length}
                reviewCount={reviewMessages.length}
                riskCount={quarantinedMessages.length}
                recentMessages={messages}
                lastScanTime="2 min ago"
                onSelectMessage={(msg) => {
                  setSelectedMessage(msg);
                  setActiveNav('messages');
                }}
                onNavigateVerify={() => setActiveNav('verify')}
                onNavigateAlerts={() => setActiveNav('alerts')}
                onNavigateFaceScan={() => setActiveNav('facescan')}
              />
            {/* ============================================================== */}
            {/* 1. SECURITY STATUS & IN V PROTECT SYSTEM BANNER                */}
            {/* ============================================================== */}
            <div
              className="glass-panel-primary glossy-reflection"
              style={{
                borderRadius: '20px',
                padding: '26px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
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
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#20D98A' }}>
                    CONTINUOUS INVESTOR DEFENSE ACTIVE
                  </span>
                  <span style={{ fontSize: '11px', color: '#6F7A86' }}>•</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#AEB7C2' }}>
                    SANGYAN HACKATHON (TRACKS A & E)
                  </span>
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  IN.V. PROTECT — Personal Digital Security Layer
                </h1>
                <p style={{ fontSize: '13px', color: '#AEB7C2', maxWidth: '720px', margin: 0, lineHeight: 1.55 }}>
                  Autonomous scam resilience and financial communication firewall for Indian investors. Grounded in statutory SEBI, RBI, I4C, and CERT-In advisories.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '12px', color: '#AEB7C2' }}>
                    Posture Score: <strong style={{ color: '#20D98A', fontWeight: 800 }}>{dailyReport?.posture_score || 96}/100</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#AEB7C2' }}>
                    Clean Rate: <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>{dailyReport?.clean_rate || '98.4%'}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#AEB7C2' }}>
                    Active Safeguards: <strong style={{ color: '#AEB7C2', fontWeight: 700 }}>3 Statutory Engines</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveNav('analyze')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    padding: '11px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <FileSearch style={{ width: '15px', height: '15px', color: '#20D98A' }} />
                  Deep Analysis Studio
                </button>
                <button
                  onClick={() => {
                    setActiveTierTab('quarantine');
                    const element = document.getElementById('protection-tiers-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: 'rgba(255, 59, 59, 0.08)',
                    color: '#FF5252',
                    border: '1px solid rgba(255, 59, 59, 0.28)',
                    padding: '11px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(255, 59, 59, 0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <AlertOctagon style={{ width: '15px', height: '15px' }} />
                  Quarantine Vault ({quarantinedMessages.length})
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 2. METRIC OVERVIEW COUNTERS (GLOSSY STATUS CARDS)             */}
            {/* ============================================================== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              {[
                { label: 'Devices Protected', val: overview?.devices_protected ?? 2, color: '#FFFFFF', icon: Laptop, tint: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.10)' },
                { label: 'Connected Sources', val: overview?.connected_sources ?? 6, color: '#FFFFFF', icon: Radio, tint: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.10)' },
                { label: 'Messages Analyzed', val: overview?.messages_analysed ?? messages.length, color: '#FFFFFF', icon: Inbox, tint: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.10)' },
                { label: 'Quarantined High-Risk', val: quarantinedMessages.length, color: '#FF5252', icon: AlertOctagon, tint: 'rgba(255, 59, 59, 0.08)', border: 'rgba(255, 59, 59, 0.25)' },
                { label: 'Review / Verify', val: reviewMessages.length, color: '#FFB020', icon: AlertTriangle, tint: 'rgba(255, 176, 32, 0.08)', border: 'rgba(255, 176, 32, 0.25)' },
                { label: 'Trusted / Important', val: trustedMessages.length, color: '#20D98A', icon: CheckCircle2, tint: 'rgba(32, 217, 138, 0.08)', border: 'rgba(32, 217, 138, 0.25)' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      borderRadius: '16px',
                      padding: '18px 20px',
                      border: `1px solid ${card.border}`,
                      backgroundColor: card.tint,
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '10px', color: '#6F7A86', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                        {card.label}
                      </span>
                      <Icon style={{ width: '16px', height: '16px', color: card.color }} />
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: card.color, letterSpacing: '-0.02em' }}>{card.val}</div>
                  </div>
                );
              })}
            </div>

            {/* ============================================================== */}
            {/* 3. INCOMING COMMUNICATION ANALYSIS (CORE ANALYSIS ENGINE)      */}
            {/* ============================================================== */}
            <div
              className="glass-panel-primary glossy-reflection"
              style={{
                borderRadius: '20px',
                padding: '26px 28px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
                    </div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                      Core Analysis Engine — Incoming Communication Inspector
                    </h2>
                  </div>
                  <p style={{ fontSize: '12px', color: '#AEB7C2', margin: '6px 0 0 0' }}>
                    Multi-stage deterministic & neural inspection pipeline grounded in statutory regulatory databases
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(32, 217, 138, 0.08)',
                    color: '#20D98A',
                    border: '1px solid rgba(32, 217, 138, 0.28)',
                    letterSpacing: '0.04em',
                  }}
                >
                  ZERO OTP INGRESS RULE ENFORCED
                </span>
              </div>

              {/* Connected Pipeline Flow Nodes (Section 8: 9-Stage Pipeline) */}
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#6F7A86' }}>
                    SOC Pipeline Architecture
                  </span>
                  <span style={{ fontSize: '10px', color: '#20D98A', fontWeight: 700 }}>
                    ● 9 Sequential Verification Stages Active
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                    gap: '8px',
                    position: 'relative',
                  }}
                >
                  {[
                    { step: '01', name: 'INCOMING' },
                    { step: '02', name: 'READ & NORM' },
                    { step: '03', name: 'OCR / TEXT' },
                    { step: '04', name: 'LANGUAGE' },
                    { step: '05', name: 'CLAIMS & ENT' },
                    { step: '06', name: 'SCAM SIGNALS' },
                    { step: '07', name: 'ML + RULES' },
                    { step: '08', name: 'VERIFICATION' },
                    { step: '09', name: 'RISK ENGINE' },
                  ].map((node, nIdx) => (
                    <div
                      key={nIdx}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontSize: '9px', fontWeight: 800, color: '#6F7A86', marginBottom: '2px' }}>
                        {node.step}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {node.name}
                      </div>
                      {nIdx < 8 && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            zIndex: 2,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Chips */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#6F7A86', fontWeight: 600 }}>Quick Test Samples:</span>
                {[
                  {
                    label: 'Fake Pre-IPO Guarantee (Fraud)',
                    text: 'URGENT: Exclusive Pre-IPO allotment for Tata Technologies at 70% discount. 200% return guaranteed within 14 days. Transfer funds to Escrow UPI ID: tatashares@icici immediately. Only 4 slots left.',
                  },
                  {
                    label: 'CBI Digital Arrest Call (Coercion)',
                    text: 'NOTICE FROM CENTRAL INVESTIGATION BUREAU (CBI): A parcel containing illegal debit cards and narcotics has been intercepted in your name. You are placed under DIGITAL ARREST. Join video call immediately.',
                  },
                  {
                    label: 'CDSL Demat Debit Alert (Legitimate)',
                    text: 'CDSL Alert: 50 shares of RELIANCE have been debited from your Demat Account 1208160000000000 on 2026-10-02 for exchange settlement. If not executed by you, contact DP.',
                  },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuickAnalyzeText(sample.text);
                      setQuickAnalyzeResult(null);
                    }}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      color: '#AEB7C2',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  value={quickAnalyzeText}
                  onChange={(e) => setQuickAnalyzeText(e.target.value)}
                  placeholder="Paste incoming communication (SMS, WhatsApp tip, Telegram group offer, unverified advisory, email alert)... Note: Any actual OTP, UPI PIN, or password will be automatically redacted before processing."
                  rows={3}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(8, 11, 15, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    lineHeight: 1.55,
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#6F7A86' }}>
                    🔒 PII Guarantee: OTPs (`[REDACTED_OTP]`), PINs (`[REDACTED_PIN]`), and passwords are never logged, stored, or transmitted.
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {quickAnalyzeText && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuickAnalyzeText('');
                          setQuickAnalyzeResult(null);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#AEB7C2',
                          border: 'none',
                          fontSize: '12px',
                          cursor: 'pointer',
                          padding: '6px 12px',
                        }}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleQuickAnalyze}
                      disabled={quickAnalyzeLoading || !quickAnalyzeText.trim()}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: quickAnalyzeLoading || !quickAnalyzeText.trim() ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {quickAnalyzeLoading ? (
                        <>
                          <RefreshCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                          Evaluating Engine...
                        </>
                      ) : (
                        <>
                          <FileSearch style={{ width: '14px', height: '14px', color: '#20D98A' }} />
                          Run Core Scam Inspection
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Scan Result Display */}
              {quickAnalyzeResult && (
                <div
                  style={{
                    marginTop: '20px',
                    backgroundColor: 'rgba(8, 11, 15, 0.90)',
                    border: `1px solid ${
                      quickAnalyzeResult.risk_level === 'High Concern'
                        ? 'rgba(255, 59, 59, 0.40)'
                        : quickAnalyzeResult.risk_level === 'Needs Verification'
                        ? 'rgba(255, 176, 32, 0.40)'
                        : 'rgba(32, 217, 138, 0.40)'
                    }`,
                    borderRadius: '14px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 12px',
                          borderRadius: '8px',
                          backgroundColor:
                            quickAnalyzeResult.risk_level === 'High Concern'
                              ? 'rgba(255, 59, 59, 0.12)'
                              : quickAnalyzeResult.risk_level === 'Needs Verification'
                              ? 'rgba(255, 176, 32, 0.12)'
                              : 'rgba(32, 217, 138, 0.12)',
                          color:
                            quickAnalyzeResult.risk_level === 'High Concern'
                              ? '#FF5252'
                              : quickAnalyzeResult.risk_level === 'Needs Verification'
                              ? '#FFB020'
                              : '#20D98A',
                          border: `1px solid ${
                            quickAnalyzeResult.risk_level === 'High Concern'
                              ? 'rgba(255, 59, 59, 0.30)'
                              : quickAnalyzeResult.risk_level === 'Needs Verification'
                              ? 'rgba(255, 176, 32, 0.30)'
                              : 'rgba(32, 217, 138, 0.30)'
                          }`,
                        }}
                      >
                        {quickAnalyzeResult.risk_level === 'High Concern'
                          ? '🛑 QUARANTINE / HIGH RISK'
                          : quickAnalyzeResult.risk_level === 'Needs Verification'
                          ? '⚠️ REVIEW / VERIFY'
                          : '🛡️ TRUSTED / IMPORTANT'}
                      </span>

                      {quickAnalyzeResult.detected_language && (
                        <span style={{ fontSize: '11px', color: '#AEB7C2', backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '3px 8px', borderRadius: '6px' }}>
                          Language: <strong style={{ color: '#FFFFFF' }}>{quickAnalyzeResult.detected_language.toUpperCase()}</strong>
                        </span>
                      )}

                      {quickAnalyzeResult.pii_redacted_stats && (
                        <span style={{ fontSize: '11px', color: '#AEB7C2', backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '3px 8px', borderRadius: '6px' }}>
                          PII Scrubbed: <strong style={{ color: '#20D98A' }}>{quickAnalyzeResult.pii_redacted_stats.total_redactions} elements</strong>
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '11px', color: '#6F7A86' }}>
                      Confidence: {quickAnalyzeResult.confidence_or_uncertainty?.level ?? 'HIGH'}
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#FFFFFF', marginBottom: '14px' }}>
                    {quickAnalyzeResult.explanation}
                  </p>

                  {/* Signals & Evidence Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#AEB7C2', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Detected Scam Signals ({quickAnalyzeResult.detected_signals.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {quickAnalyzeResult.detected_signals.map((sig, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '12px', color: '#FF7B7B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF3B3B' }} />
                            <span><strong>{sig.name}:</strong> {sig.description || sig.name}</span>
                          </div>
                        ))}
                        {quickAnalyzeResult.detected_signals.length === 0 && (
                          <div style={{ fontSize: '12px', color: '#20D98A' }}>No predatory scam signals detected.</div>
                        )}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#AEB7C2', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Official Regulatory Verification ({quickAnalyzeResult.evidence.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {quickAnalyzeResult.evidence.map((ev, eIdx) => (
                          <div key={eIdx} style={{ fontSize: '12px', color: '#FFFFFF' }}>
                            <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                              <span>{ev.publisher} — {ev.title}</span>
                              <span style={{ fontSize: '10px', color: ev.verification_status === 'CONTRADICTED' ? '#FF5252' : '#20D98A' }}>
                                {ev.verification_status || 'VERIFIED'}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#AEB7C2', marginTop: '2px' }}>{ev.passage.slice(0, 110)}...</div>
                          </div>
                        ))}
                        {quickAnalyzeResult.evidence.length === 0 && (
                          <div style={{ fontSize: '12px', color: '#6F7A86' }}>Grounded in standard regulatory knowledge base.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* ============================================================== */}
            {/* 4. 3 PROTECTION TIERS: QUARANTINE / REVIEW / TRUSTED           */}
            {/* ============================================================== */}
            <div
              id="protection-tiers-section"
              className="glass-panel-primary glossy-reflection"
              style={{
                borderRadius: '20px',
                padding: '26px 28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    3 Protection Tiers — Risk Engine Classification
                  </h2>
                  <p style={{ fontSize: '12px', color: '#AEB7C2', margin: '4px 0 0 0' }}>
                    Communications triaged into Quarantine (High Risk), Review (Verify), and Trusted (Important). Suspicious items are never auto-deleted.
                  </p>
                </div>

                {/* Tier Switcher Segmented Control */}
                <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255, 255, 255, 0.10)' }}>
                  {[
                    { id: 'quarantine', label: '🛑 Quarantine / High Risk', count: quarantinedMessages.length, color: '#FF5252' },
                    { id: 'review', label: '⚠️ Review / Verify', count: reviewMessages.length, color: '#FFB020' },
                    { id: 'trusted', label: '🛡️ Trusted / Important', count: trustedMessages.length, color: '#20D98A' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTierTab(tab.id as any)}
                      style={{
                        backgroundColor: activeTierTab === tab.id ? 'rgba(255, 255, 255, 0.10)' : 'transparent',
                        color: activeTierTab === tab.id ? '#FFFFFF' : '#AEB7C2',
                        border: activeTierTab === tab.id ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid transparent',
                        borderRadius: '8px',
                        padding: '7px 16px',
                        fontSize: '12px',
                        fontWeight: activeTierTab === tab.id ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeTierTab === tab.id ? '0 4px 16px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)' : 'none',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <span style={{ color: activeTierTab === tab.id ? tab.color : '#AEB7C2' }}>{tab.label}</span>
                      <span style={{ fontSize: '10px', backgroundColor: 'rgba(255, 255, 255, 0.10)', color: '#FFFFFF', padding: '2px 7px', borderRadius: '10px', fontWeight: 800 }}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TIER 1: QUARANTINE / HIGH RISK */}
              {activeTierTab === 'quarantine' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: 'rgba(255, 59, 59, 0.08)', border: '1px solid rgba(255, 59, 59, 0.25)', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#FF7B7B' }}>
                    <strong>Quarantine Rule:</strong> High-risk communications are isolated to prevent accidental payment, link clicks, or credential disclosure. <em>IN.V. PROTECT never automatically deletes communications without explicit investor confirmation.</em>
                  </div>

                  {quarantinedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="glass-panel"
                      style={{
                        backgroundColor: 'rgba(255, 59, 59, 0.04)',
                        border: '1px solid rgba(255, 59, 59, 0.28)',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', backgroundColor: 'rgba(255, 59, 59, 0.15)', color: '#FF5252', border: '1px solid rgba(255, 59, 59, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF3B3B' }} />
                            QUARANTINED
                          </span>
                          <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{msg.sender}</strong>
                          <span style={{ fontSize: '11px', color: '#AEB7C2' }}>via {msg.source_channel} • {msg.timestamp}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setEvidenceModalMessage(msg)}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              color: '#FFFFFF',
                              border: '1px solid rgba(255, 255, 255, 0.14)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Evidence Package
                          </button>
                          <button
                            onClick={() => setReportConfirmMessage(msg)}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.10)',
                              color: '#FFFFFF',
                              border: '1px solid rgba(255, 255, 255, 0.18)',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            User-Confirmed Report
                          </button>
                          <button
                            onClick={() => handleMessageAction(msg.id, 'release')}
                            style={{
                              backgroundColor: 'rgba(255, 176, 32, 0.08)',
                              color: '#FFB020',
                              border: '1px solid rgba(255, 176, 32, 0.30)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Release
                          </button>
                          <button
                            onClick={() => handleMessageAction(msg.id, 'delete')}
                            style={{
                              backgroundColor: 'rgba(255, 59, 59, 0.12)',
                              color: '#FF5252',
                              border: '1px solid rgba(255, 59, 59, 0.30)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                        {msg.content}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12px', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <span style={{ color: '#FF7B7B' }}>
                          <strong>Isolation Reason:</strong> {msg.quarantine_reason || 'Critical scam indicators detected.'}
                        </span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {msg.detected_signals.map((sig, sIdx) => (
                            <span key={sIdx} style={{ fontSize: '10px', backgroundColor: 'rgba(255, 59, 59, 0.15)', color: '#FF7B7B', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(255, 59, 59, 0.25)' }}>
                              {sig.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {quarantinedMessages.length === 0 && (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#AEB7C2', fontSize: '13px' }}>
                      No messages in quarantine. Your inbox and notification streams are safe.
                    </div>
                  )}
                </div>
              )}

              {/* TIER 2: REVIEW / VERIFY */}
              {activeTierTab === 'review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: 'rgba(255, 176, 32, 0.08)', border: '1px solid rgba(255, 176, 32, 0.25)', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#FFB020' }}>
                    <strong>Verification Required:</strong> Contains unverified investment claims, unregistered market tipsters, or unverified claims. Inspect evidence before trusting.
                  </div>

                  {reviewMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="glass-panel"
                      style={{
                        backgroundColor: 'rgba(255, 176, 32, 0.04)',
                        border: '1px solid rgba(255, 176, 32, 0.28)',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', backgroundColor: 'rgba(255, 176, 32, 0.15)', color: '#FFB020', border: '1px solid rgba(255, 176, 32, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFB020' }} />
                            REVIEW / VERIFY
                          </span>
                          <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{msg.sender}</strong>
                          <span style={{ fontSize: '11px', color: '#AEB7C2' }}>via {msg.source_channel} • {msg.timestamp}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setEvidenceModalMessage(msg)}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              color: '#FFFFFF',
                              border: '1px solid rgba(255, 255, 255, 0.14)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Evidence Package
                          </button>
                          <button
                            onClick={() => handleMessageAction(msg.id, 'mark_safe')}
                            style={{
                              backgroundColor: 'rgba(32, 217, 138, 0.08)',
                              color: '#20D98A',
                              border: '1px solid rgba(32, 217, 138, 0.28)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Mark Safe
                          </button>
                          <button
                            onClick={() => handleMessageAction(msg.id, 'quarantine')}
                            style={{
                              backgroundColor: 'rgba(255, 59, 59, 0.10)',
                              color: '#FF5252',
                              border: '1px solid rgba(255, 59, 59, 0.28)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            Move to Quarantine
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                        {msg.content}
                      </p>

                      <div style={{ fontSize: '12px', color: '#FFB020', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <strong>Evaluation:</strong> {msg.snippet}
                      </div>
                    </div>
                  ))}

                  {reviewMessages.length === 0 && (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#AEB7C2', fontSize: '13px' }}>
                      No communications pending review.
                    </div>
                  )}
                </div>
              )}

              {/* TIER 3: TRUSTED / IMPORTANT */}
              {activeTierTab === 'trusted' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ backgroundColor: 'rgba(32, 217, 138, 0.08)', border: '1px solid rgba(32, 217, 138, 0.25)', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#20D98A' }}>
                    <strong>Authorized Communications:</strong> Official notices from SEBI-registered depositories, stock exchanges, or verified financial institutions.
                  </div>

                  {trustedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="glass-panel"
                      style={{
                        backgroundColor: 'rgba(32, 217, 138, 0.04)',
                        border: '1px solid rgba(32, 217, 138, 0.28)',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', backgroundColor: 'rgba(32, 217, 138, 0.15)', color: '#20D98A', border: '1px solid rgba(32, 217, 138, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#20D98A' }} />
                            TRUSTED / IMPORTANT
                          </span>
                          <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{msg.sender}</strong>
                          <span style={{ fontSize: '11px', color: '#AEB7C2' }}>via {msg.source_channel} • {msg.timestamp}</span>
                        </div>

                        <span style={{ fontSize: '11px', color: '#20D98A', fontWeight: 700 }}>
                          ✓ Authoritative Source Confirmed
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#FFFFFF', margin: '0 0 12px 0' }}>
                        {msg.content}
                      </p>

                      <div style={{ fontSize: '12px', color: '#20D98A', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <strong>Verification:</strong> {msg.snippet}
                      </div>
                    </div>
                  ))}

                  {trustedMessages.length === 0 && (
                    <div style={{ padding: '36px', textAlign: 'center', color: '#AEB7C2', fontSize: '13px' }}>
                      No trusted communications recorded yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* 5. DAILY SECURITY REPORT & INVESTOR SAFETY REVIEW (2-COL)      */}
            {/* ============================================================== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
              {/* Daily Security Report (Section 10) */}
              <div
                className="glass-panel-primary glossy-reflection"
                style={{
                  borderRadius: '20px',
                  padding: '26px 28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(32, 217, 138, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck style={{ width: '16px', height: '16px', color: '#20D98A' }} />
                    </div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Daily Security Report</h2>
                  </div>
                  <span style={{ fontSize: '11px', color: '#AEB7C2', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '3px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    {dailyReport?.date || 'Today'}
                  </span>
                </div>

                {/* Large 96 Posture Score Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '18px', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ textAlign: 'center', minWidth: '90px' }}>
                    <div style={{ fontSize: '42px', fontWeight: 900, color: '#20D98A', lineHeight: 1, letterSpacing: '-0.03em', textShadow: '0 0 20px rgba(32, 217, 138, 0.35)' }}>
                      {dailyReport?.posture_score || 96}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6F7A86', textTransform: 'uppercase', marginTop: '6px', fontWeight: 800, letterSpacing: '0.10em' }}>
                      POSTURE SCORE
                    </div>
                  </div>
                  <div style={{ flex: 1, fontSize: '12px', lineHeight: 1.55, color: '#AEB7C2' }}>
                    {dailyReport?.executive_summary || 'All protective barriers operational. Continuous threat isolation active with zero unquarantined vulnerabilities.'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>{dailyReport?.scans_today || 4}</div>
                    <div style={{ fontSize: '10px', color: '#6F7A86', marginTop: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Scans Today</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#FF5252' }}>{dailyReport?.threats_neutralized ?? 2}</div>
                    <div style={{ fontSize: '10px', color: '#6F7A86', marginTop: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Neutralized</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '12px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#20D98A' }}>{dailyReport?.clean_rate || '50.0%'}</div>
                    <div style={{ fontSize: '10px', color: '#6F7A86', marginTop: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Clear Rate</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#6F7A86', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.08em' }}>
                    Active Safeguard Protocols
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(dailyReport?.active_safeguards || [
                      'Zero-OTP Ingress Quarantine Rule',
                      'Multi-lingual Language & PII Redactor',
                      'SEBI/RBI/I4C Regulatory Evidence RAG',
                    ]).map((sf, idx) => (
                      <div key={idx} style={{ fontSize: '12px', color: '#AEB7C2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 style={{ width: '14px', height: '14px', color: '#20D98A', flexShrink: 0 }} />
                        <span>{sf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Investor Safety Review (Section 11: Enterprise Security Checklist) */}
              <div
                className="glass-panel-primary glossy-reflection"
                style={{
                  borderRadius: '20px',
                  padding: '26px 28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
                    </div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Investor Safety Review</h2>
                  </div>
                  <span style={{ fontSize: '11px', color: '#20D98A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#20D98A' }} />
                    Audited {safetyReview?.last_audited || 'Just now'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '14px 18px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                      Compliance Status: {safetyReview?.overall_status || 'RESILIENT'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6F7A86' }}>
                      5-Point Investor Digital Hygiene Security Audit
                    </div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#20D98A', letterSpacing: '-0.02em' }}>
                    {safetyReview?.safety_score || 92}%
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(safetyReview?.checklist || [
                    { id: 'CHK-01', title: 'SEBI Intermediary Verification', status: 'PASSED', description: 'Cross-checked against SEBI registered entities.' },
                    { id: 'CHK-02', title: 'Zero-OTP / PIN Isolation', status: 'ACTIVE', description: 'Zero banking or broker credential exposure.' },
                    { id: 'CHK-03', title: 'Hardware Passkey & 2FA', status: 'ACTIVE', description: 'Passkey/WebAuthn authenticated owner session.' },
                    { id: 'CHK-04', title: 'Escrow & Direct Merchant UPI', status: 'PASSED', description: 'All merchant transfers checked against NPCI whitelist.' },
                    { id: 'CHK-05', title: 'Misinformation & Deepfake Scrub', status: 'VERIFIED', description: 'High-yield claims verified against statutory circulars.' },
                  ]).map((item: any, idx: number) => {
                    const isPassed = item.status === 'PASSED' || item.status === 'ACTIVE';
                    const isVerified = item.status === 'VERIFIED' || item.status === 'ENFORCED';
                    const isWarning = item.status === 'WARNING';

                    const pillBg = isPassed
                      ? 'rgba(32, 217, 138, 0.12)'
                      : isVerified
                      ? 'rgba(255, 176, 32, 0.12)'
                      : isWarning
                      ? 'rgba(255, 159, 28, 0.12)'
                      : 'rgba(255, 59, 59, 0.12)';

                    const pillColor = isPassed
                      ? '#20D98A'
                      : isVerified
                      ? '#FFB020'
                      : isWarning
                      ? '#FF9F1C'
                      : '#FF5252';

                    const pillBorder = isPassed
                      ? 'rgba(32, 217, 138, 0.30)'
                      : isVerified
                      ? 'rgba(255, 176, 32, 0.30)'
                      : isWarning
                      ? 'rgba(255, 159, 28, 0.30)'
                      : 'rgba(255, 59, 59, 0.30)';

                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '10px',
                          padding: '11px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{item.title}</div>
                          <div style={{ fontSize: '11px', color: '#AEB7C2' }}>{item.description}</div>
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            backgroundColor: pillBg,
                            color: pillColor,
                            border: `1px solid ${pillBorder}`,
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 6. LIVE SCAM & SPAM TRENDS (SECTION 12)                        */}
            {/* ============================================================== */}
            <div
              className="glass-panel-primary glossy-reflection"
              style={{
                borderRadius: '20px',
                padding: '26px 28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(255, 59, 59, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp style={{ width: '16px', height: '16px', color: '#FF5252' }} />
                    </div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                      Live Scam & Spam Trends — Grounded in SEBI, RBI & I4C Advisories
                    </h2>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 176, 32, 0.12)',
                        color: '#FFB020',
                        border: '1px solid rgba(255, 176, 32, 0.28)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      DEMO / SIMULATED FEED
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#AEB7C2', margin: '4px 0 0 0' }}>
                    Tracking active threat syndicates targeting Indian retail investors across WhatsApp, Telegram, SMS, and deepfake media.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['SEBI Circular PR 12/2024', 'RBI Advisory DOR.No.STR.REC.47', 'I4C MHA 2024/09'].map((adv, idx) => (
                    <span key={idx} style={{ fontSize: '10px', color: '#AEB7C2', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      {adv}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {(scamTrends?.trends || [
                  {
                    trend_id: 'TRD-01',
                    title: 'Fake IPO Allotment & Grey Market Syndicates',
                    surge_level: '+320% Surge (Simulated)',
                    target_vector: 'WhatsApp & Telegram Channels',
                    modus_operandi: 'Scammers promise guaranteed allotment in oversubscribed IPOs via institutional quotas.',
                    regulatory_warning: 'SEBI Circular PR 12/2024 warns retail investors that all IPO applications must flow through ASBA.',
                    defensive_advice: 'Never transfer funds to private individual bank accounts for IPO applications.',
                    risk_severity: 'CRITICAL',
                  },
                  {
                    trend_id: 'TRD-02',
                    title: 'Digital Arrest & Law Enforcement Video Coercion',
                    surge_level: '+180% Surge (Simulated)',
                    target_vector: 'Direct Mobile Calls & Skype/WhatsApp Video',
                    modus_operandi: 'Impersonators posing as CBI/Customs/Police claim money-laundering parcel found in victim name.',
                    regulatory_warning: 'I4C and MHA advisory states that no police or judiciary agency conducts digital arrest.',
                    defensive_advice: 'Hang up immediately and dial National Cybercrime Helpline 1930.',
                    risk_severity: 'CRITICAL',
                  },
                  {
                    trend_id: 'TRD-03',
                    title: 'Deepfake Celebrity Trading & AI Bot Endorsements',
                    surge_level: '+240% Surge (Simulated)',
                    target_vector: 'Facebook, Instagram & YouTube Ad Feeds',
                    modus_operandi: 'AI-generated voice/video clones of business leaders endorsing automated algorithmic funds.',
                    regulatory_warning: 'SEBI and CERT-In advisories mandate verifying registered intermediary status.',
                    defensive_advice: 'Cross-check firm registration number on official SEBI SCORES portal.',
                    risk_severity: 'HIGH',
                  },
                  {
                    trend_id: 'TRD-04',
                    title: 'Guaranteed 40% Monthly Return "Institutional PMS"',
                    surge_level: '+140% Surge (Simulated)',
                    target_vector: 'Telegram Groups & SMS Stock Tips',
                    modus_operandi: 'Claims SEBI registration with forged registration certificates promising guaranteed gains.',
                    regulatory_warning: 'SEBI prohibits any registered entity from offering assured returns or profit sharing.',
                    defensive_advice: 'Any assured return promise is per se illegal under SEBI Regulations.',
                    risk_severity: 'HIGH',
                  },
                ]).map((trend: any, idx: number) => {
                  const isCritical = trend.risk_severity === 'CRITICAL';
                  return (
                    <div
                      key={idx}
                      className="glass-panel"
                      style={{
                        backgroundColor: isCritical ? 'rgba(255, 59, 59, 0.03)' : 'rgba(255, 176, 32, 0.03)',
                        border: `1px solid ${isCritical ? 'rgba(255, 59, 59, 0.25)' : 'rgba(255, 176, 32, 0.25)'}`,
                        borderRadius: '14px',
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              backgroundColor: isCritical ? 'rgba(255, 59, 59, 0.15)' : 'rgba(255, 176, 32, 0.15)',
                              color: isCritical ? '#FF5252' : '#FF9F1C',
                              border: `1px solid ${isCritical ? 'rgba(255, 59, 59, 0.35)' : 'rgba(255, 176, 32, 0.35)'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isCritical ? '#FF3B3B' : '#FF9F1C' }} />
                            {trend.risk_severity}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: isCritical ? '#FF5252' : '#FFB020' }}>
                            {trend.surge_level}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                          {trend.title}
                        </h3>

                        <div style={{ fontSize: '11px', color: '#AEB7C2', marginBottom: '8px' }}>
                          Vector: <strong style={{ color: '#FFFFFF' }}>{trend.target_vector}</strong>
                        </div>

                        <p style={{ fontSize: '12px', color: '#AEB7C2', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                          {trend.modus_operandi}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', marginTop: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#FFFFFF', marginBottom: '4px' }}>
                          <strong style={{ color: '#20D98A' }}>Defensive Rule:</strong> {trend.defensive_advice}
                        </div>
                        <div style={{ fontSize: '10px', color: '#6F7A86' }}>
                          Authority: {trend.regulatory_warning.slice(0, 75)}...
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ============================================================== */}
            {/* 7. CONNECTED SECURITY ENVIRONMENT (SECTION 13: 6 CHANNELS)     */}
            {/* ============================================================== */}
            <div
              className="glass-panel-primary glossy-reflection"
              style={{
                borderRadius: '20px',
                padding: '26px 28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Connected Security Environment — 6 Protected Channels
                  </h2>
                  <p style={{ fontSize: '12px', color: '#AEB7C2', margin: '4px 0 0 0' }}>
                    Zero-OTP Ingress Guarantee: Sensitive credentials, UPI PINs, ATM PINs, and passwords are never collected, stored, or exposed.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('integrations')}
                  style={{ fontSize: '12px', color: '#FFFFFF', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s ease' }}
                >
                  Manage Ingestion Posture →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.10)', textAlign: 'left', color: '#6F7A86' }}>
                      <th style={{ padding: '10px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CHANNEL</th>
                      <th style={{ padding: '10px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CATEGORY</th>
                      <th style={{ padding: '10px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>INTEGRATION POSTURE</th>
                      <th style={{ padding: '10px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PRIVACY & SENSITIVE DATA BOUNDARY</th>
                      <th style={{ padding: '10px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrations.map((itg) => (
                      <tr key={itg.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#FFFFFF' }}>{itg.name}</td>
                        <td style={{ padding: '12px 14px', color: '#AEB7C2' }}>{itg.category}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              backgroundColor: itg.is_real ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 176, 32, 0.12)',
                              color: itg.is_real ? '#38bdf8' : '#FFB020',
                              border: `1px solid ${itg.is_real ? 'rgba(56, 189, 248, 0.30)' : 'rgba(255, 176, 32, 0.30)'}`,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {itg.is_real ? 'REAL CONNECTOR' : 'DEMO / SIMULATED'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#AEB7C2', fontSize: '12px' }}>
                          {itg.security_guarantee}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: itg.status === 'CONNECTED' ? '#20D98A' : itg.status === 'AVAILABLE' ? '#AEB7C2' : '#FFB020',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: itg.status === 'CONNECTED' ? '#20D98A' : itg.status === 'AVAILABLE' ? '#AEB7C2' : '#FFB020',
                              }}
                            />
                            {itg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: SECURE MESSAGES                                        */}
        {/* ============================================================== */}
        {activeNav === 'messages' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Real-Time Message Analysis Sequential Pipeline */}
            <MessageAnalysisPipeline
              onAnalyzeText={async (text) => {
                const res = await fetch('/api/analyze', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text, channel: 'manual_submission', language }),
                });
                if (!res.ok) throw new Error('Analysis request failed');
                const d = await res.json();
                fetchSecurityData();
                return d;
              }}
              onAnalyzeImage={async (file) => {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('channel', 'screenshot');
                fd.append('language', language);
                const res = await fetch('/api/analyze-upload', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('Screenshot analysis failed');
                const d = await res.json();
                fetchSecurityData();
                return d;
              }}
              onQuarantineMessage={(_text, _analysis) => {
                fetchSecurityData();
                setActiveNav('alerts');
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Continuous Financial Communication Stream</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  All incoming communications evaluated against regulatory fraud signatures and sorted into 3 tiers.
                </p>
              </div>

              {/* Tier Filter Tabs */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {[
                  { id: 'all', label: 'All Stream', count: messages.length },
                  { id: 'important', label: '🟢 Important / Trusted', count: messages.filter(m => m.protection_tier === 'Trusted / Important').length },
                  { id: 'review', label: '🟡 Review / Verify', count: messages.filter(m => m.protection_tier === 'Review / Verify').length },
                  { id: 'quarantine', label: '🔴 Quarantined Threats', count: quarantinedMessages.length },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setActiveMessageTier(tier.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: activeMessageTier === tier.id ? 'var(--bg-card)' : 'transparent',
                      color: activeMessageTier === tier.id ? '#ffffff' : 'var(--text-muted)',
                    }}
                  >
                    {tier.label} ({tier.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Message List Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredMessages.map((msg) => {
                const badge = getRiskBadge(msg.risk_level);
                return (
                  <div
                    key={msg.id}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: `1px solid ${msg.protection_tier === 'Quarantined / High Risk' ? 'rgba(239, 68, 68, 0.35)' : 'var(--border-color)'}`,
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: '#60a5fa',
                          }}
                        >
                          {msg.source_channel}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{msg.sender}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{msg.timestamp}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            marginLeft: 'auto',
                          }}
                        >
                          {badge.label}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: getTierColor(msg.protection_tier),
                          }}
                        >
                          {msg.protection_tier}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', lineHeight: 1.5 }}>
                        {msg.content}
                      </p>

                      {/* Signals & Verification Badges */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {msg.detected_signals.map((sig, sidx) => (
                          <span
                            key={sidx}
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontWeight: 600,
                            }}
                          >
                            ⚠ {sig.name}
                          </span>
                        ))}
                        {msg.claims.map((clm, cidx) => (
                          <span
                            key={cidx}
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'var(--bg-card)',
                              color: clm.verification_status === 'Contradicted' ? '#f87171' : clm.verification_status === 'Supported' ? '#34d399' : '#fbbf24',
                              border: '1px solid var(--border-color)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            Claim: {clm.verification_status}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '7px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Inspect Analysis
                      </button>

                      {msg.protection_tier === 'Quarantined / High Risk' ? (
                        <>
                          <button
                            onClick={() => handleMessageAction(msg.id, 'release')}
                            style={{
                              backgroundColor: 'rgba(251, 191, 36, 0.15)',
                              color: '#fbbf24',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            Release from Quarantine
                          </button>
                          <button
                            onClick={() => {
                              const inc = incidents.find(i => i.incident_id.includes(msg.id.replace('MSG-', '')));
                              if (inc) setReportingIncident(inc);
                              else showToast('Incident package ready. Direct to 1930.');
                            }}
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            Report Suspect (1930)
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleMessageAction(msg.id, 'quarantine')}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.12)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          Quarantine
                        </button>
                      )}

                      <button
                        onClick={() => handleMessageAction(msg.id, 'delete')}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'var(--text-faint)',
                          padding: '4px 10px',
                          fontSize: '11px',
                          textAlign: 'center',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  No communications found in this tier.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: ANALYZE (Existing Working Pipeline Preserved)           */}
        {/* ============================================================== */}
        {activeNav === 'analyze' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MessageAnalysisPipeline
              onAnalyzeText={async (text) => {
                const res = await fetch('/api/analyze', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text, channel: 'manual_submission', language }),
                });
                if (!res.ok) throw new Error('Analysis request failed');
                const d = await res.json();
                fetchSecurityData();
                return d;
              }}
              onAnalyzeImage={async (file) => {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('channel', 'screenshot');
                fd.append('language', language);
                const res = await fetch('/api/analyze-upload', { method: 'POST', body: fd });
                if (!res.ok) throw new Error('Screenshot analysis failed');
                const d = await res.json();
                fetchSecurityData();
                return d;
              }}
              onQuarantineMessage={(_text, _analysis) => {
                fetchSecurityData();
                setActiveNav('alerts');
              }}
              initialText={inputText}
            />
            {/* 1-Click Interactive Test Cases */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-faint)', letterSpacing: '0.05em' }}>
                  ⚡ 1-Click Interactive Test Cases:
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {demoExamples.map((demo) => {
                  const isHigh = demo.title.includes('High Concern') || demo.title.includes('Scam') || demo.title.includes('Theft');
                  const isVerification = demo.title.includes('Needs Verification') || demo.title.includes('Ambiguous');
                  const color = isHigh ? '#f87171' : isVerification ? '#fbbf24' : '#34d399';
                  return (
                    <button
                      key={demo.id}
                      onClick={() => handleLoadDemo(demo)}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{demo.title}</span>
                      </div>
                      <ArrowRight style={{ width: '14px', height: '14px', color: 'var(--text-faint)' }} />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Input Selection Tabs */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                {[
                  { id: 'text', label: 'Direct Text / SMS / Chat', icon: FileText },
                  { id: 'image', label: 'Screenshot / OCR Scan', icon: Upload },
                  { id: 'url', label: 'Financial Link / URL Inspector', icon: Globe },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setError(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                        color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                        fontWeight: activeTab === tab.id ? 700 : 500,
                        borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none',
                      }}
                    >
                      <Icon style={{ width: '16px', height: '16px' }} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: '20px' }}>
                {activeTab === 'text' && (
                  <div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste suspicious SMS, Telegram/WhatsApp post, guaranteed return offer, or Demat notice here..."
                      rows={5}
                      style={{ width: '100%', resize: 'vertical', fontSize: '14px', lineHeight: 1.5, marginBottom: '14px' }}
                    />
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !inputText.trim()}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        opacity: loading || !inputText.trim() ? 0.6 : 1,
                      }}
                    >
                      {loading ? 'Evaluating Regulatory Signatures & RAG...' : 'Perform Evidence-Based Analysis'}
                    </button>
                  </div>
                )}

                {activeTab === 'image' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      style={{ marginBottom: '14px' }}
                    />
                    {imagePreview && (
                      <div style={{ marginBottom: '14px', maxWidth: '300px' }}>
                        <img src={imagePreview} alt="Screenshot Preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                      </div>
                    )}
                    <button
                      onClick={handleAnalyzeUpload}
                      disabled={loading || !selectedFile}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        opacity: loading || !selectedFile ? 0.6 : 1,
                      }}
                    >
                      {loading ? 'Processing OCR & Signatures...' : 'Scan Screenshot'}
                    </button>
                  </div>
                )}

                {activeTab === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://example-trading-app.top/apk/terminal.apk"
                      style={{ width: '100%', marginBottom: '14px' }}
                    />
                    <button
                      onClick={handleAnalyzeUrl}
                      disabled={loading || !inputUrl.trim()}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        opacity: loading || !inputUrl.trim() ? 0.6 : 1,
                      }}
                    >
                      {loading ? 'Inspecting Registry & TLD...' : 'Inspect URL'}
                    </button>
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: '14px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '13px' }}>
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* URL Result Card */}
            {urlAnalysisResult && (
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>Domain Security Assessment</h3>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  Risk Rating: <strong style={{ color: urlAnalysisResult.risk_rating === 'High Concern' ? '#f87171' : '#34d399' }}>{urlAnalysisResult.risk_rating}</strong>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{urlAnalysisResult.action_guidance}</div>
                {urlAnalysisResult.signals && (
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {urlAnalysisResult.signals.map((sig: string, i: number) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Deep Analysis Result Card (Truthful Assessment & Verified Evidence) */}
            {analysisResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Result Header Badge */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: `1px solid ${analysisResult.risk_level === 'High Concern' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: getTierColor(analysisResult.protection_tier || 'Review / Verify'), marginBottom: '4px' }}>
                      ASSESSED RISK CLASSIFICATION • {analysisResult.protection_tier || 'PROTECTION TIER ASSIGNED'}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800 }}>{analysisResult.risk_level}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {analysisResult.risk_level === 'High Concern' ? (
                        <span>
                          <strong style={{ color: '#f87171' }}>High Concern</strong> —{' '}
                          {analysisResult.detected_signals.filter(s => s.severity === 'critical' || s.severity === 'high').length} high-severity indicator(s) detected
                        </span>
                      ) : analysisResult.risk_level === 'Needs Verification' ? (
                        <span>
                          <strong style={{ color: '#fbbf24' }}>Needs Verification</strong> — Requires independent statutory registry check
                        </span>
                      ) : (
                        <span>
                          <strong style={{ color: '#34d399' }}>Low Concern</strong> — No acute scam signals detected
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>{analysisResult.detected_signals.length}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>Red Flags</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa' }}>{analysisResult.extracted_claims.length}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>Claims</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 16px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>{analysisResult.evidence.length}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>Regulatory Citations</div>
                    </div>
                  </div>
                </div>

                {/* Evidence-Based Assessment Summary */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#60a5fa', marginBottom: '10px' }}>
                    📋 Evidence-Based Assessment
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                    {analysisResult.explanation}
                  </p>
                </div>

                {/* Two Columns: Triggered Signals & Claims */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {/* Triggered Signals */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <AlertTriangle style={{ width: '18px', height: '18px', color: '#f87171' }} />
                      <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Triggered Fraud Indicators ({analysisResult.detected_signals.length})</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {analysisResult.detected_signals.map((sig) => (
                        <div key={sig.id} style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f87171' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>{sig.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sig.description}</div>
                        </div>
                      ))}
                      {analysisResult.detected_signals.length === 0 && (
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No high-severity fraud indicators triggered.</div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Claims with Verification */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <FileSearch style={{ width: '18px', height: '18px', color: '#60a5fa' }} />
                      <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Extracted Claims & Official Verification</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {analysisResult.extracted_claims.map((claim, idx) => {
                        const ver = analysisResult.claim_verifications?.[idx];
                        const statusColor = ver?.verification_status === 'Contradicted' ? '#f87171' : ver?.verification_status === 'Supported' ? '#34d399' : '#fbbf24';
                        return (
                          <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700 }}>{claim.claim_type}</span>
                              {ver && (
                                <span style={{ fontSize: '11px', fontWeight: 700, color: statusColor }}>
                                  {ver.verification_status}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>"{claim.claim_text}"</div>
                            {ver && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ver.verification_notes}</div>}
                          </div>
                        );
                      })}
                      {analysisResult.extracted_claims.length === 0 && (
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No explicit factual assertions extracted.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Authoritative Regulatory Evidence Cards */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <Database style={{ width: '18px', height: '18px', color: '#34d399' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Authoritative Regulatory Evidence (SEBI / I4C / RBI / CERT-In)</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                    {analysisResult.evidence.map((ev, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>{ev.publisher}</span>
                          <a href={ev.url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Verify Source <ExternalLink style={{ width: '11px', height: '11px' }} />
                          </a>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>{ev.title}</div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>"{ev.passage}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contextual Safe Actions & Escalation Links */}
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <ShieldCheck style={{ width: '18px', height: '18px', color: '#34d399' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Recommended Safe Actions</h3>
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '16px' }}>
                    {analysisResult.safe_next_steps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>
                    ))}
                  </ul>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Official Verification & Incident Redressal Portals:
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {analysisResult.official_source_links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{link.title}</span>
                          <ExternalLink style={{ width: '12px', height: '12px', color: '#60a5fa' }} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: QUARANTINE VAULT & ISOLATION FIREWALL                  */}
        {/* ============================================================== */}
        {(activeNav === 'alerts' || activeNav === 'quarantine') && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Investor Quarantine & Protection Manager */}
            <QuarantineManager
              quarantinedMessages={quarantinedMessages}
              onReleaseMessage={(id) => handleMessageAction(id, 'release')}
              onDeleteMessage={(id) => handleMessageAction(id, 'delete')}
              onReportMessage={(msg) => setReportConfirmMessage(msg)}
            />
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <AlertOctagon style={{ width: '32px', height: '32px', color: '#f87171', flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f87171', margin: 0 }}>
                  Quarantine Security Vault ({quarantinedMessages.length} Threats Isolated)
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
                  High-risk communications are isolated from standard views to prevent accidental credential sharing or payment execution.
                  Sangyan AI never permanently deletes communications without investor approval.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {quarantinedMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '10px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                        QUARANTINED
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>{msg.sender}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>({msg.source_channel} • {msg.timestamp})</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleMessageAction(msg.id, 'release')}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          color: '#fbbf24',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Release to Review
                      </button>
                      <button
                        onClick={() => {
                          const inc = incidents.find(i => i.incident_id.includes(msg.id.replace('MSG-', '')));
                          if (inc) setReportingIncident(inc);
                          else showToast('Evidence package ready. Directing to 1930.');
                        }}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Report Suspect (1930)
                      </button>
                      <button
                        onClick={() => handleMessageAction(msg.id, 'delete')}
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-main)', marginBottom: '12px' }}>
                    {msg.content}
                  </p>

                  <div style={{ fontSize: '12px', color: '#f87171', backgroundColor: 'var(--bg-card)', padding: '10px 12px', borderRadius: '6px' }}>
                    <strong>Isolation Reason:</strong> {msg.quarantine_reason || 'Critical scam indicators detected.'}
                  </div>
                </div>
              ))}

              {quarantinedMessages.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  No messages in quarantine. Your inbox and notification streams are safe.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: BIOMETRIC FACE SCAN STUDIO                               */}
        {/* ============================================================== */}
        {activeNav === 'facescan' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FaceScanStudio
              ownerProfile={ownerProfile}
              onNavigateDashboard={() => setActiveNav('dashboard')}
              onNavigateVerify={() => setActiveNav('verify')}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: OFFICIAL CLAIM VERIFICATION                             */}
        {/* ============================================================== */}
        {activeNav === 'verify' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <OfficialClaimVerifier
              onVerifyQuery={async (q) => {
                const res = await fetch('/api/verify-entity', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ query: q }),
                });
                return await res.json();
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW: STATUTORY REPORTS & FRAUD INTELLIGENCE                   */}
        {/* ============================================================== */}
        {activeNav === 'reports' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Statutory Intelligence & Scam Trend Reports</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Continuous investor safety intelligence grounded in authoritative circulars and enforcement notices from SEBI, I4C, and RBI.
              </p>
            </div>

            {/* Daily Security Review Scorecard */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Daily Investor Defense Scorecard</h3>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '4px' }}>
                  ACTIVE DEFENSE
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Security Posture Score</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>{dailyReport?.posture_score || 94}/100</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>High resilience to digital fraud attacks</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Clean Stream Rate</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#06b6d4', marginTop: '6px' }}>{dailyReport?.clean_rate || '98.4%'}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Verified communications delivered safely</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Threats Isolated</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#ef4444', marginTop: '6px' }}>{quarantinedMessages.length}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Suspicious messages moved to quarantine</div>
                </div>
              </div>
            </div>

            {/* Emerging Scam Patterns */}
            {scamTrends && (
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Emerging Fraud Patterns in Indian Financial Markets</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {scamTrends.trends?.map((tr: any, idx: number) => (
                    <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{tr.pattern_name || tr.title}</strong>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                          {tr.threat_level || 'HIGH ALERT'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{tr.description || tr.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: EVIDENCE & OFFICIAL SOURCES                            */}
        {/* ============================================================== */}
        {activeNav === 'evidence' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  OFFICIAL EVIDENCE
                </h2>
                <p style={{ fontSize: '13px', color: '#A7A7A7', margin: 0 }}>
                  Security investigation dossier grounded in authoritative regulatory advisories from SEBI, RBI, I4C, and CERT-In.
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(2, 195, 154, 0.08)',
                  color: '#02C39A',
                  border: '1px solid rgba(2, 195, 154, 0.25)',
                }}
              >
                Zero Fabrications • Real Registries
              </span>
            </div>

            {/* SEBI ID / Registration Format Instant Verifier Card */}
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                SEBI Registration / Intermediary Format Verifier
              </h3>
              <p style={{ fontSize: '12px', color: '#A7A7A7', margin: '0 0 16px 0' }}>
                Test any claimed broker (INZ), research analyst (INH), or investment adviser (INA) code format directly against SEBI standards.
              </p>
              <div style={{ display: 'flex', gap: '10px', maxWidth: '600px', marginBottom: '14px' }}>
                <input
                  type="text"
                  value={verifyQuery}
                  onChange={(e) => setVerifyQuery(e.target.value)}
                  placeholder="e.g. INA00012345 or Zerodha"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '13px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#02C39A';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                  }}
                />
                <button
                  onClick={handleVerifyEntity}
                  disabled={verifyLoading}
                  style={{
                    backgroundColor: '#02C39A',
                    color: '#171717',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: verifyLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {verifyLoading ? 'Checking...' : 'Verify'}
                </button>
              </div>

              {verifyResult && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: verifyResult.is_valid_format ? '#10B981' : '#EF4444', marginBottom: '4px' }}>
                    {verifyResult.status}
                  </div>
                  <div style={{ fontSize: '12px', color: '#A7A7A7', marginBottom: '10px', lineHeight: 1.5 }}>
                    {verifyResult.advisory}
                  </div>
                  <a
                    href={verifyResult.official_verification_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '12px',
                      color: '#02C39A',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Confirm on official SEBI register <ExternalLink style={{ width: '12px', height: '12px' }} />
                  </a>
                </div>
              )}
            </div>

            {/* Official Evidence Investigation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
              {officialSources.map((src) => (
                <div
                  key={src.source_id}
                  className="glass-panel"
                  style={{
                    borderRadius: '14px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
                        {src.publisher}
                      </span>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                        ✓ Source checked
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px 0' }}>
                      {src.title}
                    </h4>

                    <div style={{ fontSize: '12px', color: '#A7A7A7', marginBottom: '16px', lineHeight: 1.6 }}>
                      {src.description}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '11px', color: '#666666' }}>
                      {src.source_id} • Official Circular
                    </span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#02C39A',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        textDecoration: 'none',
                      }}
                    >
                      <span>Open Official Source</span>
                      <ExternalLink style={{ width: '12px', height: '12px' }} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 6: DEVICES HUB                                            */}
        {/* ============================================================== */}
        {activeNav === 'devices' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Investor Protected Device Ecosystem</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Multi-endpoint coordination: deep desktop inspection, real-time smartphone notification filtering, and rapid haptic triage watch alerts.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {devices.map((dev) => (
                <div
                  key={dev.device_id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {dev.device_type === 'Smartwatch Companion' ? (
                          <Watch style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
                        ) : dev.device_type === 'Mobile Smartphone' ? (
                          <Smartphone style={{ width: '24px', height: '24px', color: '#38bdf8' }} />
                        ) : (
                          <Laptop style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
                        )}
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{dev.name}</h3>
                          <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{dev.device_type}</span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: dev.status === 'PROTECTED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                          color: dev.status === 'PROTECTED' ? '#34d399' : '#fbbf24',
                        }}
                      >
                        {dev.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                      {dev.role_description}
                    </p>

                    <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                      Active Capabilities:
                    </div>
                    <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--text-main)', marginBottom: '16px' }}>
                      {dev.capabilities.map((cap, i) => (
                        <li key={i}>{cap}</li>
                      ))}
                    </ul>
                  </div>

                  {dev.device_type === 'Smartwatch Companion' ? (
                    <button
                      onClick={handleTriggerWatchAlert}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Watch style={{ width: '14px', height: '14px' }} />
                      Dispatch Watch Haptic Alert Demo
                    </button>
                  ) : (
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                      Last synchronization: {dev.last_sync}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 7: INTEGRATIONS                                           */}
        {/* ============================================================== */}
        {activeNav === 'integrations' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Communication & Account Ingestion Connectors</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Sangyan AI does NOT claim magical access to private accounts. Integrations use explicit user authorization,
                supported OS notification listeners, or transparent simulation stubs.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {integrations.map((itg) => (
                <div
                  key={itg.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: itg.is_real ? 'rgba(56, 189, 248, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                          color: itg.is_real ? '#38bdf8' : '#fbbf24',
                        }}
                      >
                        {itg.is_real ? 'REAL CONNECTOR' : 'DEMO / SIMULATED'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: itg.status === 'CONNECTED' ? '#34d399' : '#fbbf24' }}>
                        {itg.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{itg.name}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
                      {itg.description}
                    </p>

                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 700 }}>PRIVACY GUARANTEE:</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-main)', marginTop: '2px' }}>{itg.security_guarantee}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                    {itg.notes || 'Integration architecture active.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 8: INCIDENTS & OFFICIAL REPORTING                         */}
        {/* ============================================================== */}
        {activeNav === 'incidents' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Fraud Incident Response & Evidence Packages</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Exportable evidence dossiers and investor-confirmed escalation to official national platforms (1930 / Chakshu / SCORES).
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {incidents.map((inc) => (
                <div
                  key={inc.incident_id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '2px 8px', borderRadius: '4px' }}>
                          {inc.severity} THREAT
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{inc.title}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        {inc.incident_id} • Detected via {inc.source_channel} from {inc.sender} ({inc.timestamp})
                      </span>
                    </div>

                    <button
                      onClick={() => setReportingIncident(inc)}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      Export Evidence & Report →
                    </button>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '12px' }}>
                    <strong>Recommended Safeguard:</strong> {inc.recommended_action}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {inc.detected_signals.map((sig, i) => (
                      <span key={i} style={{ fontSize: '11px', backgroundColor: 'var(--bg-card)', color: '#f87171', padding: '2px 8px', borderRadius: '4px' }}>
                        • {sig}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {incidents.length === 0 && (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  No active threat incidents logged.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 9: PRIVACY & DATA PROTECTION CENTER                       */}
        {/* ============================================================== */}
        {activeNav === 'privacy' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Investor Privacy & Zero-Knowledge Architecture</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Sangyan AI is a SECURITY LAYER, NOT a centralized bank database. We never record confidential credentials.
              </p>
            </div>

            {privacyStatus && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                  🛡 LIVE SECURITY & PRIVACY TELEMETRY
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--text-faint)' }}>Encryption:</span> <strong style={{ color: 'var(--text-main)' }}>{privacyStatus.encryption_standard}</strong></div>
                  <div><span style={{ color: 'var(--text-faint)' }}>Password Storage:</span> <strong style={{ color: '#34d399' }}>{privacyStatus.password_storage}</strong></div>
                  <div><span style={{ color: 'var(--text-faint)' }}>OTP Retention:</span> <strong style={{ color: '#34d399' }}>{privacyStatus.otp_storage}</strong></div>
                  <div><span style={{ color: 'var(--text-faint)' }}>Audit Retention:</span> <strong style={{ color: 'var(--text-main)' }}>{privacyStatus.evidence_retention_days} Days (Configurable)</strong></div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Zero Password Storage', desc: 'Login passwords, MPINs, and account secrets are never saved to disk or persistent storage under any condition.', icon: Lock, status: 'GUARANTEED' },
                { title: 'Zero OTP Storage', desc: 'One-Time Passwords (OTPs) and 2FA tokens are scrubbed in volatile memory during preprocessing.', icon: ShieldAlert, status: 'GUARANTEED' },
                { title: 'Local / On-Device Scrubbing', desc: 'PII scrubbing occurs on-device prior to vector evaluation or external verification lookups.', icon: Cpu, status: 'ACTIVE' },
                { title: 'Cryptographic Encryption', desc: 'All local caches encrypted with AES-256; network transit secured via strict TLS 1.3.', icon: Database, status: 'ENFORCED' },
                { title: 'Configurable Retention', desc: 'Audit records and evidence packages are retained for 30 days by default, fully purgeable at user discretion.', icon: RefreshCw, status: '30 DAYS' },
                { title: 'User-Confirmed Reporting', desc: 'Sangyan NEVER silently files complaints. All reporting to 1930 / Chakshu / SCORES requires explicit user review.', icon: CheckCircle2, status: 'ENFORCED' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <Icon style={{ width: '20px', height: '20px', color: '#34d399' }} />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 10: ARCHITECTURE                                          */}
        {/* ============================================================== */}
        {activeNav === 'architecture' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  System Architecture & Data Flow
                </span>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  TRACK A CORE + TRACK E SUPPORTING
                </span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Continuous Investor Digital Security Layer</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '780px' }}>
                Defensive digital security architecture: continuously intercepts and normalizes financial communications, performs multi-engine scam intelligence, verifies claims against official registries, and isolates threats in a quarantine vault under full investor control.
              </p>
            </div>

            {/* Visual Pipeline Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', maxWidth: '920px', margin: '0 auto', width: '100%' }}>
              
              {/* STAGE 1: USER DEVICES */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #38bdf8', borderRadius: '12px', padding: '18px 22px', boxShadow: '0 4px 16px rgba(56, 189, 248, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Laptop style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>STAGE 1: INVESTOR DEVICE ECOSYSTEM</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    3 TIERS ACTIVE
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '12px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                      <Laptop style={{ width: '14px', height: '14px', color: '#60a5fa' }} /> PC Workstation / Browser
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Full dashboard, deep ML forensic analysis, URL inspection, and evidence dossiers.
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                      <Smartphone style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> Mobile Smartphone
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      OS-permitted financial SMS listener, email alerts, and screenshot OCR uploads.
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                      <Watch style={{ width: '14px', height: '14px', color: '#fbbf24' }} /> Smartwatch Companion
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Zero data-processing endpoint. Low-latency haptic alerts and 1-tap "Open Sangyan" action.
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#38bdf8', fontWeight: 900 }}>↓</div>

              {/* STAGE 2: COMMUNICATION INGESTION */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #60a5fa', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Radio style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#60a5fa' }}>STAGE 2: COMMUNICATION INGESTION CONNECTORS</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    REALISTIC ARCHITECTURE
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginBottom: '10px' }}>
                  Unified ingestion layer using explicit user authorization, standard OS notification hooks, browser extensions, and manual input. No unrestricted access to private apps.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Financial SMS', status: 'REAL' },
                    { label: 'Email Headers', status: 'REAL' },
                    { label: 'Browser Protection', status: 'REAL' },
                    { label: 'User OCR / Screenshots', status: 'REAL' },
                    { label: 'Manual Text & URLs', status: 'REAL' },
                    { label: 'Banking Notification Hook', status: 'DEMO / SIMULATED' },
                    { label: 'Broker Push Hook', status: 'DEMO / SIMULATED' },
                  ].map((src, i) => (
                    <span key={i} style={{ fontSize: '11px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '6px', color: '#ffffff' }}>
                      {src.label} <strong style={{ color: src.status === 'REAL' ? '#34d399' : '#fbbf24', marginLeft: '4px' }}>[{src.status}]</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#60a5fa', fontWeight: 900 }}>↓</div>

              {/* STAGE 3: NORMALIZATION & PRIVACY SCRUBBING */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #818cf8', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock style={{ width: '20px', height: '20px', color: '#818cf8' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#818cf8' }}>STAGE 3: NORMALIZATION & FINANCIAL PRIVACY FIREWALL</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    ZERO SECRETS STORED
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px' }}>
                    <strong style={{ color: '#ffffff' }}>Local Sanitization:</strong> Passwords, OTPs, PINs, UPI PINs, Aadhaar, and PAN are scrubbed locally before analysis. Zero credential storage.
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px' }}>
                    <strong style={{ color: '#ffffff' }}>Multilingual Normalization:</strong> Cross-lingual entity extraction supporting English, Devanagari Hindi, and romanized Hinglish formats.
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#818cf8', fontWeight: 900 }}>↓</div>

              {/* STAGE 4: HYBRID AI SCAM INTELLIGENCE (3 BRANCHES) */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '2px solid #a78bfa', borderRadius: '12px', padding: '18px 22px', boxShadow: '0 4px 20px rgba(167, 139, 250, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu style={{ width: '20px', height: '20px', color: '#a78bfa' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#a78bfa' }}>STAGE 4: HYBRID AI SCAM INTELLIGENCE (PARALLEL EXECUTION)</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', backgroundColor: 'rgba(167, 139, 250, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    MULTI-SIGNAL SYNTHESIS
                  </span>
                </div>
                
                {/* 3 Parallel Engines */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#a78bfa', marginBottom: '4px' }}>
                      Branch A: ML Classifier
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      TF-IDF n-gram vectorizer + calibrated logistic regression trained on domestic Indian financial fraud corpora. Outputs calibrated scam intent probabilities.
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#a78bfa', marginBottom: '4px' }}>
                      Branch B: Statutory Rules
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Deterministic rules for guaranteed returns, OTP/PIN harvesting, APK downloads, personal UPI transfers, Demat threats, and fee-before-withdrawal.
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(167, 139, 250, 0.3)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#a78bfa', marginBottom: '4px' }}>
                      Branch C: Claim Extraction
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Identifies regulatory claims ("SEBI approved this app", "RBI requires payment", "Broker OTP required") and dispatches them for official verification.
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#a78bfa', fontWeight: 900 }}>↓</div>

              {/* STAGE 5: OFFICIAL SOURCE VERIFICATION */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #c084fc', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 style={{ width: '20px', height: '20px', color: '#c084fc' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#c084fc' }}>STAGE 5: OFFICIAL SOURCE VERIFICATION & REGISTRY AUDIT</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', backgroundColor: 'rgba(192, 132, 252, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    AUTHORITY-FIRST
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginBottom: '10px' }}>
                  Cross-checks claims in real time against authoritative source registries: <strong>1. SEBI</strong>, <strong>2. RBI</strong>, <strong>3. I4C / Cybercrime Portal</strong>, <strong>4. CERT-In</strong>, and <strong>5. Verified Institutions</strong>.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '11px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>SUPPORTED:</span> Verified against official register.
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>CONTRADICTED:</span> Directly violates statutory directives.
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>UNVERIFIED:</span> "Evidence not independently verified."
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#c084fc', fontWeight: 900 }}>↓</div>

              {/* STAGE 6: EVIDENCE RETRIEVAL (RAG) */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #e879f9', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Database style={{ width: '20px', height: '20px', color: '#e879f9' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#e879f9' }}>STAGE 6: EVIDENCE RETRIEVAL (RAG) & CITATION PROVENANCE</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    ZERO HALLUCINATIONS
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Retrieves verbatim advisory excerpts and statutory circulars with publisher domain, document ID, URL, and verification status. Retrieved text is treated strictly as analytical evidence, never as prompt instructions.
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#e879f9', fontWeight: 900 }}>↓</div>

              {/* STAGE 7: DYNAMIC RISK DECISION ENGINE */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #f43f5e', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAlert style={{ width: '20px', height: '20px', color: '#f43f5e' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#f43f5e' }}>STAGE 7: DYNAMIC RISK DECISION ENGINE</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', backgroundColor: 'rgba(244, 63, 94, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    CALIBRATED 0–100 SCORE
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Synthesizes statistical ML confidence, deterministic rule triggers, and claim contradiction severity. No hardcoded verdicts; every classification reflects active input characteristics.
                </div>
              </div>

              {/* Connector Arrow */}
              <div style={{ fontSize: '18px', color: '#f43f5e', fontWeight: 900 }}>↓</div>

              {/* STAGE 8: THREE-TIER MESSAGE PROTECTION */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '2px solid #3b82f6', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Inbox style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#3b82f6' }}>STAGE 8: THREE-TIER MESSAGE PROTECTION MODEL</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    ZERO AUTO-DELETE
                  </span>
                </div>
                
                {/* 3 Outcome Buckets */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
                      🟢 Trusted / Important
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Verified financial communication from authenticated entities with valid signatures. Displayed prominently in the investor's primary inbox.
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
                      🟡 Review / Verify
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Uncertain or unknown senders with unverified claims. Kept accessible with action options: [VERIFY], [VIEW], [ALLOW], [REPORT].
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f87171', marginBottom: '4px' }}>
                      🔴 Quarantined / High Risk
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Strong scam indicators. Hidden from normal views and placed into Quarantine Vault. Never auto-deleted; user retains release and report controls.
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow from Quarantine */}
              <div style={{ fontSize: '18px', color: '#f87171', fontWeight: 900 }}>↓</div>

              {/* STAGE 9: INCIDENT RESPONSE & REPORTING */}
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', border: '1px solid #10b981', borderRadius: '12px', padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle style={{ width: '20px', height: '20px', color: '#10b981' }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>STAGE 9: INCIDENT RESPONSE & USER-CONFIRMED REPORTING</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    USER IN FULL CONTROL
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ color: '#ffffff' }}>Evidence Dossier Package:</strong> Compiles raw text, sender signatures, suspicious URLs, detected rules, and official regulatory citations into a 1-click exportable JSON dossier.
                  </div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ color: '#ffffff' }}>Official Statutory Channels:</strong> Guides users to report directly to National Cyber Crime Reporting Portal (cybercrime.gov.in), Helpline 1930, I4C Chakshu, and SEBI SCORES.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 11: SETTINGS & LOCAL USER MODE                           */}
        {/* ============================================================== */}
        {activeNav === 'settings' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Investor Configuration
                </span>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                  LOCAL USER MODE
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Settings & Protection Preferences</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Configure continuous firewall policies, device alert dispatch thresholds, and privacy retention rules.
              </p>
            </div>

            {/* Zero Auto-Delete Enforced Guarantee Banner */}
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <ShieldCheck style={{ width: '28px', height: '28px', color: '#34d399', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#34d399', marginBottom: '2px' }}>
                  ENFORCED SAFETY PRINCIPLE: ZERO AUTOMATIC DELETION
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {settings?.no_auto_delete_guarantee || 'Sangyan AI guarantees that suspected communications are never permanently deleted automatically. Suspected threats are moved to Quarantine where you retain full authority to inspect, release, export, or report.'}
                </div>
              </div>
            </div>

            {/* SECTION 1: PROTECTION PROFILES (3 TIERS) */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Protection Profile</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Select the sensitivity of Sangyan AI's defensive firewall across your active communication channels.
                  </p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '3px 10px', borderRadius: '12px' }}>
                  CURRENT: {settings?.protection_level || 'ENHANCED'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {[
                  {
                    level: 'STANDARD' as ProtectionLevel,
                    title: 'Standard Protection',
                    desc: 'Flags high-confidence threats (OTP/password harvesting, APK downloads, guaranteed returns). Minimum interference with daily chats.',
                    accent: '#38bdf8',
                  },
                  {
                    level: 'ENHANCED' as ProtectionLevel,
                    title: 'Enhanced Protection (Recommended)',
                    desc: 'Proactive inspection. Flags unverified financial claims, suspicious WhatsApp/Telegram trading channels, and unknown broker URLs.',
                    accent: '#3b82f6',
                  },
                  {
                    level: 'STRICT' as ProtectionLevel,
                    title: 'Strict Zero-Trust',
                    desc: 'Strict firewall policy. Automatically quarantines communications from unverified senders containing financial or regulatory assertions.',
                    accent: '#8b5cf6',
                  },
                ].map((tier) => {
                  const isCurrent = (settings?.protection_level || 'ENHANCED') === tier.level;
                  return (
                    <div
                      key={tier.level}
                      onClick={() => handleUpdateSettings({ protection_level: tier.level })}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: isCurrent ? `2px solid ${tier.accent}` : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isCurrent ? `0 0 12px ${tier.accent}33` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isCurrent ? tier.accent : '#ffffff' }}>
                          {tier.title}
                        </span>
                        {isCurrent && (
                          <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: tier.accent, color: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {tier.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: DEVICE & ALERT PREFERENCES */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Device & Notification Preferences</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Control how alerts are dispatched to your PC, smartphone, and smartwatch.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    key: 'watch_haptics_enabled' as const,
                    title: 'Smartwatch Haptic Triage Alerts',
                    desc: 'Dispatch emergency vibration patterns to Smartwatch Companion on high-risk OTP or credential threats.',
                    val: settings?.watch_haptics_enabled ?? true,
                  },
                  {
                    key: 'desktop_alerts_enabled' as const,
                    title: 'Desktop Notification Popups',
                    desc: 'Show immediate workstation notifications when high-risk links or APK invitations are intercepted.',
                    val: settings?.desktop_alerts_enabled ?? true,
                  },
                  {
                    key: 'local_processing_only' as const,
                    title: 'Strict Local Processing Mode',
                    desc: 'Enforce 100% on-device heuristic & rule analysis without auxiliary outbound lookups.',
                    val: settings?.local_processing_only ?? false,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      padding: '14px 18px',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <button
                      onClick={() => handleUpdateSettings({ [item.key]: !item.val })}
                      style={{
                        backgroundColor: item.val ? '#2563eb' : 'var(--bg-secondary)',
                        color: item.val ? '#ffffff' : 'var(--text-faint)',
                        border: '1px solid var(--border-color)',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        minWidth: '70px',
                      }}
                    >
                      {item.val ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: DATA RETENTION & PURGE CONTROLS */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Data Retention & Local Audit Storage</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    All logs are retained locally on your devices with zero cloud credential persistence.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Retention:</span>
                  <select
                    value={settings?.evidence_retention_days || 30}
                    onChange={(e) => handleUpdateSettings({ evidence_retention_days: Number(e.target.value) })}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: '#ffffff',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value={7}>7 Days</option>
                    <option value={15}>15 Days</option>
                    <option value={30}>30 Days (Default)</option>
                    <option value={60}>60 Days</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171' }}>Purge Local Audit Logs & Cache</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Permanently clears local SQLite incident audit logs and normalized message caches.
                  </div>
                </div>
                <button
                  onClick={handlePurgeLogs}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px solid #ef4444',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Purge All Local Logs
                </button>
              </div>
            </div>

            {/* SECTION 4: ONBOARDING WIZARD RE-RUN */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Protection Setup Wizard</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Revisit the 4-step onboarding guide to configure devices, channels, and firewall rules.
                </p>
              </div>
              <button
                onClick={() => {
                  setOnboardingStep(1);
                  setShowOnboardingModal(true);
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Launch Setup Wizard
              </button>
            </div>

          </div>
        )}
        </main>
      </div>

      {/* Mobile Responsive Bottom Navigation */}
      <MobileNavBar
        activeNav={activeNav}
        onSelectNav={(nav: any) => setActiveNav(nav)}
        alertCount={quarantinedMessages.length}
      />

      {/* Smartwatch Companion Minimal Wrist Alert Modal */}
      <SmartwatchAlertModal
        isOpen={showSmartwatchModal}
        onClose={() => setShowSmartwatchModal(false)}
        alertData={watchAlertData}
        onViewDetails={() => {
          setShowSmartwatchModal(false);
          setActiveNav('alerts');
        }}
      />

      {/* ============================================================== */}
      {/* MODAL 1: MESSAGE DETAIL VIEW                                   */}
      {/* ============================================================== */}
      {selectedMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: getTierColor(selectedMessage.protection_tier) }}>
                  {selectedMessage.protection_tier.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Message Security Assessment</h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} style={{ background: 'none', color: 'var(--text-faint)' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '4px' }}>
                Sender: <strong>{selectedMessage.sender}</strong> ({selectedMessage.source_channel} • {selectedMessage.timestamp})
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                {selectedMessage.content}
              </p>
            </div>

            {selectedMessage.quarantine_reason && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '14px' }}>
                <strong>Quarantine Reason:</strong> {selectedMessage.quarantine_reason}
              </div>
            )}

            {/* Claims & Verification */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Extracted Claims & Official Verification:
              </div>
              {selectedMessage.claims.map((clm, i) => (
                <div key={i} style={{ backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: '6px', marginBottom: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600 }}>"{clm.claim_text}"</span>
                    <span style={{ fontWeight: 700, color: clm.verification_status === 'Contradicted' ? '#f87171' : clm.verification_status === 'Supported' ? '#34d399' : '#fbbf24' }}>
                      {clm.verification_status}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>{clm.verification_notes}</div>
                </div>
              ))}
            </div>

            {/* Evidence items */}
            {selectedMessage.evidence.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Authoritative Evidence Passages:
                </div>
                {selectedMessage.evidence.map((ev, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: '6px', marginBottom: '6px', fontSize: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>{ev.publisher} — {ev.title}</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>"{ev.passage}"</div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              {selectedMessage.protection_tier === 'Quarantined / High Risk' ? (
                <>
                  <button
                    onClick={() => handleMessageAction(selectedMessage.id, 'release')}
                    style={{ backgroundColor: 'var(--bg-card)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
                  >
                    Release to Review
                  </button>
                  <button
                    onClick={() => {
                      const inc = incidents.find(i => i.incident_id.includes(selectedMessage.id.replace('MSG-', '')));
                      if (inc) setReportingIncident(inc);
                      else showToast('Directing to National Cybercrime Helpline 1930.');
                    }}
                    style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
                  >
                    Report Suspect (1930)
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleMessageAction(selectedMessage.id, 'quarantine')}
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
                >
                  Quarantine Message
                </button>
              )}
              <button
                onClick={() => handleMessageAction(selectedMessage.id, 'delete')}
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: SMARTWATCH ALERT SIMULATION                           */}
      {/* ============================================================== */}
      {watchAlertData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: '#000000',
              border: '2px solid #ef4444',
              borderRadius: '32px',
              maxWidth: '360px',
              width: '100%',
              padding: '24px',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 0 32px rgba(239, 68, 68, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <Watch style={{ width: '36px', height: '36px', color: '#ef4444' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              HAPTIC VIBRATION: {watchAlertData.haptic_pattern}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f87171', marginBottom: '8px' }}>
              {watchAlertData.header}
            </h3>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.4 }}>
              {watchAlertData.preview}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  setWatchAlertData(null);
                  setActiveNav('quarantine');
                }}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}
              >
                Open Sangyan Shield on Phone
              </button>
              <button
                onClick={() => {
                  setWatchAlertData(null);
                  showToast('1-Tap Watch Quarantine Confirmed');
                }}
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.25)', color: '#f87171', border: '1px solid #ef4444', padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}
              >
                1-Tap Quarantine
              </button>
              <button
                onClick={() => setWatchAlertData(null)}
                style={{ background: 'none', color: '#94a3b8', fontSize: '11px', padding: '6px' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: REPORTING & EVIDENCE PACKAGE EXPORT                   */}
      {/* ============================================================== */}
      {reportingIncident && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f87171' }}>OFFICIAL INCIDENT ESCALATION</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>National Reporting & Evidence Dossier</h3>
              </div>
              <button onClick={() => setReportingIncident(null)} style={{ background: 'none', color: 'var(--text-faint)' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Sangyan AI does NOT silently file complaints on your behalf. Follow the official guidelines below to report this threat directly to statutory cybercrime and regulatory helplines.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {reportingIncident.official_reporting_channels.map((ch, idx) => (
                <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>{ch.name}</span>
                    {ch.helpline && (
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#f87171' }}>{ch.helpline}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, marginBottom: '6px' }}>{ch.instruction}</p>
                  <a href={ch.url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Launch Official Reporting Portal <ExternalLink style={{ width: '12px', height: '12px' }} />
                  </a>
                </div>
              ))}
            </div>

            {/* Evidence Package JSON viewer */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                  Exportable Evidence Package (JSON):
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(reportingIncident.evidence_package, null, 2));
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    color: copiedText ? '#34d399' : '#60a5fa',
                    border: '1px solid var(--border-color)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Copy style={{ width: '11px', height: '11px' }} />
                  {copiedText ? 'Copied Evidence!' : 'Copy Dossier'}
                </button>
              </div>

              <pre
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                }}
              >
                {JSON.stringify(reportingIncident.evidence_package, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setReportingIncident(null)}
                style={{ backgroundColor: 'var(--bg-card)', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: VERIFY SEBI ID POPUP                                  */}
      {/* ============================================================== */}
      {showVerifyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', maxWidth: '520px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>SEBI Intermediary ID Format Checker</h3>
              <button onClick={() => setShowVerifyModal(false)} style={{ background: 'none', color: 'var(--text-faint)' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input
                type="text"
                value={verifyQuery}
                onChange={(e) => setVerifyQuery(e.target.value)}
                placeholder="e.g. INA00012345 or INH00000123"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleVerifyEntity}
                disabled={verifyLoading}
                style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontWeight: 700 }}
              >
                {verifyLoading ? 'Checking...' : 'Check'}
              </button>
            </div>

            {verifyResult && (
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: verifyResult.is_valid_format ? '#34d399' : '#f87171', marginBottom: '4px' }}>
                  {verifyResult.status}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{verifyResult.advisory}</div>
                <a href={verifyResult.official_verification_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Open SEBI Master Register <ExternalLink style={{ width: '12px', height: '12px' }} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowVerifyModal(false)} style={{ backgroundColor: 'var(--bg-card)', color: '#ffffff', padding: '6px 14px', borderRadius: '6px', fontSize: '12px' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: 9-STAGE ATTACK DEMO WALKTHROUGH (SECTION 19)          */}
      {/* ============================================================== */}
      {showDemoFlowModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    TRACK A CORE ARCHITECTURE DEMO
                  </span>
                  <span style={{ fontSize: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    DEMO / SIMULATED FLOW
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                  9-Stage Scam Interception & Incident Response
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Interactive end-to-end simulation of a fake SEBI impersonation threat flowing through Sangyan AI's defensive firewall.
                </p>
              </div>
              <button onClick={() => setShowDemoFlowModal(false)} style={{ background: 'none', color: 'var(--text-faint)', padding: '4px' }}>
                <X style={{ width: '22px', height: '22px' }} />
              </button>
            </div>

            {/* Stepper Dots / Stage Numbers */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
              {(demoAttackFlow?.steps || []).map((step: DemoAttackStep, idx) => {
                const isActive = demoFlowStepIndex === idx;
                const isPast = demoFlowStepIndex > idx;
                return (
                  <button
                    key={step.step_number}
                    onClick={() => setDemoFlowStepIndex(idx)}
                    style={{
                      flex: 1,
                      minWidth: '55px',
                      padding: '8px 4px',
                      backgroundColor: isActive ? '#2563eb' : isPast ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-card)',
                      color: isActive ? '#ffffff' : isPast ? '#60a5fa' : 'var(--text-faint)',
                      border: isActive ? '1px solid #3b82f6' : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    <span>#{step.step_number}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50px' }}>
                      {step.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Body */}
            {demoAttackFlow && demoAttackFlow.steps[demoFlowStepIndex] && (() => {
              const cur: DemoAttackStep = demoAttackFlow.steps[demoFlowStepIndex];
              const detailObj: Record<string, any> = {};
              if (cur.content) detailObj['incoming_payload'] = cur.content;
              if (cur.action) detailObj['interception_action'] = cur.action;
              if (cur.result) detailObj['result'] = cur.result;
              if (cur.extracted_claims) detailObj['extracted_claims'] = cur.extracted_claims;
              if (cur.verifications) detailObj['official_source_verifications'] = cur.verifications;
              if (cur.triggered_signals) detailObj['detected_signals'] = cur.triggered_signals;
              if (cur.risk_level) detailObj['risk_score'] = cur.risk_level;
              if (cur.protection_tier) detailObj['protection_tier'] = cur.protection_tier;
              if (cur.protection_principle) detailObj['protection_principle'] = cur.protection_principle;
              if (cur.evidence_items) detailObj['authoritative_evidence'] = cur.evidence_items;
              if (cur.steps) detailObj['safe_next_steps'] = cur.steps;
              if (cur.actions) detailObj['statutory_escalation_actions'] = cur.actions;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8' }}>
                        STAGE {cur.step_number} OF {demoAttackFlow.steps.length}: {cur.name.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                        Component: {cur.actor}
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: 0, marginBottom: '14px' }}>
                      {cur.content || cur.result || cur.action || cur.protection_principle || cur.status_label}
                    </p>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                          Status / Action:
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                          {cur.status_label}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>
                        {cur.action || cur.result || cur.name}
                      </div>
                    </div>

                    {/* Stage Details Inspection */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Forensic Stage Data & Evidence:
                      </div>
                      <pre
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#94a3b8',
                          maxHeight: '160px',
                          overflowY: 'auto',
                          margin: 0,
                          border: '1px solid var(--border-color)',
                          lineHeight: 1.4,
                        }}
                      >
                        {JSON.stringify(detailObj, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Stepper Navigation Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button
                      onClick={() => setDemoFlowStepIndex(Math.max(0, demoFlowStepIndex - 1))}
                      disabled={demoFlowStepIndex === 0}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        color: demoFlowStepIndex === 0 ? 'var(--text-faint)' : '#ffffff',
                        border: '1px solid var(--border-color)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: demoFlowStepIndex === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ChevronLeft style={{ width: '14px', height: '14px' }} />
                      Previous Stage
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {cur.step_number === 6 && (
                        <button
                          onClick={() => {
                            setShowDemoFlowModal(false);
                            setActiveNav('quarantine');
                          }}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Open Quarantine Vault
                        </button>
                      )}

                      {cur.step_number === 9 && (
                        <a
                          href="https://cybercrime.gov.in"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          Visit cybercrime.gov.in <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          setShowDemoFlowModal(false);
                          setActiveNav('academy');
                        }}
                        style={{
                          backgroundColor: 'rgba(255, 92, 141, 0.15)',
                          color: '#FF5C8D',
                          border: '1px solid rgba(255, 92, 141, 0.35)',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        title="Watch in 16:9 Video Lesson Hero Player"
                      >
                        <Video style={{ width: '13px', height: '13px' }} />
                        16:9 Cinema Player
                      </button>

                      <button
                        onClick={() => setDemoFlowStepIndex(Math.min(demoAttackFlow.steps.length - 1, demoFlowStepIndex + 1))}
                        disabled={demoFlowStepIndex === demoAttackFlow.steps.length - 1}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: demoFlowStepIndex === demoAttackFlow.steps.length - 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        Next Stage
                        <ChevronRight style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: 4-STEP ONBOARDING WIZARD (SECTION 20)                 */}
      {/* ============================================================== */}
      {showOnboardingModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  STEP {onboardingStep} OF 4: LOCAL USER SETUP
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>
                  Welcome to Sangyan AI Investor Shield
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Protect your financial communications across your digital devices with zero password persistence.
                </p>
              </div>
              <button onClick={() => setShowOnboardingModal(false)} style={{ background: 'none', color: 'var(--text-faint)', padding: '4px' }}>
                <X style={{ width: '22px', height: '22px' }} />
              </button>
            </div>

            {/* Stepper Bar */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: onboardingStep >= s ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>

            {/* STEP 1: CONNECT DEVICES */}
            {onboardingStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Step 1: Link Investor Endpoints</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Authorize personal devices for multi-point defensive monitoring.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'PC Workstation (Desktop/Browser)', desc: 'Primary deep forensic analysis and evidence dossier export.', icon: Laptop },
                    { name: 'Mobile Smartphone (Android / iOS)', desc: 'Notification and financial SMS listener with zero secret retention.', icon: Smartphone },
                    { name: 'Smartwatch Companion', desc: 'Zero data-processing endpoint for low-latency haptic alert triage.', icon: Watch },
                  ].map((dev, i) => {
                    const Icon = dev.icon;
                    return (
                      <div key={i} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Icon style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{dev.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dev.desc}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                          READY
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Next: Choose Sources →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CHOOSE COMMUNICATION SOURCES */}
            {onboardingStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Step 2: Communication Sources</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Select the financial channels to protect. No unrestricted private app access is required.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { title: 'Financial SMS', desc: 'Monitors bank transaction notifications and Demat OTP threats.', badge: 'REAL' },
                    { title: 'Email Ingestion', desc: 'Inspects broker contract notes and official SEBI circulars.', badge: 'REAL' },
                    { title: 'Browser Link Protection', desc: 'Inspects financial URLs for phishing domains and typosquats.', badge: 'REAL' },
                    { title: 'Banking Notification Hook', desc: 'Hooks standard OS push notifications for payment warnings.', badge: 'DEMO' },
                    { title: 'Broker Notification Hook', desc: 'Hooks trading notifications and margin call alerts.', badge: 'DEMO' },
                  ].map((src, i) => (
                    <div key={i} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{src.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{src.desc}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: src.badge === 'REAL' ? '#34d399' : '#fbbf24', backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                        {src.badge}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button
                    onClick={() => setOnboardingStep(1)}
                    style={{ backgroundColor: 'var(--bg-card)', color: '#ffffff', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Next: Protection Level →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CHOOSE PROTECTION LEVEL */}
            {onboardingStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Step 3: Choose Protection Level</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Select the strictness of Sangyan AI's defensive firewall.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { level: 'STANDARD' as ProtectionLevel, title: 'STANDARD', desc: 'Flags high-confidence threats (OTP requests, APK downloads, guaranteed returns). Minimum day-to-day interference.' },
                    { level: 'ENHANCED' as ProtectionLevel, title: 'ENHANCED (Recommended)', desc: 'Proactive firewall. Flags unverified financial claims, suspicious WhatsApp/Telegram links, and unverified broker domains.' },
                    { level: 'STRICT' as ProtectionLevel, title: 'STRICT ZERO-TRUST', desc: 'Zero-trust policy. Automatically quarantines communications from unverified senders containing financial assertions.' },
                  ].map((lvl) => {
                    const isSelected = (settings?.protection_level || 'ENHANCED') === lvl.level;
                    return (
                      <div
                        key={lvl.level}
                        onClick={() => handleUpdateSettings({ protection_level: lvl.level })}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          border: isSelected ? '2px solid #38bdf8' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#38bdf8' : '#ffffff' }}>{lvl.title}</span>
                          {isSelected && <Check style={{ width: '16px', height: '16px', color: '#38bdf8' }} />}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lvl.desc}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    style={{ backgroundColor: 'var(--bg-card)', color: '#ffffff', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(4)}
                    style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Next: Activate Protection →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ACTIVATE PROTECTION */}
            {onboardingStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Step 4: Activate Protection</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  Review your setup before arming Sangyan AI Investor Shield.
                </p>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#ffffff' }}>3 Devices Configured (PC, Mobile, Smartwatch Companion)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#ffffff' }}>5 Communication Ingestion Connectors Initialized</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#ffffff' }}>Protection Profile: <strong>{settings?.protection_level || 'ENHANCED'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#ffffff' }}>Enforced Zero Auto-Delete Guarantee Active</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span style={{ color: '#ffffff' }}>Zero Secret / Zero OTP Persistence Active</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    style={{ backgroundColor: 'var(--bg-card)', color: '#ffffff', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      setShowOnboardingModal(false);
                      showToast('Sangyan AI Investor Shield is actively protecting your financial life!');
                    }}
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShieldCheck style={{ width: '16px', height: '16px' }} />
                    Arm Continuous Protection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: USER-CONFIRMED REPORTING (1930 / CHAKSHU / SEBI SCORES) */}
      {/* ============================================================== */}
      {reportConfirmMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: '#0d1322',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f87171', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  USER-CONFIRMED STATUTORY REPORTING
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                  Report Quarantined Threat to Official Authorities
                </h3>
              </div>
              <button
                onClick={() => setReportConfirmMessage(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px 14px', marginBottom: '18px', fontSize: '12px', color: '#fca5a5', lineHeight: 1.5 }}>
              <strong>Mandatory Protocol:</strong> IN V PROTECT never silently submits complaints. You must explicitly review and confirm the threat details before official incident generation.
            </div>

            {/* Communication Details */}
            <div style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Suspect Communication ({reportConfirmMessage.source_channel} • {reportConfirmMessage.sender})
              </div>
              <p style={{ fontSize: '13px', color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
                {reportConfirmMessage.content}
              </p>
            </div>

            {/* Official Reporting Portals */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                Statutory Reporting Resources:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>Cybercrime Portal & Helpline</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>1930</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>National Financial Fraud Reporting</div>
                </a>

                <a
                  href="https://sancharsaathi.gov.in/sfc/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>DoT Chakshu Facility</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>sancharsaathi.gov.in</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Report Fraudulent SMS & Calls</div>
                </a>

                <a
                  href="https://scores.sebi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>SEBI SCORES 2.0</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>scores.sebi.gov.in</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Securities Market Fraud & Grievance</div>
                </a>
              </div>
            </div>

            {/* Investor Notes */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Investor Observation / Fraud Context (Optional):
              </label>
              <textarea
                value={reportUserNotes}
                onChange={(e) => setReportUserNotes(e.target.value)}
                placeholder="E.g., Received via unsolicited WhatsApp group inviting to fraudulent Tata IPO syndicate."
                rows={2}
                style={{
                  width: '100%',
                  backgroundColor: '#080d1a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setReportConfirmMessage(null)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #1e293b',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUserConfirmedReport(reportConfirmMessage)}
                disabled={reportingSubmitting}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: reportingSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {reportingSubmitting ? 'Submitting Incident...' : 'Confirm & Log Official Incident'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EVIDENCE PACKAGE VIEWER                                 */}
      {/* ============================================================== */}
      {evidenceModalMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '20px',
          }}
          className="animate-fade-in"
        >
          <div
            style={{
              backgroundColor: '#0d1322',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  EVIDENCE DOSSIER — {evidenceModalMessage.id}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                  Synthesized Evidence & Regulatory Grounding
                </h3>
              </div>
              <button
                onClick={() => setEvidenceModalMessage(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Intercepted Content */}
            <div style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                Channel: {evidenceModalMessage.source_channel} • Sender: {evidenceModalMessage.sender} • Time: {evidenceModalMessage.timestamp}
              </div>
              <p style={{ fontSize: '13px', color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
                {evidenceModalMessage.content}
              </p>
            </div>

            {/* Isolation Reason & Triage */}
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#fca5a5' }}>
              <strong>Risk Verdict:</strong> {evidenceModalMessage.protection_tier} ({evidenceModalMessage.risk_level})
              <div style={{ marginTop: '4px', color: '#cbd5e1' }}>
                {evidenceModalMessage.quarantine_reason || evidenceModalMessage.snippet}
              </div>
            </div>

            {/* Detected Signals */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                Detected Predatory Scam Signals ({evidenceModalMessage.detected_signals.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {evidenceModalMessage.detected_signals.map((sig, idx) => (
                  <div key={idx} style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>{sig.name}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Confidence: {sig.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Regulatory Evidence */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                Authoritative Cross-Check (SEBI / RBI / I4C / CERT-In):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {officialSources.slice(0, 3).map((src, sIdx) => (
                  <div key={sIdx} style={{ backgroundColor: '#080d1a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>{src.publisher} — {src.title}</span>
                      <span style={{ fontSize: '10px', color: '#f87171', fontWeight: 700, backgroundColor: 'rgba(239,68,68,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                        CONTRADICTED
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {src.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setEvidenceModalMessage(null)}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Protected Device Pairing & Management Modal */}
      <DeviceManagerModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        onRefreshDevices={fetchSecurityData}
      />

      {/* Security & Privacy Posture Modal */}
      <SecurityPrivacyModal
        isOpen={showSecurityPrivacyModal}
        onClose={() => setShowSecurityPrivacyModal(false)}
        ownerProfile={ownerProfile}
        onLogout={handleLogout}
      />

      {/* Mobile Bottom Navigation Bar (Section 14: Responsive Design) */}
      <nav className="mobile-bottom-nav">
        <button
          type="button"
          onClick={() => setActiveNav('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeNav === 'dashboard' ? '#02C39A' : '#A7A7A7',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <Activity style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '10px', fontWeight: activeNav === 'dashboard' ? 700 : 500 }}>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveNav('alerts')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeNav === 'alerts' || activeNav === 'quarantine' ? '#02C39A' : '#A7A7A7',
            cursor: 'pointer',
            padding: '6px',
            position: 'relative',
          }}
        >
          <AlertOctagon style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '10px', fontWeight: activeNav === 'alerts' || activeNav === 'quarantine' ? 700 : 500 }}>Alerts</span>
          {quarantinedMessages.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '10px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
              }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveNav('verify')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeNav === 'verify' ? '#02C39A' : '#A7A7A7',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <ShieldCheck style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '10px', fontWeight: activeNav === 'verify' ? 700 : 500 }}>Verify</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (activeNav === 'settings') setActiveNav('dashboard');
            else setActiveNav('settings');
          }}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeNav === 'settings' || activeNav === 'evidence' || activeNav === 'reports' ? '#02C39A' : '#A7A7A7',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <Settings style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '10px', fontWeight: activeNav === 'settings' ? 700 : 500 }}>More</span>
        </button>
      </nav>
    </div>
  );
}
