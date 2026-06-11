import { api, apiFormData } from "@/lib/api"
import type {
    KnowledgeDocInput,
    KnowledgeDocDTO,
    UpdateKnowledgeDocInput
} from "../types/knowledge-base.types"

// mutation apis
export async function createKnowledgeDoc(
    input: KnowledgeDocInput,
): Promise<KnowledgeDocDTO> {
    const formData = new FormData();
    formData.append("store_id", input.storeId);
    formData.append("title", input.title);
    formData.append("document_type", input.documentType);
    formData.append("file", input.file)

    return apiFormData<KnowledgeDocDTO>("/api/knowledge_base/", formData)
}


export async function updateKnowledgeDoc(input: UpdateKnowledgeDocInput): Promise<KnowledgeDocDTO> {
    const formData = new FormData()
    formData.append("title", input.title)
    formData.append("document_type", input.documentType)
    if (input.file) {
        formData.append("file", input.file)
    }
    return apiFormData<KnowledgeDocDTO>(
        `/api/knowledge_base/${input.documentId}/`,
        formData,
        {method: "PATCH"},
    );
}

export async function deleteKnowledgeDoc(documentId: string): Promise<void> {
    return api<void>(`/api/knowledge_base/${documentId}/`, {
        method: "DELETE",
    })
}

// query apis
export async function getKnowledgeDocs(storeId: string): Promise<KnowledgeDocDTO[]> {
    return api<KnowledgeDocDTO[]>(
        `/api/knowledge_base/?store_id=${encodeURIComponent(storeId)}`,
    )
}