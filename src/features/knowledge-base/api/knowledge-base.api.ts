import { apiFormData } from "@/lib/api"
import type {
    KnowledgeDocInput,
    KnowledgeDocDTO
} from "../types/knowledge-base.types"

export async function createKnowledgeDoc(
    input: KnowledgeDocInput,
): Promise<KnowledgeDocDTO> {
    const formData = new FormData();
    formData.append("store_id", input.storeId);
    formData.append("title", input.title);
    formData.append("document_type", input.document_type);
    formData.append("file", input.file)

    return apiFormData<KnowledgeDocDTO>("/api/knowledge_base", formData)
}