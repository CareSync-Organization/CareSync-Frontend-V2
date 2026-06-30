export type DashboardMetricDTO = {
    value: number | null;
    previous_value: number | null;
    change_percent: number | null;
    is_improvement: boolean | null;
    percentage?: number | null;
    sample_size?: number;
    unanswered_count?: number;
};

export type ChannelBreakdownDTO = {
    channel: string;
    label: string;
    count: number;
    percentage: number | null;
};

export type RecentMessageDTO = {
    id: string;
    sender_type: string;
    content: string;
    delivery_status: string;
    created_at: string;
};

export type RecentCustomerDTO = {
    id: string;
    display_name: string;
};

export type RecentConversationDTO = {
    id: string;
    customer: RecentCustomerDTO;
    connector_id: string | null;
    channel: string;
    status: string;
    handling_mode: "ai" | "human" | "unanswered";
    first_response_seconds: number | null;
    last_message_at: string | null;
    latest_message: RecentMessageDTO | null;
};

export type DashboardSnapshotDTO = {
    store_id: string;
    generated_at: string;
    period: { start: string; end: string; timezone: string };
    comparison_period: { start: string; end: string };
    metrics: {
        total_conversations: DashboardMetricDTO;
        ai_handled: DashboardMetricDTO;
        resolution_rate: DashboardMetricDTO;
        escalations: DashboardMetricDTO;
    };
    channel_breakdown: ChannelBreakdownDTO[];
    recent_conversations: RecentConversationDTO[];
    data_quality: {
        status_history_complete: boolean;
        status_history_complete_from: string | null;
    };
};

// ---------- Domain types (camelCase, used in components) ----------

export type DashboardMetric = {
    value: number | null;
    previousValue: number | null;
    changePercent: number | null;
    isImprovement: boolean | null;
    percentage?: number | null;
};

export type ChannelBreakdownItem = {
    channel: string;
    label: string;
    count: number;
    percentage: number | null;
};

export type RecentConversation = {
    id: string;
    customer: { id: string; displayName: string };
    connectorId: string | null;
    channel: string;
    status: string;
    handlingMode: "ai" | "human" | "unanswered";
    firstResponseSeconds: number | null;
    lastMessageAt: string | null;
    latestMessage: {
        id: string;
        senderType: string;
        content: string;
        deliveryStatus: string;
        createdAt: string;
    } | null;
};

export type DashboardSnapshot = {
    storeId: string;
    generatedAt: string;
    metrics: {
        totalConversations: DashboardMetric;
        aiHandled: DashboardMetric;
        resolutionRate: DashboardMetric;
        escalations: DashboardMetric;
    };
    channelBreakdown: ChannelBreakdownItem[];
    recentConversations: RecentConversation[];
};
