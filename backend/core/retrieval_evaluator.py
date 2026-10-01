"""
Retrieval Evaluation Engine.
Measures retrieval efficacy against realistic investor-safety questions.
Computes Hit@K (Rank 1, 3, 5), Mean Reciprocal Rank (MRR), and Recall@K
to verify authoritative regulatory evidence retrieval.
"""
from datetime import datetime, timezone
import json
import os
from typing import List, Optional

from backend.core.embedding_pipeline import EmbeddingPipeline
from backend.core.vector_index import VectorIndex
from backend.schemas.retrieval_evaluation import (
    RetrievalBenchmarkQuery,
    RetrievalBenchmarkReport,
    RetrievalQueryMetric,
)


class RetrievalEvaluator:
    def __init__(
        self,
        vector_index: Optional[VectorIndex] = None,
        embedder: Optional[EmbeddingPipeline] = None,
        benchmark_path: Optional[str] = None,
    ):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.vector_index = vector_index or VectorIndex()
        self.embedder = embedder or EmbeddingPipeline()
        self.benchmark_path = benchmark_path or os.path.join(
            base_dir, "data", "manifests", "retrieval_evaluation_set.json"
        )

    def load_benchmark_queries(self) -> List[RetrievalBenchmarkQuery]:
        if not os.path.isfile(self.benchmark_path):
            return []
        with open(self.benchmark_path, "r", encoding="utf-8") as f:
            raw = json.load(f)
        return [RetrievalBenchmarkQuery(**item) for item in raw]

    def evaluate_query(
        self,
        query: RetrievalBenchmarkQuery,
        top_k: int = 5,
    ) -> RetrievalQueryMetric:
        """
        Executes query against vector index and measures retrieval performance against targets.
        """
        q_vec = self.embedder._generate_deterministic_vector(query.query_text)
        results = self.vector_index.query(query_vector=q_vec, top_k=top_k)

        retrieved_source_ids: List[str] = []
        retrieved_scores: List[float] = []

        for r in results:
            src_id = (
                r.metadata.extra.get("source_id")
                or (r.id.split("_")[1] if "_" in r.id else "")
                or r.metadata.publisher
            )
            # If id starts with CHK_SRC001, extract SRC001
            for target in query.target_source_ids:
                if target in r.id or target in str(r.metadata.source_url):
                    src_id = target
                    break
            retrieved_source_ids.append(src_id)
            retrieved_scores.append(r.score)

        targets_set = set(query.target_source_ids)

        # Hit@1
        hit_at_1 = bool(retrieved_source_ids and (retrieved_source_ids[0] in targets_set))

        # Hit@3
        hit_at_3 = any(s in targets_set for s in retrieved_source_ids[:3])

        # Hit@5
        hit_at_5 = any(s in targets_set for s in retrieved_source_ids[:5])

        # Reciprocal Rank (MRR component)
        rr = 0.0
        for rank, s_id in enumerate(retrieved_source_ids, start=1):
            if s_id in targets_set:
                rr = 1.0 / rank
                break

        # Recall@5
        matched_targets = {s for s in retrieved_source_ids[:5] if s in targets_set}
        recall_5 = len(matched_targets) / len(targets_set) if targets_set else 0.0

        return RetrievalQueryMetric(
            query_id=query.query_id,
            query_text=query.query_text,
            target_source_ids=query.target_source_ids,
            retrieved_source_ids=retrieved_source_ids,
            retrieved_scores=retrieved_scores,
            hit_at_1=hit_at_1,
            hit_at_3=hit_at_3,
            hit_at_5=hit_at_5,
            reciprocal_rank=round(rr, 4),
            recall_at_5=round(recall_5, 4),
        )

    def run_benchmark(self, top_k: int = 5) -> RetrievalBenchmarkReport:
        queries = self.load_benchmark_queries()
        if not queries:
            now_iso = datetime.now(timezone.utc).isoformat()
            return RetrievalBenchmarkReport(
                total_queries=0,
                hit_rate_at_1=0.0,
                hit_rate_at_3=0.0,
                hit_rate_at_5=0.0,
                mean_reciprocal_rank=0.0,
                average_recall_at_5=0.0,
                evaluated_at=now_iso,
                query_metrics=[],
            )

        metrics: List[RetrievalQueryMetric] = []
        for q in queries:
            m = self.evaluate_query(q, top_k=top_k)
            metrics.append(m)

        n = len(metrics)
        hit_1 = sum(1 for m in metrics if m.hit_at_1) / n
        hit_3 = sum(1 for m in metrics if m.hit_at_3) / n
        hit_5 = sum(1 for m in metrics if m.hit_at_5) / n
        mrr = sum(m.reciprocal_rank for m in metrics) / n
        avg_recall = sum(m.recall_at_5 for m in metrics) / n
        now_iso = datetime.now(timezone.utc).isoformat()

        return RetrievalBenchmarkReport(
            total_queries=n,
            hit_rate_at_1=round(hit_1, 4),
            hit_rate_at_3=round(hit_3, 4),
            hit_rate_at_5=round(hit_5, 4),
            mean_reciprocal_rank=round(mrr, 4),
            average_recall_at_5=round(avg_recall, 4),
            evaluated_at=now_iso,
            query_metrics=metrics,
        )
