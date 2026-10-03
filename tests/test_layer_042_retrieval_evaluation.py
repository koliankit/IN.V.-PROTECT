"""
Validation Test for Layer 042: Retrieval evaluation.
Verifies evaluation of knowledge-base retrieval against realistic investor-safety questions,
measuring Hit@K (Rank 1, 3, 5), Mean Reciprocal Rank (MRR), and Recall@K.
"""
import json
import os
import shutil
import tempfile
import unittest

from backend.core.embedding_pipeline import EmbeddingPipeline
from backend.core.retrieval_evaluator import RetrievalEvaluator
from backend.core.vector_index import VectorIndex
from backend.schemas.retrieval_evaluation import RetrievalBenchmarkQuery
from backend.schemas.vector_index import VectorIndexItem, VectorMetadata
from scripts.evaluate_retrieval import run_benchmark_cli


class TestLayer042RetrievalEvaluation(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.mkdtemp()
        self.index_path = os.path.join(self.temp_dir, "test_eval_index.json")
        self.vector_index = VectorIndex(index_path=self.index_path)
        self.embedder = EmbeddingPipeline(dimensions=64)

        # Seed realistic index items
        self._seed_test_corpus()

        self.evaluator = RetrievalEvaluator(
            vector_index=self.vector_index,
            embedder=self.embedder,
        )

    def tearDown(self) -> None:
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def _seed_test_corpus(self) -> None:
        items = [
            VectorIndexItem(
                id="CHK_SRC001_001",
                vector=self.embedder._generate_deterministic_vector(
                    "VIP Telegram stock trading groups promising guaranteed returns fake SEBI analysts"
                ),
                text="SEBI warns that registered intermediaries never promise guaranteed returns in VIP Telegram groups.",
                metadata=VectorMetadata(
                    publisher="SEBI Investor",
                    source_type="official_advisory",
                    publication_date="2024-02-26",
                    topic="telegram_vip",
                    title="Fake Trading App Scam Landscape",
                    source_url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    page_or_section="Page 1",
                    extra={"source_id": "SRC001"},
                ),
            ),
            VectorIndexItem(
                id="CHK_SRC001_002",
                vector=self.embedder._generate_deterministic_vector(
                    "Deposit margin money into personal savings account or individual UPI handle"
                ),
                text="Never deposit trading funds into personal bank accounts or arbitrary individual UPI IDs.",
                metadata=VectorMetadata(
                    publisher="SEBI Investor",
                    source_type="official_advisory",
                    publication_date="2024-02-26",
                    topic="payment_collection",
                    title="Fake Trading App Scam Landscape",
                    source_url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    page_or_section="Page 2",
                    extra={"source_id": "SRC001"},
                ),
            ),
            VectorIndexItem(
                id="CHK_SRC004_001",
                vector=self.embedder._generate_deterministic_vector(
                    "Where to lodge official complaint SEBI SCORES portal investor grievance redressal"
                ),
                text="Lodge complaints against registered intermediaries through the SEBI SCORES portal.",
                metadata=VectorMetadata(
                    publisher="SEBI Investor",
                    source_type="official_portal",
                    publication_date="2023-11-15",
                    topic="grievance_redressal",
                    title="Investor Support",
                    source_url="https://investor.sebi.gov.in/Investor-support.html",
                    page_or_section="Section 1",
                    extra={"source_id": "SRC004"},
                ),
            ),
            VectorIndexItem(
                id="CHK_SRC002_001",
                vector=self.embedder._generate_deterministic_vector(
                    "Downloading APK files on WhatsApp fake trading apps screen sharing"
                ),
                text="I4C advisory on unauthorized mobile applications distributed through direct APK download links.",
                metadata=VectorMetadata(
                    publisher="I4C Threat Analytics Unit",
                    source_type="official_advisory",
                    publication_date="2024-04-22",
                    topic="fake_apps",
                    title="Advisory on Illegal Trading Apps",
                    source_url="https://cybercrime.gov.in/pdf/Advisories/ADVISORY%20TAU-ADV-001.pdf",
                    page_or_section="Page 2",
                    extra={"source_id": "SRC002"},
                ),
            ),
        ]
        self.vector_index.add_batch(items)

    def test_evaluation_set_contains_minimum_queries(self) -> None:
        queries = self.evaluator.load_benchmark_queries()
        self.assertGreaterEqual(len(queries), 8)
        for q in queries:
            self.assertTrue(q.query_id.startswith("EVAL_"))
            self.assertGreaterEqual(len(q.query_text), 15)
            self.assertGreaterEqual(len(q.target_source_ids), 1)

    def test_single_query_evaluation_computes_hit_and_mrr(self) -> None:
        q = RetrievalBenchmarkQuery(
            query_id="TEST_Q01",
            query_text="VIP Telegram trading groups promising guaranteed returns",
            target_source_ids=["SRC001"],
            relevant_topics=["telegram_vip"],
            required_keywords=["telegram", "guaranteed"],
            scam_vector="telegram_vip_trading",
        )

        metric = self.evaluator.evaluate_query(q, top_k=3)
        self.assertEqual(metric.query_id, "TEST_Q01")
        self.assertTrue(metric.hit_at_1)
        self.assertTrue(metric.hit_at_3)
        self.assertEqual(metric.reciprocal_rank, 1.0)
        self.assertGreater(metric.recall_at_5, 0.0)

    def test_single_query_miss_evaluates_zero_hit_and_mrr(self) -> None:
        q = RetrievalBenchmarkQuery(
            query_id="TEST_Q_MISS",
            query_text="Unrelated culinary discussion on making pizza dough",
            target_source_ids=["SRC999_NON_EXISTENT"],
            relevant_topics=["none"],
            required_keywords=[],
            scam_vector="unrelated",
        )

        metric = self.evaluator.evaluate_query(q, top_k=3)
        self.assertFalse(metric.hit_at_1)
        self.assertFalse(metric.hit_at_3)
        self.assertEqual(metric.reciprocal_rank, 0.0)
        self.assertEqual(metric.recall_at_5, 0.0)

    def test_run_benchmark_computes_aggregate_metrics(self) -> None:
        report = self.evaluator.run_benchmark(top_k=5)
        self.assertGreaterEqual(report.total_queries, 8)
        self.assertGreaterEqual(report.hit_rate_at_1, 0.0)
        self.assertLessEqual(report.hit_rate_at_1, 1.0)
        self.assertGreaterEqual(report.mean_reciprocal_rank, 0.0)
        self.assertLessEqual(report.mean_reciprocal_rank, 1.0)
        self.assertGreaterEqual(report.average_recall_at_5, 0.0)

        # Check that individual query metrics are attached
        self.assertEqual(len(report.query_metrics), report.total_queries)

    def test_cli_dry_run_executes_cleanly(self) -> None:
        code = run_benchmark_cli(top_k=5, dry_run=True)
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
