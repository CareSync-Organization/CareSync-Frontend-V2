export const queryKeys = {
    knowledgeBase: {
        all: ["knowledge-base"] as const, // invalidate when logging out
        list: (storeId: string) => [...queryKeys.knowledgeBase.all, "list", {storeId} ] as const,
        detail: (documentId: string) => [...queryKeys.knowledgeBase.all, "detail", documentId] as const
    }
    // auth: ["auth"] as const,
    // currentUser: ["auth", "current-user"] as const,
    // conversations: ["conversations"] as const,
    // conversation: (id: string) => ["conversations", id] as const,
    // knowledgeBase: ["knowledge-base"] as const,
    // inventory: ["inventory"] as const,
}
