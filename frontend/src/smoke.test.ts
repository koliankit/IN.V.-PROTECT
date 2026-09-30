/**
 * Frontend Service Smoke Test
 * Validates that frontend TypeScript interfaces and type constants instantiate without error.
 */
import { describe, it, expect } from 'vitest';
import { AnalysisResponse, RiskLevel } from './types';

describe('Frontend Service Smoke Test', () => {
  it('instantiates valid analysis response model', () => {
    const mockResponse: AnalysisResponse = {
      risk_level: 'High Concern',
      confidence_or_uncertainty: {
        level: 'high',
        score: 0.95,
        uncertainty_note: null,
      },
      detected_signals: [
        {
          id: 'SIG_GUARANTEED_RETURN',
          name: 'Guaranteed Return Signal',
          severity: 'high',
          description: 'Promise of guaranteed market returns',
        },
      ],
      extracted_claims: [],
      evidence: [],
      explanation: 'Smoke test explanation',
      safe_next_steps: ['Do not pay'],
      official_source_links: [],
    };

    expect(mockResponse.risk_level).toBe('High Concern' as RiskLevel);
    expect(mockResponse.detected_signals.length).toBe(1);
    expect(mockResponse.confidence_or_uncertainty.score).toBe(0.95);
  });
});
