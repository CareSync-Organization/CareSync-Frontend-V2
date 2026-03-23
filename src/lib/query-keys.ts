export const queryKeys = {
    auth: ["auth"] as const,
    currentUser: ["auth", "current-user"] as const,
    conversations: ["conversations"] as const,
    conversation: (id: string) => ["conversations", id] as const,
    knowledgeBase: ["knowledge-base"] as const,
    inventory: ["inventory"] as const,
}
