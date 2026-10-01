"""
Retrieval Evaluation Script.
Runs retrieval benchmarks against realistic investor-safety questions.
Measures whether authoritative regulatory passages (SEBI, I4C, RBI, CERT-In) are accurately retrieved.

Usage:
    python scripts/evaluate_retrieval.py --dry-run
    python scripts/evaluate_retrieval.py --top-k 5
"""
import argparse
import sys

from backend.core.retrieval_evaluator import RetrievalEvaluator


def run_benchmark_cli(top_k: int, dry_run: bool) -> int:
    evaluator = RetrievalEvaluator()
    queries = evaluator.load_benchmark_queries()

    print("=== Sangyan AI Retrieval Evaluation Benchmark ===")
    print(f"Loaded Benchmark Queries: {len(queries)}")

    if dry_run:
        print("  [DRY-RUN] Benchmark dataset validated. Evaluation skipped.")
        return 0

    report = evaluator.run_benchmark(top_k=top_k)

    print("\n--- Summary Performance Metrics ---")
    print(f"  Total Queries Evaluated: {report.total_queries}")
    print(f"  Hit Rate @ 1:           {report.hit_rate_at_1:.2%}")
    print(f"  Hit Rate @ 3:           {report.hit_rate_at_3:.2%}")
    print(f"  Hit Rate @ 5:           {report.hit_rate_at_5:.2%}")
    print(f"  Mean Reciprocal Rank:   {report.mean_reciprocal_rank:.4f}")
    print(f"  Average Recall @ 5:     {report.average_recall_at_5:.2%}")

    print("\n--- Per-Query Results ---")
    for qm in report.query_metrics:
        status_icon = "[PASS]" if qm.hit_at_5 else "[MISS]"
        print(f"  {status_icon} {qm.query_id} (MRR: {qm.reciprocal_rank:.2f}, Hit@1: {qm.hit_at_1})")
        print(f"         Query: {qm.query_text[:80]}...")
        print(f"         Target: {qm.target_source_ids} | Retrieved: {qm.retrieved_source_ids[:3]}")

    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate knowledge-base retrieval on investor safety questions.")
    parser.add_argument("--top-k", type=int, default=5, help="Number of retrieved results to inspect")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without running queries")

    args = parser.parse_args()
    code = run_benchmark_cli(top_k=args.top_k, dry_run=args.dry_run)
    sys.exit(code)


if __name__ == "__main__":
    main()
