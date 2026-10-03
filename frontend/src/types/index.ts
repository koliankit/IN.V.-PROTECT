/**
 * Sangyan AI Investor Shield - Frontend Type Definitions
 * Strict TypeScript models matching the backend analysis and personal digital security layer contract.
 */

export type RiskLevel = 'Low Concern' | 'Needs Verification' | 'High Concern';

export type ConfidenceLevel = 'high' | 'moderate' | 'uncertain';

export type ProtectionTier = 'Trusted / Important' | 'Review / Verify' | 'Quarantined / High Risk';

export type ClaimVerificationStatus = 'Supported' | 'Contradicted' | 'Unverified' | 'Partially Supported';

export interface ConfidenceOrUncertainty {
  level: ConfidenceLevel;
  score?: number | null;
  uncertainty_note?: string | null;
}

export interface DetectedSignal {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rule_id?: string | null;
  description: string;
  evidence_text?: string | null;
  confidence?: number | null;
  rule_source?: string | null;
}

export interface ExtractedClaim {
  claim_text: string;
  claim_type:
    | 'guaranteed_return'
    | 'registration_claim'
    | 'urgency'
    | 'payment_request'
    | 'official_endorsement'
    | 'tip'
    | string;
  entity?: string | null;
}

export interface VerifiedClaimItem {
  claim_id: string;
  claim_text: string;
  claim_type: string;
  verification_status: ClaimVerificationStatus;
  verification_notes: string;
  authoritative_source?: string | null;
  source_url?: string | null;
}

export interface EvidenceItem {
  source_id: string;
  publisher: string;
  title: string;
  url: string;
  passage: string;
  relevance_score?: number | null;
  source_name?: string | null;
  source_type?: string | null;
  summary?: string | null;
  verification_status?: string | null;
}

export interface OfficialSourceLink {
  title: string;
  url: string;
  description: string;
  category: 'verification' | 'reporting' | 'grievance' | 'awareness';
}

export interface AnalysisResponse {
  risk_level: RiskLevel;
  confidence_or_uncertainty: ConfidenceOrUncertainty;
  detected_signals: DetectedSignal[];
  extracted_claims: ExtractedClaim[];
  evidence: EvidenceItem[];
  explanation: string;
  safe_next_steps: string[];
  official_source_links: OfficialSourceLink[];
  protection_tier?: ProtectionTier | string | null;
  claim_verifications?: VerifiedClaimItem[];
  detected_language?: string | null;
  pii_redacted_stats?: {
    otps_redacted: number;
    pins_redacted: number;
    passwords_redacted: number;
    total_redactions: number;
  } | null;
}

export type InputModality = 'plain_text' | 'pasted_message' | 'screenshot_image' | 'public_url';

export interface AnalysisRequest {
  modality: InputModality;
  content: string;
  image_base64?: string | null;
  url?: string | null;
}

export interface DeviceStatus {
  device_id: string;
  name: string;
  device_type: 'PC / Desktop' | 'Mobile Smartphone' | 'Smartwatch Companion';
  os: string;
  status: 'PROTECTED' | 'CONNECTED' | 'NOT_CONNECTED';
  last_sync: string;
  role_description: string;
  capabilities: string[];
  is_alert_endpoint: boolean;
}

export interface IntegrationSource {
  id: string;
  name: string;
  category: 'BANK' | 'BROKER' | 'PAYMENT' | 'EMAIL' | 'MESSAGING' | 'BROWSER' | 'DEVICE';
  status: 'CONNECTED' | 'AVAILABLE' | 'NOT CONNECTED' | 'DEMO / SIMULATED';
  description: string;
  supported_channels: string[];
  data_access_level: string;
  security_guarantee: string;
  is_real: boolean;
  notes?: string | null;
}

