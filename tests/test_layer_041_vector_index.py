"""
Validation Test for Layer 041: Vector index.
Verifies vector similarity search with strong metadata filtering by publisher,
source type, date range, and topic, as well as pgvector DDL generation.
"""
import os
import shutil
import tempfile
import unittest

from backend.core.embedding_pipeline import EmbeddingPipeline
from backend.core.vector_index import VectorIndex
from backend.schemas.vector_index import (
    VectorIndexItem,
    VectorMetadata,
    VectorQueryFilter,
)
from scripts.query_vector_index import run_vector_query


class TestLayer041VectorIndex(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.index_path = os.path.join(self.temp_dir, "test_vector_index.json")
        self.index = VectorIndex(index_path=self.index_path)
        self.embedder = EmbeddingPipeline(dimensions=64)

        # Seed sample items
        self._seed_sample_items()

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def _seed_sample_items(self) -> None:
        items = [
            VectorIndexItem(
                id="CHK_001_SEBI_TELEGRAM",
                vector=self.embedder._generate_deterministic_vector("VIP Telegram groups promising 1000% stock returns"),
                text="SEBI warns against unauthorized VIP Telegram trading groups offering high guaranteed returns.",
                metadata=VectorMetadata(
                    publisher="SEBI Investor",
                    source_type="official_advisory",
                    publication_date="2024-02-26",
                    topic="telegram_vip",
                    title="Fake Trading App Scam Landscape",
                    source_url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    page_or_section="Page 1 / Social Media Groups",
                ),
            ),
            VectorIndexItem(
                id="CHK_002_SEBI_PORTAL",
                vector=self.embedder._generate_deterministic_vector("SEBI SCORES portal investor grievance registration"),
                text="Investors can lodge grievances against registered entities through SCORES portal.",
                metadata=VectorMetadata(
                    publisher="SEBI Investor",
                    source_type="official_portal",
                    publication_date="2023-11-15",
                    topic="grievance_redressal",
                    title="Investor Support",
                    source_url="https://investor.sebi.gov.in/Investor-support.html",
                    page_or_section="Section 1 / SCORES",
                ),
            ),
            VectorIndexItem(
                id="CHK_003_RBI_FAME",
                vector=self.embedder._generate_deterministic_vector("RBI financial awareness mule bank accounts and OTP fraud"),
                text="Never share OTP or transfer funds to unknown individual bank accounts.",
                metadata=VectorMetadata(
                    publisher="Reserve Bank of India",
                    source_type="official_advisory",
                    publication_date="2024-03-10",
                    topic="mule_accounts",
                    title="Financial Awareness Messages",
                    source_url="https://www.rbi.org.in/commonperson/images/FAME202426022024.pdf",
                    page_or_section="Page 4 / Banking Safety",
                ),
            ),
            VectorIndexItem(
                id="CHK_004_I4C_ADVISORY",
                vector=self.embedder._generate_deterministic_vector("I4C fake stock market apps and malicious APK distribution"),
                text="Advisory on illegal trading platforms distributed via direct APK download links.",
                metadata=VectorMetadata(
                    publisher="I4C Threat Analytics Unit",
                    source_type="official_advisory",
                    publication_date="2024-04-22",
                    topic="fake_apps",
                    title="Advisory on Illegal Trading Apps",
                    source_url="https://cybercrime.gov.in/pdf/Advisories/ADVISORY%20TAU-ADV-001.pdf",
                    page_or_section="Page 2 / APK Links",
                ),
            ),
        ]
        self.index.add_batch(items)

    def test_basic_vector_search_returns_highest_similarity(self):
        query_text = "Telegram trading groups promising guaranteed returns"
        q_vec = self.embedder._generate_deterministic_vector(query_text)

        results = self.index.query(query_vector=q_vec, top_k=2)
        self.assertEqual(len(results), 2)
        # Top match should be the SEBI Telegram advisory
        self.assertEqual(results[0].id, "CHK_001_SEBI_TELEGRAM")
        self.assertGreater(results[0].score, 0.40)

    def test_filter_by_publisher(self):
        q_vec = self.embedder._generate_deterministic_vector("trading advisory")
        q_filter = VectorQueryFilter(publisher="RBI")

        results = self.index.query(query_vector=q_vec, top_k=5, filters=q_filter)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, "CHK_003_RBI_FAME")
        self.assertIn("Reserve Bank", results[0].metadata.publisher)

    def test_filter_by_source_type(self):
        q_vec = self.embedder._generate_deterministic_vector("complaints and grievance")
        q_filter = VectorQueryFilter(source_type="official_portal")

        results = self.index.query(query_vector=q_vec, top_k=5, filters=q_filter)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, "CHK_002_SEBI_PORTAL")
        self.assertEqual(results[0].metadata.source_type, "official_portal")

    def test_filter_by_date_range(self):
        q_vec = self.embedder._generate_deterministic_vector("cyber fraud advisories")
        # Filter strictly for items published in April 2024
        q_filter = VectorQueryFilter(date_after="2024-04-01", date_before="2024-04-30")

        results = self.index.query(query_vector=q_vec, top_k=5, filters=q_filter)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, "CHK_004_I4C_ADVISORY")
        self.assertEqual(results[0].metadata.publication_date, "2024-04-22")

    def test_filter_by_topic(self):
        q_vec = self.embedder._generate_deterministic_vector("fraud")
        q_filter = VectorQueryFilter(topic="telegram_vip")

        results = self.index.query(query_vector=q_vec, top_k=5, filters=q_filter)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, "CHK_001_SEBI_TELEGRAM")
        self.assertEqual(results[0].metadata.topic, "telegram_vip")

    def test_composite_filters(self):
        q_vec = self.embedder._generate_deterministic_vector("official guidance")
        # Composite filter: Publisher=SEBI AND source_type=official_advisory
        q_filter = VectorQueryFilter(
            publisher="SEBI",
            source_type="official_advisory",
            date_after="2024-01-01",
        )

        results = self.index.query(query_vector=q_vec, top_k=5, filters=q_filter)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, "CHK_001_SEBI_TELEGRAM")

    def test_persistence_and_reload(self):
        self.index.save_index()
        self.assertTrue(os.path.isfile(self.index_path))

        # Create fresh index instance pointing to same file
        reloaded = VectorIndex(index_path=self.index_path)
        self.assertEqual(reloaded.total_count(), 4)
        self.assertIsNotNone(reloaded.get_item("CHK_001_SEBI_TELEGRAM"))

    def test_pgvector_sql_generation(self):
        sql = VectorIndex.generate_pgvector_sql(dimensions=128)
        self.assertIn("CREATE EXTENSION IF NOT EXISTS vector;", sql)
        self.assertIn("vector(128)", sql)
        self.assertIn("USING hnsw", sql)
        self.assertIn("idx_vector_publisher", sql)
        self.assertIn("idx_vector_topic", sql)

    def test_cli_dry_run_executes_cleanly(self):
        code = run_vector_query(
            query_text=None,
            publisher=None,
            source_type=None,
            topic=None,
            date_after=None,
            date_before=None,
            top_k=5,
            dry_run=True,
        )
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
