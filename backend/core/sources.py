"""
Official Source Registry Loader and Verification Manager.
Loads, validates, and manages authoritative regulatory sources (SEBI, I4C, RBI, CERT-In, NCRB).
"""
import json
import os
from typing import Dict, List, Optional
from backend.schemas.provenance import ProvenanceRecord, SourceType, AllowedUse


class SourceRegistry:
    def __init__(self, registry_file: Optional[str] = None):
        if registry_file is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            registry_file = os.path.join(base_dir, "data", "manifests", "official_source_registry.json")

        self.registry_file = registry_file
        self._sources: Dict[str, ProvenanceRecord] = {}
        self.load_registry()

    def load_registry(self) -> None:
        if not os.path.isfile(self.registry_file):
            return

        with open(self.registry_file, "r", encoding="utf-8") as f:
            raw_entries = json.load(f)

        for entry in raw_entries:
            record = ProvenanceRecord(**entry)
            self._sources[record.source_id] = record

    def get_source(self, source_id: str) -> Optional[ProvenanceRecord]:
        return self._sources.get(source_id)

    def list_all(self) -> List[ProvenanceRecord]:
        return list(self._sources.values())

    def filter_by_use(self, allowed_use: AllowedUse) -> List[ProvenanceRecord]:
        return [s for s in self._sources.values() if s.allowed_use == allowed_use]

    def filter_by_publisher(self, publisher_keyword: str) -> List[ProvenanceRecord]:
        kw = publisher_keyword.lower()
        return [s for s in self._sources.values() if kw in s.publisher.lower()]


# Global registry singleton
official_registry = SourceRegistry()
