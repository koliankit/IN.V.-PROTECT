"""
Backend Service Smoke Test.
Verifies that core modules, schemas, configuration, and constraints instantiate properly.
"""
import unittest
from backend.core.config import settings
from backend.core.constants import PRODUCT_NAME, PRIMARY_TRACK_CODE
from backend.schemas.analysis import AnalysisResponse, RiskLevel, ConfidenceOrUncertainty, ConfidenceLevel


class TestBackendSmoke(unittest.TestCase):
    def test_settings_loaded(self):
        self.assertIsNotNone(settings)
        self.assertEqual(settings.ENVIRONMENT, "development")

    def test_constants_accessible(self):
        self.assertEqual(PRODUCT_NAME, "Sangyan AI Investor Shield")
        self.assertEqual(PRIMARY_TRACK_CODE, "Track A")

    def test_schemas_constructable(self):
        response = AnalysisResponse(
            risk_level=RiskLevel.LOW_CONCERN,
            confidence_or_uncertainty=ConfidenceOrUncertainty(
                level=ConfidenceLevel.HIGH,
                score=0.99,
                uncertainty_note=None,
            ),
            detected_signals=[],
            extracted_claims=[],
            evidence=[],
            explanation="Smoke test backend explanation",
            safe_next_steps=["Routine message"],
            official_source_links=[],
        )
        self.assertEqual(response.risk_level, RiskLevel.LOW_CONCERN)


if __name__ == "__main__":
    unittest.main()
