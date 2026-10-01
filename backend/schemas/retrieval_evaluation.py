"""
Retrieval Evaluation Schema.
Defines schemas for benchmark queries, per-query retrieval metrics (Hit@K, MRR, Recall@K),
and aggregate evaluation reports measuring authoritative regulatory passage retrieval.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RetrievalBenchmarkQuery(BaseModel):
    query_id: str = Field(..., description="Unique query identifier (e.g. EVAL_Q01)")
    query_text: str = Field(..., min_length=10, description="Realistic investor-safety question")
    target_source_ids: List[str] = Field(..., min_length=1, description="Expected authoritative source IDs (e.g. SRC001)")
    relevant_topics: List[str] = Field(default_factory=list, description="Target scam topics")
    required_keywords: List[str] = Field(default_factory=list, description="Keywords expected in authoritative evidence")
    scam_vector: str = Field(..., description="Target scam vector")
    difficulty: str = Field("standard", description="standard, hard, or adversarial")


class RetrievalQueryMetric(BaseModel):
    query_id: str
    query_text: str
    target_source_ids: List[str]
    retrieved_source_ids: List[str]
    retrieved_scores: List[float]
    hit_at_1: bool
    hit_at_3: bool
    hit_at_5: bool
    reciprocal_rank: float = Field(..., ge=0.0, le=1.0)
    recall_at_5: float = Field(..., ge=0.0, le=1.0)


class RetrievalBenchmarkReport(BaseModel):
    total_queries: int = Field(..., ge=1)
    hit_rate_at_1: float = Field(..., ge=0.0, le=1.0, description="Proportion of queries with relevant source at Rank 1")
    hit_rate_at_3: float = Field(..., ge=0.0, le=1.0, description="Proportion of queries with relevant source in Top 3")
    hit_rate_at_5: float = Field(..., ge=0.0, le=1.0, description="Proportion of queries with relevant source in Top 5")
    mean_reciprocal_rank: float = Field(..., ge=0.0, le=1.0, description="Mean Reciprocal Rank (MRR)")
    average_recall_at_5: float = Field(..., ge=0.0, le=1.0, description="Average Recall across queries at Top 5")
    evaluated_at: str
    query_metrics: List[RetrievalQueryMetric] = Field(default_factory=list)
