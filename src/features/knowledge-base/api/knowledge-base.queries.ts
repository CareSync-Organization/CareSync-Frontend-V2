import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { queryKeys } from "@/lib/query-keys"
import { createKnowledgeDoc, deleteKnowledgeDoc, getKnowledgeDocs, updateKnowledgeDoc } from "../api/knowledge-base.api"
import type { KnowledgeDocInput, UpdateKnowledgeDocInput } from "../types/knowledge-base.types"
import { mapKnowledgeDocDto } from "./knowledge-base.mapper"


// mutations
export function useCreateKnowledgeDoc(storeId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: KnowledgeDocInput) => createKnowledgeDoc(input),

        onSuccess: () => {
            if (storeId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.knowledgeBase.list(storeId)
                });
            }
            toast.success("Document uploaded")
        },
        onError: () => {
            toast.error("Could not upload document")
        }
    })
}


export function useUpdateKnowledgeDoc(storeId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: UpdateKnowledgeDocInput) => updateKnowledgeDoc(input),
        onSuccess: () => {
            if (storeId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.knowledgeBase.list(storeId)
                })
            }
            toast.success("Document Updated")
        },
        onError: () => {
            toast.error("Could not Update the Document")
        }


    })
}

export function useDeleteKnowledgeDoc(storeId: string | undefined) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (documentId: string) => deleteKnowledgeDoc(documentId),
        onSuccess: () => {
            if (storeId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.knowledgeBase.list(storeId)
                });
            }
            toast.success("Document Delete Successfully")
        },
        onError: () => {
            toast.error("Could not Delete the Document")
        }

    })
}

// queries
    export function useKnowledgeDocs(storeId: string | undefined) {
        return useQuery({
            queryKey: storeId ? queryKeys.knowledgeBase.list(storeId) : queryKeys.knowledgeBase.list("missing-store"),
            queryFn: async () => {
                if (!storeId) return []
                const docs = await getKnowledgeDocs(storeId);
                return docs.map(mapKnowledgeDocDto);
            },
            enabled: Boolean(storeId)
        })
    }