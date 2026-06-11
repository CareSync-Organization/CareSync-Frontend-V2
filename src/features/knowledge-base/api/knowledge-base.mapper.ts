import type { KnowledgeDocDTO, KnowledgeDocument } from "../types/knowledge-base.types";

export function mapKnowledgeDocDto(dto: KnowledgeDocDTO): KnowledgeDocument {
    return {
        id: dto.id,
        title: dto.title,
        documentType: dto.document_type,
        fileName: dto.title,
        fileType: dto.file_extension.toUpperCase(),
        fileSizeKb: Math.max(1, Math.round(dto.file_size / 1024)),
        uploadedAt: dto.created_at,
        fileUrl: dto.file_url
    };
}