"""
Vector Index Query Script.
Performs semantic vector searches over approved knowledge-base passages
with strong metadata filtering by publisher, source type, date, and topic.

Usage:
    python scripts/query_vector_index.py --dry-run
    python scripts/query_vector_index.py --publisher SEBI --topic telegram_vip
    python scripts/query_vector_index.py --source-type official_advisory --top-k 3
"""
import argparse
import sys
from typing import List

from backend.core.embedding_pipeline import EmbeddingPipeline
from backend.core.vector_index import VectorIndex
from backend.schemas.vector_index import VectorQueryFilter


def run_vector_query(
    query_text: str | None,
    publisher: str | None,
    source_type: str | None,
    topic: str | None,
    date_after: str | None,
    date_before: str | None,
    top_k: int,
    dry_run: bool,
) -> int:
    index = VectorIndex()
    embedder = EmbeddingPipeline()

    print("=== Sangyan AI Vector Index Query Engine ===")
    print(f"Total Index Items: {index.total_count()}")
    print("Filters Configured:")
    print(f"  Publisher: {publisher or 'Any'}")
    print(f"  Source Type: {source_type or 'Any'}")
    print(f"  Topic: {topic or 'Any'}")
    print(f"  Date Range: [{date_after or '*'} to {date_before or '*'}]")

    if dry_run:
        print("  [DRY-RUN] Vector index structure verified. Query execution skipped.")
        return 0

    q_filter = VectorQueryFilter(
        publisher=publisher,
        source_type=source_type,
        topic=topic,
        date_after=date_after,
        date_before=date_before,
    )

    sample_query = query_text or "guaranteed stock returns telegram group"
    q_vec = embedder._generate_deterministic_vector(sample_query)

    results = index.query(query_vector=q_vec, top_k=top_k, filters=q_filter)
    print(f"\n[QUERY] '{sample_query}' (Returned: {len(results)} matches)")

    for rank, res in enumerate(results, start=1):
        print(f"\n#{rank} [Score: {res.score:.4f}] {res.id}")
        print(f"   Publisher: {res.metadata.publisher} | Date: {res.metadata.publication_date or 'N/A'}")
        print(f"   Topic: {res.metadata.topic or 'General'} | Source: {res.metadata.source_url}")
        print(f"   Text: {res.text[:120]}...")

    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Query vector index with strong metadata filtering.")
    parser.add_argument("--query", type=str, help="Search query text")
    parser.add_argument("--publisher", type=str, help="Filter by publisher (e.g. SEBI, RBI)")
    parser.add_argument("--source-type", type=str, help="Filter by source type (e.g. official_advisory)")
    parser.add_argument("--topic", type=str, help="Filter by scam topic (e.g. telegram_vip)")
    parser.add_argument("--date-after", type=str, help="Filter published on or after YYYY-MM-DD")
    parser.add_argument("--date-before", type=str, help="Filter published on or before YYYY-MM-DD")
    parser.add_argument("--top-k", type=int, default=5, help="Number of results to return")
    parser.add_argument("--dry-run", action="store_true", help="Check index without searching")

    args = parser.parse_args()
    code = run_vector_query(
        query_text=args.query,
        publisher=args.publisher,
        source_type=args.source_type,
        topic=args.topic,
        date_after=args.date_after,
        date_before=args.date_before,
        top_k=args.top_k,
        dry_run=args.dry_run,
    )
    sys.exit(code)


if __name__ == "__main__":
    main()
