"""
Official Source Change Detection Script.
Evaluates official regulatory documents against stored snapshot versions.
When an update is detected, creates a new version while retaining all prior versions.

Usage:
    python scripts/detect_source_changes.py --all --dry-run
    python scripts/detect_source_changes.py --source-id SRC001
    python scripts/detect_source_changes.py --all
"""
import argparse
import os
import sys
from typing import List

from backend.core.change_detection import SourceChangeDetector
from backend.core.sources import official_registry
from backend.schemas.change_detection import ChangeDetectionStatus


def run_change_detection(
    source_id: str | None,
    all_sources: bool,
    dry_run: bool,
) -> int:
    registry = official_registry
    detector = SourceChangeDetector()

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

    print(f"=== Sangyan AI Source Change Detector (Dry Run: {dry_run}) ===")
    exit_code = 0

    # Locate sample or official data directory
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    official_dir = os.path.join(base_dir, "data", "official")

    for target_id in targets:
        s = registry.get_source(target_id)
        if not s:
            print(f"[REJECT] Unknown source ID: {target_id}")
            exit_code = 1
            continue

        latest_snap = detector.snapshot_manager.get_latest_snapshot(target_id)
        current_version_str = f"v{latest_snap.version}" if latest_snap else "None"

        print(f"\nSource: {s.source_id} | {s.publisher}")
        print(f"  Title: {s.title}")
        print(f"  Current Registered Version: {current_version_str}")

        if dry_run:
            print("  [DRY-RUN] Source registered. Request skipped.")
            continue

        # Look for local source file or fallback content
        source_bytes: bytes = b""
        for fn in os.listdir(official_dir):
            if fn.startswith(target_id):
                with open(os.path.join(official_dir, fn), "rb") as f_in:
                    source_bytes = f_in.read()
                break

        if not source_bytes:
            source_bytes = f"Authoritative documentation record for {s.title}".encode("utf-8")

        result = detector.detect_and_version(
            source_id=target_id,
            current_content=source_bytes,
            file_extension="json",
            change_note="Evaluated via detect_source_changes script",
        )

        if result.status == ChangeDetectionStatus.INITIAL_VERSION:
            print(f"  [INITIAL VERSION] Created {result.new_snapshot_id}")
        elif result.status == ChangeDetectionStatus.NO_CHANGE:
            print(f"  [NO CHANGE] Verified identical hash with {result.previous_snapshot_id}")
        elif result.status == ChangeDetectionStatus.VERSION_INCREMENTED:
            diff = result.diff_summary
            if diff:
                print(
                    f"  [VERSION INCREMENTED] Created {result.new_snapshot_id} "
                    f"(v{diff.previous_version} -> v{diff.new_version}, delta: {diff.byte_delta} bytes)"
                )
            else:
                print(f"  [VERSION INCREMENTED] Created {result.new_snapshot_id}")

    return exit_code


def main() -> None:
    parser = argparse.ArgumentParser(description="Detect official source updates and manage versions.")
    parser.add_argument("--source-id", type=str, help="Specific source ID to inspect")
    parser.add_argument("--all", action="store_true", help="Inspect all registered official sources")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing snapshots")

    args = parser.parse_args()
    code = run_change_detection(
        source_id=args.source_id,
        all_sources=args.all,
        dry_run=args.dry_run,
    )
    sys.exit(code)


if __name__ == "__main__":
    main()
