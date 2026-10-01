"""
Reproducible Public Dataset Downloader Script.
Downloads approved public datasets into data/raw/ while verifying licenses
and recording SHA-256 checksums in data/manifests/dataset_downloads.json.

Usage:
    python scripts/download_datasets.py --all
    python scripts/download_datasets.py --dataset-id DATASET_UCI_SPAM
    python scripts/download_datasets.py --all --dry-run
"""
import argparse
import os
import sys
from typing import Dict, List

from backend.core.dataset_downloader import DatasetDownloader
from backend.core.dataset_license import DatasetLicenseVerifier
from backend.schemas.dataset_downloader import DownloadStatus

DATASET_TARGET_MAPPING: Dict[str, Dict[str, str]] = {
    "DATASET_UCI_SPAM": {
        "filename": "smsspamcollection.zip",
        "direct_url": "https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip",
    },
    "DATASET_ENRON_FIN_SPAM": {
        "filename": "enron_financial_sample.json",
        "direct_url": "https://www.cs.cmu.edu/~enron/sample.json",
    },
    "DATASET_INDIAN_FIN_COMMUNITY": {
        "filename": "indian_scam_corpus_sample.json",
        "direct_url": "https://raw.githubusercontent.com/academic-cyber-research/indian-scam-corpus/main/data/sample.json",
    },
}


def run_downloader(
    dataset_id: str | None,
    download_all: bool,
    dry_run: bool,
    force: bool,
) -> int:
    verifier = DatasetLicenseVerifier()
    downloader = DatasetDownloader(license_verifier=verifier)

    records = verifier.list_all()
    if not records:
        print("[ERROR] No registered datasets found in license registry.")
        return 1

    targets: List[str] = []
    if download_all:
        targets = [r.dataset_id for r in records]
    elif dataset_id:
        targets = [dataset_id]
    else:
        print("[ERROR] Must specify either --dataset-id <ID> or --all.")
        return 1

    print(f"=== Sangyan AI Dataset Downloader (Dry Run: {dry_run}) ===")
    exit_code = 0

    for target_id in targets:
        rec = verifier.get_record(target_id)
        if not rec:
            print(f"[REJECT] Dataset '{target_id}' not found in approved registry.")
            exit_code = 1
            continue

        meta = DATASET_TARGET_MAPPING.get(target_id, {
            "filename": f"{target_id.lower()}.dat",
            "direct_url": rec.provenance_url,
        })
        target_fn = meta["filename"]
        url = meta["direct_url"]

        print(f"\nTarget: {rec.dataset_id} ({rec.dataset_name})")
        print(f"  License: {rec.license_type} (Verified: {rec.license_verified})")
        print(f"  Source URL: {url}")
        print(f"  Destination: data/raw/{target_fn}")

        if dry_run:
            print("  [DRY-RUN] Pre-checks passed. Download skipped.")
            continue

        result = downloader.download_approved_dataset(
            dataset_id=rec.dataset_id,
            target_filename=target_fn,
            direct_url=url,
            force=force,
        )

        if result.status in (DownloadStatus.SUCCESS, DownloadStatus.CACHED):
            print(f"  [{result.status.value.upper()}] Stored: {result.raw_file_path}")
            print(f"  SHA-256: {result.sha256_checksum}")
            print(f"  Size: {result.file_size_bytes} bytes")
        else:
            print(f"  [FAILED] {result.error_message}")
            exit_code = 1

    return exit_code


def main() -> None:
    parser = argparse.ArgumentParser(description="Download approved public datasets for Sangyan AI.")
    parser.add_argument("--dataset-id", type=str, help="Specific approved dataset ID to download")
    parser.add_argument("--all", action="store_true", help="Download all approved public datasets")
    parser.add_argument("--dry-run", action="store_true", help="Simulate download process without fetching")
    parser.add_argument("--force", action="store_true", help="Force re-download even if already present")

    args = parser.parse_args()
    code = run_downloader(
        dataset_id=args.dataset_id,
        download_all=args.all,
        dry_run=args.dry_run,
        force=args.force,
    )
    sys.exit(code)


if __name__ == "__main__":
    main()
