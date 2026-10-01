"""
Document Chunker Engine.
Segments official documents into retrieval-friendly passages for vector indexing and RAG.
Guarantees that every chunk strictly retains source_id, document_id, page/section, and text.
"""
import re
from typing import Any, Dict, List, Optional

from backend.schemas.document_chunk import (
    ChunkingConfig,
    ChunkingResult,
    DocumentChunk,
)
from backend.schemas.document_parser import ParsedDocument, ParsedDocumentBlock


class DocumentChunker:
    def __init__(self, config: Optional[ChunkingConfig] = None):
        self.config = config or ChunkingConfig()

    @staticmethod
    def _split_into_sentences(text: str) -> List[str]:
        # Split on sentence terminals while keeping punctuation intact
        raw_sentences = re.split(r"(?<=[.!?])\s+", text.strip())
        return [s.strip() for s in raw_sentences if len(s.strip()) > 0]

    def chunk_block(
        self,
        source_id: str,
        document_id: str,
        section_title: str,
        text: str,
        page_number: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
        starting_index: int = 0,
    ) -> List[DocumentChunk]:
        """
        Chunks a block of text into retrieval-friendly passages.
        Retains source_id, document_id, page/section, and text on every chunk.
        """
        clean_text = " ".join(text.split()).strip()
        if not clean_text:
            return []

        page_str = f"Page {page_number}" if page_number else "Section Document"
        page_or_section = f"{page_str} / {section_title}"

        meta = metadata or {}
        max_size = self.config.max_chunk_size_chars
        overlap = self.config.chunk_overlap_chars

        # If text is already short enough to fit in a single chunk
        if len(clean_text) <= max_size:
            chunk = DocumentChunk(
                chunk_id=f"CHK_{source_id}_{document_id[:8]}_{starting_index:03d}",
                source_id=source_id,
                document_id=document_id,
                page_or_section=page_or_section,
                page_number=page_number,
                section_title=section_title,
                text=clean_text,
                token_count_approx=len(clean_text.split()),
                chunk_index=starting_index,
                metadata=meta,
            )
            return [chunk]

        # Multi-chunk segmentation respecting sentence boundaries
        sentences = self._split_into_sentences(clean_text)
        chunks: List[DocumentChunk] = []
        current_chunk_sentences: List[str] = []
        current_len = 0
        chunk_idx = starting_index

        for sentence in sentences:
            sentence_len = len(sentence) + 1
            if current_len + sentence_len > max_size and current_chunk_sentences:
                chunk_text = " ".join(current_chunk_sentences).strip()
                if len(chunk_text) >= self.config.min_chunk_size_chars:
                    chunks.append(
                        DocumentChunk(
                            chunk_id=f"CHK_{source_id}_{document_id[:8]}_{chunk_idx:03d}",
                            source_id=source_id,
                            document_id=document_id,
                            page_or_section=page_or_section,
                            page_number=page_number,
                            section_title=section_title,
                            text=chunk_text,
                            token_count_approx=len(chunk_text.split()),
                            chunk_index=chunk_idx,
                            metadata=meta,
                        )
                    )
                    chunk_idx += 1

                # Carry over overlap sentence(s)
                overlap_sentences: List[str] = []
                overlap_len = 0
                for s in reversed(current_chunk_sentences):
                    if overlap_len + len(s) <= overlap:
                        overlap_sentences.insert(0, s)
                        overlap_len += len(s) + 1
                    else:
                        break

                current_chunk_sentences = overlap_sentences
                current_len = sum(len(s) + 1 for s in current_chunk_sentences)

            current_chunk_sentences.append(sentence)
            current_len += sentence_len

        # Flush remaining sentence buffer
        if current_chunk_sentences:
            remaining_text = " ".join(current_chunk_sentences).strip()
            if remaining_text:
                chunks.append(
                    DocumentChunk(
                        chunk_id=f"CHK_{source_id}_{document_id[:8]}_{chunk_idx:03d}",
                        source_id=source_id,
                        document_id=document_id,
                        page_or_section=page_or_section,
                        page_number=page_number,
                        section_title=section_title,
                        text=remaining_text,
                        token_count_approx=len(remaining_text.split()),
                        chunk_index=chunk_idx,
                        metadata=meta,
                    )
                )

        return chunks

    def chunk_parsed_document(
        self,
        parsed_doc: ParsedDocument,
        config: Optional[ChunkingConfig] = None,
    ) -> ChunkingResult:
        """
        Chunks all structured blocks of a ParsedDocument into retrieval passages.
        """
        if config is not None:
            self.config = config

        doc_meta = parsed_doc.metadata.model_dump()
        all_chunks: List[DocumentChunk] = []
        global_idx = 0

        for block in parsed_doc.blocks:
            block_chunks = self.chunk_block(
                source_id=parsed_doc.metadata.source_id,
                document_id=parsed_doc.document_id,
                section_title=block.heading,
                text=block.text,
                page_number=block.page_number,
                metadata=doc_meta,
                starting_index=global_idx,
            )
            all_chunks.extend(block_chunks)
            global_idx += len(block_chunks)

        total_chars = sum(len(c.text) for c in all_chunks)
        avg_size = (total_chars / len(all_chunks)) if all_chunks else 0.0

        return ChunkingResult(
            document_id=parsed_doc.document_id,
            source_id=parsed_doc.metadata.source_id,
            total_chunks=len(all_chunks),
            chunks=all_chunks,
            average_chunk_size=round(avg_size, 2),
        )
