export const queryKeys = {
    knowledgeBase: {
        all: ["knowledge-base"] as const, // invalidate when logging out
        list: (storeId: string) => [...queryKeys.knowledgeBase.all, "list", {storeId} ] as const,
        detail: (documentId: string) => [...queryKeys.knowledgeBase.all, "detail", documentId] as const
    },
    auth: {
        all: ["auth"] as const,
        me: () => [...queryKeys.auth.all, "me"] as const
    },
stores: {
  all: ["stores"] as const,
  list: () => [...queryKeys.stores.all, "list"] as const,
  aiSettings: (storeId: string) =>
    [...queryKeys.stores.all, "ai-settings", { storeId }] as const,
},
inventory: {
  all: ["inventory"] as const,
  list: (storeId: string) =>
    [...queryKeys.inventory.all, "list", { storeId }] as const,
  summary: (storeId: string) =>
    [...queryKeys.inventory.all, "summary", { storeId }] as const,
  detail: (itemId: string) =>
    [...queryKeys.inventory.all, "detail", itemId] as const,
},
    connectors: {
        all: ["connectors"] as const,
        list: (storeId: string) => [...queryKeys.connectors.all, "list", { storeId }] as const
    },
    conversations: {
        all: ["conversations"] as const,
        list: (filters: { storeId: string | null; status?: string; channel?: string }) => [...queryKeys.conversations.all, "list", filters] as const,
        detail: (id: string) => [...queryKeys.conversations.all, "detail", id] as const
    }

}
