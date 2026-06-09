import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { queryKeys } from "@/lib/query-keys"
import { createKnowledgeDoc } from "../api/knowledge-base.api"
import type { KnowledgeDocInput } from "../types/knowledge-base.types"

export function useCreateKnowledgeDoc(storeId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: KnowledgeDocInput) => createKnowledgeDoc(input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.knowledgeBase.list(storeId)
            });
            toast.success("Document uploaded")
        },
        onError: () => {
            toast.error("Could not upload document")
        }
    })
}