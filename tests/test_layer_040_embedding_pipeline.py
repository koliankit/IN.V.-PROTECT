"""
Validation Test for Layer 040: Embedding pipeline.
Verifies embedding generation for approved knowledge-base content only,
recording embedding model, version, dimensionality, and source metadata.
"""
import json
import math
import os
import shutil
import tempfile
import unittest

from backend.core.embedding_pipeline import (
    EmbeddingPipeline,
    UnapprovedContentError,
)
from backend.core.sources import SourceRegistry
from backend.schemas.document_chunk import DocumentChunk
from scripts.generate_embeddings import run_embedding_generation


class TestLayer040EmbeddingPipeline(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.manifest_path = os.path.join(self.temp_dir, "embeddings_manifest.json")
        self.registry_manifest = os.path.join(self.temp_dir, "official_source_registry.json")

        mock_registry_data = [
            {
                "source_id": "SRC001",
                "publisher": "SEBI Investor",
                "title": "Fake Trading App Scam Landscape",
                "url": "https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                "license": "Government Open Data",
                "publication_date": "2024-02-26",
                "retrieved_at": "2026-09-30T12:00:00Z",
                "content_hash": "sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
                "source_type": "official_advisory",
                "allowed_use": "RAG_evidence_rules",
            }
        ]
        with open(self.registry_manifest, "w", encoding="utf-8") as f:
            json.dump(mock_registry_data, f)

        self.registry = SourceRegistry(self.registry_manifest)
        self.embedder = EmbeddingPipeline(
            registry=self.registry,
            manifest_path=self.manifest_path,
            dimensions=128,
        )

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_unapproved_content_is_strictly_rejected(self):
        unapproved_chunk = DocumentChunk(
            chunk_id="CHK_UNKNOWN_001",
            source_id="SRC_UNAPPROVED_999",
            document_id="DOC_UNKNOWN",
            page_or_section="Page 1",
            section_title="Unvetted Blog Post",
            text="Unvetted claims about high return crypto trading strategies.",
            token_count_approx=8,
            chunk_index=0,
        )

        with self.assertRaises(UnapprovedContentError) as ctx:
            self.embedder.generate_chunk_embedding(unapproved_chunk)

        self.assertIn("SRC_UNAPPROVED_999", str(ctx.exception))
        self.assertIn("not an approved knowledge-base source", str(ctx.exception))

    def test_approved_source_generates_normalized_vector(self):
        approved_chunk = DocumentChunk(
            chunk_id="CHK_SRC001_001",
            source_id="SRC001",
            document_id="DOC_SRC001_d8c525",
            page_or_section="Page 1 / Modus Operandi",
            page_number=1,
            section_title="Modus Operandi",
            text="Fraudsters create WhatsApp and Telegram groups promising guaranteed returns.",
            token_count_approx=9,
            chunk_index=0,
        )

        record = self.embedder.generate_chunk_embedding(approved_chunk)

        # 1. Metadata and model recording
        self.assertEqual(record.source_id, "SRC001")
        self.assertEqual(record.chunk_id, "CHK_SRC001_001")
        self.assertEqual(record.model_name, "sangyan-semantic-embedder-v1")
        self.assertEqual(record.model_version, "1.0.0")
        self.assertEqual(record.dimensions, 128)
        self.assertEqual(len(record.vector), 128)

        # 2. Source metadata preserved
        self.assertEqual(record.source_metadata["publisher"], "SEBI Investor")
        self.assertEqual(record.source_metadata["title"], "Fake Trading App Scam Landscape")

        # 3. L2 norm verification: ||v|| = 1.0
        norm = math.sqrt(sum(x * x for x in record.vector))
        self.assertAlmostEqual(norm, 1.0, places=4)
        self.assertTrue(record.is_normalized)

    def test_batch_generate_embeddings_records_manifest(self):
        c1 = DocumentChunk(
            chunk_id="CHK_SRC001_001",
            source_id="SRC001",
            document_id="DOC_SRC001_d8c525",
            page_or_section="Page 1 / Modus Operandi",
            section_title="Modus Operandi",
            text="Fraudulent investment groups promise guaranteed returns.",
            token_count_approx=6,
            chunk_index=0,
        )
        c2 = DocumentChunk(
            chunk_id="CHK_SRC001_002",
            source_id="SRC001",
            document_id="DOC_SRC001_d8c525",
            page_or_section="Page 2 / Mule Accounts",
            section_title="Mule Accounts",
            text="Funds are solicited into personal and third-party bank accounts.",
            token_count_approx=9,
            chunk_index=1,
        )

        batch = self.embedder.batch_generate_embeddings("SRC001", [c1, c2])

        self.assertEqual(batch.embeddings_generated, 2)
        self.assertEqual(len(batch.records), 2)

        # Check persisted to manifest
        saved = self.embedder.get_manifest_embeddings("SRC001")
        self.assertEqual(len(saved), 2)
        self.assertEqual(saved[0].chunk_id, "CHK_SRC001_001")
        self.assertEqual(saved[1].chunk_id, "CHK_SRC001_002")

    def test_semantic_proximity_ranking(self):
        # Two scam passages regarding Telegram stock trading groups
        v_scam1 = self.embedder._generate_deterministic_vector(
            "Fraudulent VIP Telegram trading groups offering guaranteed stock market profits"
        )
        v_scam2 = self.embedder._generate_deterministic_vector(
            "WhatsApp fake trading group promising upper circuit stock returns"
        )
        # Unrelated culinary text
        v_unrelated = self.embedder._generate_deterministic_vector(
            "Classic Italian pasta recipe with fresh tomato basil sauce and olive oil"
        )

        sim_scam = self.embedder.cosine_similarity(v_scam1, v_scam2)
        sim_unrelated = self.embedder.cosine_similarity(v_scam1, v_unrelated)

        # Semantic proximity check: scam-to-scam similarity is higher than scam-to-unrelated
        self.assertGreater(sim_scam, sim_unrelated)

    def test_cli_dry_run_executes_cleanly(self):
        code = run_embedding_generation(
            source_id=None,
            all_sources=True,
            dry_run=True,
        )
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
