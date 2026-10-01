"""
Controlled Official Document Downloader Script.
Downloads approved statutory regulatory advisories (SEBI, I4C, RBI, CERT-In),
preserves raw PDF/HTML payloads under data/raw/official/, computes SHA-256 hashes,
and parses sections into structured snapshots.

Usage:
    python scripts/download_official_documents.py --all --dry-run
    python scripts/download_official_documents.py --source-id SRC001
    python scripts/download_official_documents.py --all
"""
import argparse
import sys
from typing import List

from backend.core.official_downloader import OfficialDocumentDownloader
from backend.core.sources import official_registry


def run_official_downloader(
    source_id: str | None,
    all_sources: bool,
    dry_run: bool,
    force: bool,
) -> int:
    registry = official_registry
    downloader = OfficialDocumentDownloader(registry=registry)

    sources = registry.list_all()
    if not sources:
        print("[ERROR] Official source registry is empty.")
        return 1

    targets: List[str] = []
    if all_sources:
        targets = [s.source_id for s in sources]
    elif source_id:
        targets = [source_id]
    else:
        print("[ERROR] Must specify either --source-id <SRCXXX> or --all.")
        return 1

    print(f"=== Sangyan AI Official Document Downloader (Dry Run: {dry_run}) ===")
    exit_code = 0

    for target_id in targets:
        s = registry.get_source(target_id)
        if not s:
            print(f"[REJECT] Unknown source ID: {target_id}")
            exit_code = 1
            continue

        fmt = downloader.determine_format(s.url)
        print(f"\nSource: {s.source_id} | {s.publisher}")
        print(f"  Title: {s.title}")
        print(f"  URL: {s.url}")
        print(f"  Detected Format: {fmt.value.upper()}")

        if dry_run:
            print("  [DRY-RUN] Verification passed. Request skipped.")
            continue

        try:
            snapshot = downloader.fetch_and_parse(
                source_id=s.source_id,
                force=force,
            )
            print(f"  [SUCCESS] Preserved: {snapshot.raw_file_path}")
            print(f"  Hash: {snapshot.content_hash}")
            print(f"  Parser: {snapshot.parser_used}")
            print(f"  Sections Parsed: {snapshot.parsed_sections_count}")
        except Exception as e:
            print(f"  [ERROR] {str(e)}")
            exit_code = 1

    return exit_code


def main() -> None:
    parser = argparse.ArgumentParser(description="Download and parse official regulatory documents.")
    parser.add_argument("--source-id", type=str, help="Specific source ID (e.g. SRC001)")
    parser.add_argument("--all", action="store_true", help="Download and parse all official sources")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without network request")
    parser.add_argument("--force", action="store_true", help="Force re-download and re-parse")

    args = parser.parse_args()
    code = run_official_downloader(
        source_id=args.source_id,
        all_sources=args.all,
        dry_run=args.dry_run,
        force=args.force,
    )
    sys.exit(code)


if __name__ == "__main__":
    main()
