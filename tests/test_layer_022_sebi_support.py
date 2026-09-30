"""
Validation Test for Layer 022: SEBI investor support.
Verifies indexing of official SEBI investor-support and grievance information
(SCORES, SMART ODR, SEBI Helpline, Intermediary Directory, 1930 / cybercrime.gov.in)
derived with full provenance from official documents rather than unsourced static databases.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore
from backend.core.support import InvestorSupportIndex, SupportChannel


class TestLayer022SebiSupport(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.official_file = os.path.join(
            self.root_dir, "data", "official", "SRC004_sebi_investor_support.json"
        )
        self.store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))
        self.support_index = InvestorSupportIndex(self.store)

    def test_official_document_structure(self):
        self.assertTrue(os.path.isfile(self.official_file))
        with open(self.official_file, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC004")
        self.assertEqual(doc["publisher"], "SEBI Investor")
        self.assertTrue(doc["content_hash"].startswith("sha256:"))
        self.assertGreaterEqual(len(doc["sections"]), 4)

    def test_support_channels_indexed(self):
        channels = self.support_index.list_all_channels()
        self.assertGreaterEqual(len(channels), 4)

        scores = self.support_index.get_channel("scores")
        self.assertIsNotNone(scores)
        self.assertIn("scores.sebi.gov.in", scores.portal_url)
        self.assertEqual(scores.source_reference, "SRC004#SEC01_SCORES_PORTAL")

        smart_odr = self.support_index.get_channel("smart_odr")
        self.assertIsNotNone(smart_odr)
        self.assertIn("smartodr.in", smart_odr.portal_url)

        helpline = self.support_index.get_channel("sebi_helpline")
        self.assertIsNotNone(helpline)
        self.assertIn("1800 266 7575", helpline.helpline_numbers)

        cybercrime = self.support_index.get_channel("cybercrime_portal")
        self.assertIsNotNone(cybercrime)
        self.assertIn("1930", cybercrime.helpline_numbers)

    def test_routing_logic_unregistered_vs_registered(self):
        # Unregistered fraudulent group -> 1930 & cybercrime portal prioritized
        unreg_routes = self.support_index.get_recommended_routing(suspected_unregistered=True)
        channel_ids = [c.channel_id for c in unreg_routes]
        self.assertIn("cybercrime_portal", channel_ids)
        self.assertIn("sebi_directory", channel_ids)
        self.assertNotIn("scores", channel_ids)

        # Registered intermediary grievance -> SCORES 2.0 and SMART ODR prioritized
        reg_routes = self.support_index.get_recommended_routing(suspected_unregistered=False)
        reg_ids = [c.channel_id for c in reg_routes]
        self.assertIn("scores", reg_ids)
        self.assertIn("smart_odr", reg_ids)
        self.assertNotIn("cybercrime_portal", reg_ids)


if __name__ == "__main__":
    unittest.main()
