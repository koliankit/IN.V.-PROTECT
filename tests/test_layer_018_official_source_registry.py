"""
Validation Test for Layer 018: Official source registry.
Verifies official-source registry for SEBI/SEBI Investor, I4C/Cybercrime, RBI,
CERT-In, and NCRB/data.gov.in without invented URLs.
"""
import os
import unittest
from backend.core.sources import SourceRegistry
from backend.schemas.provenance import AllowedUse


class TestLayer018OfficialSourceRegistry(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.manifest_path = os.path.join(
            self.root_dir, "data", "manifests", "official_source_registry.json"
        )
        self.registry = SourceRegistry(self.manifest_path)

    def test_registry_contains_minimum_required_authorities(self) -> None:
        sources = self.registry.list_all()
        self.assertGreaterEqual(len(sources), 8)

        publishers = {s.publisher for s in sources}
        # Check all core authorities are present
        self.assertTrue(any("SEBI" in p for p in publishers))
        self.assertTrue(any("I4C" in p for p in publishers))
        self.assertTrue(any("RBI" in p for p in publishers))
        self.assertTrue(any("CERT-In" in p for p in publishers))
        self.assertTrue(any("data.gov.in" in p for p in publishers))

    def test_all_official_urls_domain_verified(self) -> None:
        sources = self.registry.list_all()
        allowed_domains = {"gov.in", "org.in"}
        for s in sources:
            has_valid_domain = any(domain in s.url for domain in allowed_domains)
            self.assertTrue(
                has_valid_domain,
                f"Source {s.source_id} URL '{s.url}' is not an authoritative government domain",
            )

    def test_filter_by_use(self) -> None:
        rag_sources = self.registry.filter_by_use(AllowedUse.RAG_EVIDENCE_RULES)
        self.assertGreaterEqual(len(rag_sources), 4)

    def test_get_specific_source(self) -> None:
        src1 = self.registry.get_source("SRC001")
        self.assertIsNotNone(src1)
        self.assertEqual(src1.publisher, "SEBI Investor")
        self.assertIn("Fake Trading App", src1.title)


if __name__ == "__main__":
    unittest.main()
