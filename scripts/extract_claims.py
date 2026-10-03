"""
Command-line interface for extracting factual claims from user-submitted text.
Supports text inputs, file inputs, dry-run mode, and formatted JSON outputs.
"""
import argparse
import json
import sys
from typing import Optional

from backend.core.claim_extractor import ClaimExtractor
from backend.schemas.claim_extraction import UserSubmission


def run_claim_extraction(
    text: Optional[str] = None,
    file_path: Optional[str] = None,
    channel: str = "cli",
    dry_run: bool = False,
    as_json: bool = False,
) -> None:
    if file_path:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    elif text:
        content = text
    else:
        # Default sample for demonstration / testing
        content = (
            "Hello sir, good morning!\n"
            "Join our VIP institutional group today. We guarantee 50% profit daily.\n"
            "We are SEBI registered investment advisor INA00012345.\n"
            "Pay Rs 5,000 withdrawal processing fee to release your earnings.\n"
            "Only 3 slots remaining, offer expires in 1 hour!"
        )

    print("=== Sangyan AI Claim Extraction Engine ===")
    if dry_run:
        print(f"[DRY-RUN] Processing text input ({len(content)} chars). Channel: {channel}")
        extractor = ClaimExtractor()
        units = extractor.segment_discourse(content)
        print(f"[DRY-RUN] Discourse segmentation produced {len(units)} units. Extraction pipeline verified.")
        return

    submission = UserSubmission(
        submission_id="SUB-DEMO-001",
        text=content,
        source_channel=channel,
    )

    extractor = ClaimExtractor()
    result = extractor.extract_claims(submission)

    if as_json:
        print(json.dumps(result.model_dump(), indent=2))
        return

    print(f"Submission ID: {result.submission_id}")
    print(f"Total Text Length: {result.original_text_length} characters")
    print(f"Discourse Units Evaluated: {result.discourse_units_count}")
    print(f"Total Claims Extracted: {result.total_claims}")
    print(f"Processing Time: {result.processing_time_ms} ms")
    print("-" * 60)

    for i, claim in enumerate(result.claims, 1):
        print(f"Claim #{i} [{claim.claim_id}]")
        print(f"  Type: {claim.claim_type.value}")
        print(f"  Confidence: {claim.confidence}")
        print(f"  Text: \"{claim.claim_text}\"")
        print(f"  Span: ({claim.span.start}, {claim.span.end})")
        if claim.extracted_entities:
            print(f"  Entities: {', '.join(claim.extracted_entities)}")
        print()


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract factual claims from user-submitted content.")
    parser.add_argument("--text", type=str, help="Raw message text to analyze")
    parser.add_argument("--file", type=str, help="Path to text file containing message")
    parser.add_argument("--channel", type=str, default="cli", help="Submission channel (e.g. telegram, whatsapp, ocr)")
    parser.add_argument("--dry-run", action="store_true", help="Run pre-checks without full extraction execution")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = parser.parse_args()
    run_claim_extraction(
        text=args.text,
        file_path=args.file,
        channel=args.channel,
        dry_run=args.dry_run,
        as_json=args.json,
    )


if __name__ == "__main__":
    main()