export interface SecureMessage {
  id: string;
  sender: string;
  sender_identifier: string;
  source_channel: string;
  timestamp: string;
  content: string;
  snippet: string;
  risk_level: RiskLevel;
  protection_tier: ProtectionTier;
  status: 'ACTIVE' | 'QUARANTINED' | 'RELEASED' | 'DELETED' | 'MARKED_SAFE';
  detected_signals: DetectedSignal[];
  claims: VerifiedClaimItem[];
  evidence: EvidenceItem[];
  safe_next_steps: string[];
  explanation: string;
  quarantine_reason?: string | null;
  is_demo: boolean;
}

export interface IncidentRecord {
  incident_id: string;
  title: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sender: string;
  source_channel: string;
  suspicious_url?: string | null;
  risk_level: RiskLevel;
  detected_signals: string[];
  claims_summary: string[];
  evidence_sources: string[];
  recommended_action: string;
  official_reporting_channels: Array<{
    name: string;
    helpline?: string;
    url: string;
    instruction: string;
  }>;
  evidence_package: Record<string, any>;
  status: 'OPEN' | 'REPORTED' | 'RESOLVED' | 'DISMISSED';
}

export interface SecurityOverview {
  digital_security_status: string;
  devices_protected: number;
  connected_sources: number;
  messages_analysed: number;
  high_risk_messages: number;
  needs_verification: number;
  verified_important: number;
  recent_threats: Array<{
    id: string;
    title: string;
    sender: string;
    time: string;
    severity: string;
  }>;
  connected_sources_summary: Array<{
    name: string;
    category: string;
    status: string;
    is_real: string;
  }>;
  device_statuses: DeviceStatus[];
}

export interface PrivacyStatus {
  encryption_standard: string;
  password_storage: string;
  otp_storage: string;
  pin_storage: string;
  data_minimization: boolean;
  local_processing_supported: boolean;
  evidence_retention_days: number;
  user_data_deletion_supported: boolean;
  audit_logging_enabled: boolean;
  privacy_policy_url: string;
}

export type ProtectionLevel = 'STANDARD' | 'ENHANCED' | 'STRICT';

export interface SecuritySettings {
  protection_level: ProtectionLevel;
  onboarding_completed: boolean;
  notifications_enabled: boolean;
  watch_haptics_enabled: boolean;
  desktop_alerts_enabled: boolean;
  evidence_retention_days: number;
  local_processing_only: boolean;
  connected_device_ids: string[];
  active_connector_ids: string[];
  no_auto_delete_guarantee: string;
}

export interface DemoAttackStep {
  step_number: number;
  name: string;
  actor: string;
  channel?: string;
  content?: string;
  action?: string;
  result?: string;
  extracted_claims?: Array<{ claim: string; type: string }>;
  verifications?: Array<{ claim: string; status: string; source: string; notes: string }>;
  triggered_signals?: string[];
  risk_level?: string;
  protection_tier?: string;
  protection_principle?: string;
  evidence_items?: Array<{ publisher: string; title: string; url: string; passage: string }>;
  steps?: string[];
  actions?: string[];
  status_label: string;
}

export interface DemoAttackFlow {
  title: string;
  mode: string;
  disclaimer: string;
  steps: DemoAttackStep[];
}

export interface DailySecurityReport {
  date: string;
  timestamp: string;
  overall_posture: string;
  posture_score: number;
  scans_today: number;
  threats_neutralized: number;
  review_pending: number;
  verified_trusted: number;
  clean_rate: string;
  active_safeguards: string[];
  executive_summary: string;
  safety_action_items: string[];
}

export interface ScamTrendItem {
  trend_id: string;
  title: string;
  surge_level: string;
  target_vector: string;
  modus_operandi: string;
  regulatory_warning: string;
  defensive_advice: string;
  risk_severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ScamTrendsResponse {
  headline: string;
  last_updated: string;
  source_advisories: string[];
  trends: ScamTrendItem[];
}

export interface SafetyCheckItem {
  id: string;
  title: string;
  status: 'PASSED' | 'VERIFIED' | 'ACTIVE' | 'ENFORCED' | 'WARNING';
  category: string;
  description: string;
  icon: string;
}

export interface InvestorSafetyReview {
  overall_status: string;
  safety_score: number;
  last_audited: string;
  summary: string;
  checklist: SafetyCheckItem[];
}

