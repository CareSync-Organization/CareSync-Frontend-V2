import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { queryKeys } from "@/lib/query-keys"
import { createKnowledgeDoc, deleteKnowledgeDoc, getKnowledgeDocs, updateKnowledgeDoc } from "../api/knowledge-base.api"
import type { KnowledgeDocInput, KnowledgeDocument, UpdateKnowledgeDocInput } from "../types/knowledge-base.types"
import { mapKnowledgeDocDto } from "./knowledge-base.mapper"

export function knowledgeDocsQueryOptions(storeId: string) {
    return queryOptions({
        queryKey: queryKeys.knowledgeBase.list(storeId),
        queryFn: async () => {
            const docs = await getKnowledgeDocs(storeId);
            return docs.map(mapKnowledgeDocDto);
        },
        staleTime: Infinity,
    });
}

export function useKnowledgeDocs(storeId: string | undefined) {
    return useQuery({
        ...knowledgeDocsQueryOptions(storeId ?? "missing-store"),
        enabled: Boolean(storeId),
    });
}

export function useCreateKnowledgeDoc(storeId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: KnowledgeDocInput) => createKnowledgeDoc(input),

        onMutate: async (input) => {
            if (!storeId) return;

            await queryClient.cancelQueries({ queryKey: queryKeys.knowledgeBase.list(storeId) });

            const previousDocs = queryClient.getQueryData<KnowledgeDocument[]>(
                queryKeys.knowledgeBase.list(storeId),
            ) ?? [];

            const optimisticDoc: KnowledgeDocument = {
                id: `optimistic-${crypto.randomUUID()}`,
                title: input.title || input.file.name,
                documentType: input.documentType,
                fileName: input.file.name,
                fileType: input.file.name.split(".").pop()?.toUpperCase() ?? "FILE",
                fileSizeKb: Math.max(1, Math.round(input.file.size / 1024)),
                uploadedAt: new Date().toISOString(),
                fileUrl: "",
                isOptimistic: true,
            };

            queryClient.setQueryData<KnowledgeDocument[]>(
                queryKeys.knowledgeBase.list(storeId),
                [optimisticDoc, ...previousDocs],
            );

            return { previousDocs, optimisticDocId: optimisticDoc.id };
        },

        onError: (error, _input, context) => {
            if (storeId && context?.previousDocs) {
                queryClient.setQueryData(queryKeys.knowledgeBase.list(storeId), context.previousDocs);
            }
            toast.error(error instanceof Error ? error.message : "Could not upload document");
        },

        onSuccess: (dto, _input, context) => {
            const createdDoc = mapKnowledgeDocDto(dto);
            if (storeId) {
                queryClient.setQueryData<KnowledgeDocument[]>(
                    queryKeys.knowledgeBase.list(storeId),
                    (oldDocs = []) => [
                        createdDoc,
                        ...oldDocs.filter((doc) => doc.id !== context?.optimisticDocId),
                    ],
                );
            }
            toast.success("Document uploaded");
        },
    });
}


export function useUpdateKnowledgeDoc(storeId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UpdateKnowledgeDocInput) => updateKnowledgeDoc(input),

        onMutate: async (input) => {
            if (!storeId) return;

            await queryClient.cancelQueries({ queryKey: queryKeys.knowledgeBase.list(storeId) });

            const previousDocs = queryClient.getQueryData<KnowledgeDocument[]>(
                queryKeys.knowledgeBase.list(storeId),
            ) ?? [];

            queryClient.setQueryData<KnowledgeDocument[]>(
                queryKeys.knowledgeBase.list(storeId),
                previousDocs.map((doc) =>
                    doc.id === input.documentId
                        ? { ...doc, title: input.title, documentType: input.documentType, isOptimistic: true }
                        : doc,
                ),
            );

            return { previousDocs };
        },

        onError: (error, _input, context) => {
            if (storeId && context?.previousDocs) {
                queryClient.setQueryData(queryKeys.knowledgeBase.list(storeId), context.previousDocs);
            }
            toast.error(error instanceof Error ? error.message : "Could not update document");
        },

        onSuccess: (dto) => {
            const updatedDoc = mapKnowledgeDocDto(dto);
            if (storeId) {
                queryClient.setQueryData<KnowledgeDocument[]>(
                    queryKeys.knowledgeBase.list(storeId),
                    (oldDocs = []) => oldDocs.map((doc) => doc.id === updatedDoc.id ? updatedDoc : doc),
                );
            }
            toast.success("Document updated");
        },
    });
}


export function useDeleteKnowledgeDoc(storeId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => deleteKnowledgeDoc(documentId),

        onMutate: async (documentId) => {
            if (!storeId) return;

            await queryClient.cancelQueries({ queryKey: queryKeys.knowledgeBase.list(storeId) });

            const previousDocs = queryClient.getQueryData<KnowledgeDocument[]>(
                queryKeys.knowledgeBase.list(storeId),
            ) ?? [];

            queryClient.setQueryData<KnowledgeDocument[]>(
                queryKeys.knowledgeBase.list(storeId),
                previousDocs.filter((doc) => doc.id !== documentId),
            );

            return { previousDocs };
        },

        onError: (error, _documentId, context) => {
            if (storeId && context?.previousDocs) {
                queryClient.setQueryData(queryKeys.knowledgeBase.list(storeId), context.previousDocs);
            }
            toast.error(error instanceof Error ? error.message : "Could not delete document");
        },

        onSuccess: () => {
            toast.success("Document deleted");
        },
    });
}



