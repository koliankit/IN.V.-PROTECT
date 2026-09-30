"""
Evidence Store & Retrieval Management.
Loads, validates, and manages ingested official regulatory material (SEBI, I4C, RBI, CERT-In).
"""
import hashlib
import json
import os
from typing import Any, Dict, List, Optional
from backend.schemas.analysis import EvidenceItem


class EvidenceStore:
    def __init__(self, official_dir: Optional[str] = None):
        if official_dir is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            official_dir = os.path.join(base_dir, "data", "official")
        self.official_dir = official_dir
        self._documents: Dict[str, Dict[str, Any]] = {}
        self.load_all_evidence()

    def load_all_evidence(self) -> None:
        if not os.path.isdir(self.official_dir):
            return

        for fname in os.listdir(self.official_dir):
            if fname.endswith(".json"):
                full_path = os.path.join(self.official_dir, fname)
                with open(full_path, "r", encoding="utf-8") as f:
                    doc = json.load(f)
                    source_id = doc.get("source_id")
                    if source_id:
                        self._documents[source_id] = doc

    def get_document(self, source_id: str) -> Optional[Dict[str, Any]]:
        return self._documents.get(source_id)

    def find_evidence_by_keyword(self, keyword: str, limit: int = 3) -> List[EvidenceItem]:
        kw = keyword.lower()
        results: List[EvidenceItem] = []

        for source_id, doc in self._documents.items():
            publisher = doc.get("publisher", "Official Regulator")
            title = doc.get("title", "")
            url = doc.get("url", "")

            for sec in doc.get("sections", []):
                content = sec.get("content", "")
                title_sec = sec.get("section_title", "")
                if kw in content.lower() or kw in title_sec.lower():
                    results.append(
                        EvidenceItem(
                            source_id=source_id,
                            publisher=publisher,
                            title=title,
                            url=url,
                            passage=content,
                            relevance_score=0.9,
                        )
                    )
                    if len(results) >= limit:
                        return results
        return results


# Global evidence store singleton
evidence_store = EvidenceStore()
