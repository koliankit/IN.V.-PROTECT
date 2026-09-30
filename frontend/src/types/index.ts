/**
 * Sangyan AI Investor Shield - Frontend Type Definitions
 * Strict TypeScript models matching the backend analysis contract.
 */

export type RiskLevel = 'Low Concern' | 'Needs Verification' | 'High Concern';

export type ConfidenceLevel = 'high' | 'moderate' | 'uncertain';

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
}

export interface ExtractedClaim {
  claim_text: string;
  claim_type:
    | 'guaranteed_return'
    | 'registration_claim'
    | 'urgency'
    | 'payment_request'
    | 'official_endorsement'
    | 'tip';
  entity?: string | null;
}

export interface EvidenceItem {
  source_id: string;
  publisher: string;
  title: string;
  url: string;
  passage: string;
  relevance_score?: number | null;
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
}

export type InputModality = 'plain_text' | 'pasted_message' | 'screenshot_image' | 'public_url';

export interface AnalysisRequest {
  modality: InputModality;
  content: string;
  image_base64?: string | null;
  url?: string | null;
}
