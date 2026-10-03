"""
Unit tests for Layer 043: Claim Extraction Engine.
Validates discourse segmentation, noise filtering, span accuracy, entity detection,
and extraction across scam patterns and conversational contexts.
"""
import io
import unittest
from contextlib import redirect_stdout

from backend.core.claim_extractor import ClaimExtractor
from backend.schemas.claim_extraction import ClaimType, UserSubmission
from scripts.extract_claims import run_claim_extraction


class TestLayer043ClaimExtraction(unittest.TestCase):
    def setUp(self) -> None:
        self.extractor = ClaimExtractor()

    def test_discourse_segmentation_offsets(self) -> None:
        raw_text = "First sentence here. Second sentence follows! Third one?"
        units = self.extractor.segment_discourse(raw_text)
        self.assertGreaterEqual(len(units), 3)

        for text_seg, start, end in units:
            self.assertEqual(raw_text[start:end], text_seg)
            self.assertGreater(end, start)

    def test_filler_filtering(self) -> None:
        fillers = [
            "Hello sir",
            "Good morning",
            "Hope you are doing well",
            "Thanks and regards",
            "Please reply",
            "Are you interested?",
        ]
        for filler in fillers:
            self.assertTrue(
                self.extractor.is_conversational_filler(filler),
                f"Expected '{filler}' to be classified as conversational filler",
            )

    def test_guaranteed_return_extraction(self) -> None:
        submission = UserSubmission(
            submission_id="SUB-001",
            text="Hello friend. We guarantee 50% profit daily! Join our VIP group.",
            source_channel="telegram",
        )
        result = self.extractor.extract_claims(submission)
        self.assertGreaterEqual(result.total_claims, 1)

        return_claims = [c for c in result.claims if c.claim_type == ClaimType.GUARANTEED_RETURNS]
        self.assertGreaterEqual(len(return_claims), 1)
        claim = return_claims[0]
        self.assertIn("50% profit daily", claim.claim_text.lower())
        self.assertGreaterEqual(claim.confidence, 0.8)
        self.assertEqual(submission.text[claim.span.start:claim.span.end], claim.raw_fragment)

    def test_hinglish_paisa_double(self) -> None:
        submission = UserSubmission(
            submission_id="SUB-002",
            text="Sir yahan paisa double hoga 7 dino mein. Guaranteed munafa milega.",
            source_channel="whatsapp",
        )
        result = self.extractor.extract_claims(submission)
        self.assertGreaterEqual(result.total_claims, 1)
        self.assertTrue(any(c.claim_type == ClaimType.GUARANTEED_RETURNS for c in result.claims))

    def test_registration_claim_extraction(self) -> None:
        submission = UserSubmission(
            submission_id="SUB-003",
            text="We are SEBI registered investment advisor with license INA00012345.",
            source_channel="web",
        )
        result = self.extractor.extract_claims(submission)
        self.assertEqual(result.total_claims, 1)
        claim = result.claims[0]
        self.assertEqual(claim.claim_type, ClaimType.REGISTRATION_CLAIM)
        self.assertIn("SEBI", claim.extracted_entities)
        self.assertIn("INA00012345", claim.extracted_entities)

    def test_fee_payment_demand_extraction(self) -> None:
        submission = UserSubmission(
            submission_id="SUB-004",
            text="To release your earnings, please pay Rs 5,000 withdrawal processing fee immediately.",
            source_channel="telegram",
        )
        result = self.extractor.extract_claims(submission)
        self.assertGreaterEqual(result.total_claims, 1)
        fee_claim = result.claims[0]
        self.assertEqual(fee_claim.claim_type, ClaimType.FEE_PAYMENT_DEMAND)
        self.assertIn("Rs 5,000", fee_claim.extracted_entities)

    def test_account_blocking_threat(self) -> None:
        submission = UserSubmission(
            submission_id="SUB-005",
            text="Alert: Your demat account will be blocked within 24 hours unless KYC is updated.",
            source_channel="sms",
        )
        result = self.extractor.extract_claims(submission)
        self.assertGreaterEqual(result.total_claims, 1)
        self.assertTrue(any(c.claim_type == ClaimType.ACCOUNT_BLOCKING for c in result.claims))

    def test_purely_conversational_message_yields_zero_claims(self) -> None:
        submission = UserSubmission(
            submission_id="SUB-006",
            text="Hello sir, good morning. Hope you are well! Thanks.",
            source_channel="whatsapp",
        )
        result = self.extractor.extract_claims(submission)
        self.assertEqual(result.total_claims, 0)
        self.assertEqual(len(result.claims), 0)

    def test_empty_or_whitespace_handling(self) -> None:
        empty_sub = UserSubmission(submission_id="SUB-007", text="   \n\t  ")
        result = self.extractor.extract_claims(empty_sub)
        self.assertEqual(result.total_claims, 0)
        self.assertEqual(result.discourse_units_count, 0)

    def test_cli_dry_run_and_execution(self) -> None:
        buf = io.StringIO()
        with redirect_stdout(buf):
            run_claim_extraction(dry_run=True)
        output = buf.getvalue()
        self.assertIn("[DRY-RUN]", output)
        self.assertIn("Discourse segmentation produced", output)

        buf_json = io.StringIO()
        with redirect_stdout(buf_json):
            run_claim_extraction(
                text="Pay Rs 5,000 fee to withdraw profit. Guaranteed 20% returns.",
                as_json=True,
            )
        json_output = buf_json.getvalue()
        self.assertIn('"total_claims": 2', json_output)
        self.assertIn('"claim_type": "fee_payment_demand"', json_output)


if __name__ == "__main__":
    unittest.main()
