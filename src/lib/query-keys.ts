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
    },
    team: {
        all: ["team"] as const,
        list: (storeId: string) => [...queryKeys.team.all, "list", { storeId }] as const,
        invitation: (token: string) => [...queryKeys.team.all, "invitation", token] as const,
    },
    permissions: {
        all: ["permissions"] as const,
        my: (storeId: string) => [...queryKeys.permissions.all, "my", { storeId }] as const,
    },
    tickets: {
        all: ["tickets"] as const,
        recent: (storeId: string) => [...queryKeys.tickets.all, "recent", { storeId }] as const,
        detail: (ticketId: string) => [...queryKeys.tickets.all, "detail", ticketId] as const,
    },
    notifications: {
        all: ["notifications"] as const,
        list: (params?: { unread?: boolean }) => [...queryKeys.notifications.all, "list", params ?? {}] as const,
        unreadCount: () => [...queryKeys.notifications.all, "unread-count"] as const,
    },
    dashboard: {
        all: ["dashboard"] as const,
        snapshot: (storeId: string) => [...queryKeys.dashboard.all, "snapshot", { storeId }] as const,
    },
    analytics: {
        all: ["analytics"] as const,
        snapshot: (storeId: string, range: { start: string; end: string; granularity: string }) =>
            [...queryKeys.analytics.all, "snapshot", { storeId, ...range }] as const,
    },
}
