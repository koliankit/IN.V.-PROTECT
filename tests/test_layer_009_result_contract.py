"""
Validation Test for Layer 009: Define output / result contract.
Verifies risk_level, confidence/uncertainty, detected_signals, extracted_claims,
evidence, explanation, safe_next_steps, and official_source_links.
"""
import os
import unittest
from backend.schemas.analysis import (
    RiskLevel,
    ConfidenceLevel,
    ConfidenceOrUncertainty,
    DetectedSignal,
    ExtractedClaim,
    EvidenceItem,
    OfficialSourceLink,
    AnalysisResponse,
)


class TestLayer009ResultContract(unittest.TestCase):
    def test_schema_valid_construction(self):
        response = AnalysisResponse(
            risk_level=RiskLevel.HIGH_CONCERN,
            confidence_or_uncertainty=ConfidenceOrUncertainty(
                level=ConfidenceLevel.HIGH,
                score=0.92,
                uncertainty_note=None,
            ),
            detected_signals=[
                DetectedSignal(
                    id="SIG_GUARANTEED_RETURN",
                    name="Guaranteed High Returns",
                    severity="high",
                    rule_id="RULE_001",
                    description="Guaranteed returns in market securities violate SEBI regulations.",
                )
            ],
            extracted_claims=[
                ExtractedClaim(
                    claim_text="Guaranteed 50% profit weekly on VIP trading group",
                    claim_type="guaranteed_return",
                    entity="VIP Trading",
                )
            ],
            evidence=[
                EvidenceItem(
                    source_id="SRC001",
                    publisher="SEBI Investor",
                    title="Fake Trading App Scam Landscape",
                    url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    passage="Investors are cautioned against promises of assured/guaranteed returns.",
                    relevance_score=0.95,
                )
            ],
            explanation="The message solicits funds with impossible guaranteed returns.",
            safe_next_steps=[
                "Do not transfer money to personal UPI or unverified accounts.",
                "Verify SEBI registration of the entity.",
            ],
            official_source_links=[
                OfficialSourceLink(
                    title="SEBI Intermediaries Verification",
                    url="https://www.sebi.gov.in/intermediaries.html",
                    description="Verify registered brokers and advisers",
                    category="verification",
                )
            ],
        )

        data = response.model_dump()
        self.assertEqual(data["risk_level"], "High Concern")
        self.assertEqual(data["confidence_or_uncertainty"]["level"], "high")
        self.assertEqual(len(data["detected_signals"]), 1)
        self.assertEqual(len(data["extracted_claims"]), 1)
        self.assertEqual(len(data["evidence"]), 1)
        self.assertEqual(len(data["safe_next_steps"]), 2)
        self.assertEqual(len(data["official_source_links"]), 1)

    def test_result_contract_documentation(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "RESULT_CONTRACT.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("risk_level", content)
        self.assertIn("confidence_or_uncertainty", content)
        self.assertIn("detected_signals", content)
        self.assertIn("extracted_claims", content)
        self.assertIn("evidence", content)
        self.assertIn("explanation", content)
        self.assertIn("safe_next_steps", content)
        self.assertIn("official_source_links", content)


if __name__ == "__main__":
    unittest.main()
