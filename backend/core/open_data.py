"""
Government Open Data & Candidate Dataset Registry.
Indexes and evaluates datasets discovered on data.gov.in (NCRB, RBI, I4C)
for macro risk context, ensuring aggregate statistics are never mistakenly used as text-training records.
"""
import json
import os
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class CandidateDataset(BaseModel):
    dataset_id: str
    source_id: str
    catalog_name: str
    title: str
    portal: str
    url: str
    ministry_or_department: str
    license: str
    data_type: str
    granularity: str
    content_hash: str
    relevant_keywords: List[str] = Field(default_factory=list)
    allowed_use: str
    evaluation_notes: str


class CandidateDatasetRegistry:
    def __init__(self, registry_path: Optional[str] = None) -> None:
        if registry_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            registry_path = os.path.join(base_dir, "data", "manifests", "candidate_datasets_registry.json")
        self.registry_path = registry_path
        self._datasets: Dict[str, CandidateDataset] = {}
        self.load_registry()

    def load_registry(self) -> None:
        if not os.path.isfile(self.registry_path):
            return

        with open(self.registry_path, "r", encoding="utf-8") as f:
            entries = json.load(f)

        for entry in entries:
            cd = CandidateDataset(**entry)
            self._datasets[cd.dataset_id] = cd

    def get_dataset(self, dataset_id: str) -> Optional[CandidateDataset]:
        return self._datasets.get(dataset_id)

    def list_all(self) -> List[CandidateDataset]:
        return list(self._datasets.values())

    def search_by_keyword(self, keyword: str) -> List[CandidateDataset]:
        kw = keyword.lower()
        results: List[CandidateDataset] = []
        for d in self._datasets.values():
            if (
                kw in d.title.lower()
                or kw in d.catalog_name.lower()
                or any(kw in k.lower() for k in d.relevant_keywords)
            ):
                results.append(d)
        return results

    def is_eligible_for_training(self, dataset_id: str) -> bool:
        ds = self.get_dataset(dataset_id)
        if not ds:
            return False
        # Aggregate statistics from data.gov.in cannot be used as text classification training labels
        if ds.data_type == "aggregate_statistics" or ds.allowed_use == "impact_context":
            return False
        return True


candidate_dataset_registry = CandidateDatasetRegistry()
