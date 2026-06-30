import type { LucideIcon } from "lucide-react";

// ── DTO types (snake_case — matches backend response) ───────────────────────

export type AnalyticsMetricDTO = {
    value: number | null;
    previous_value: number | null;
    change_percent: number | null;
    is_improvement: boolean | null;
    sample_size?: number;
    unanswered_count?: number;
};

export type ConversationTrendPointDTO = {
    period_start: string;
    label: string;
    ai_handled: number;
    human_handled: number;
    total: number;
};

export type ChannelPerformanceRowDTO = {
    channel: string;
    label: string;
    conversation_count: number;
    ai_success_rate: number | null;
    avg_first_response_seconds: number | null;
    unanswered_count: number;
};

export type AIOutcomeSegmentDTO = {
    status: "resolved" | "escalated" | "handoff";
    label: string;
    value: number;
    percentage: number;
};

export type AnalyticsSnapshotDTO = {
    store_id: string;
    generated_at: string;
    period: { start: string; end: string; timezone: string; granularity: string };
    comparison_period: { start: string; end: string };
    metrics: {
        total_conversations: AnalyticsMetricDTO;
        ai_success_rate: AnalyticsMetricDTO;
        avg_first_response_seconds: AnalyticsMetricDTO;
        resolution_rate: AnalyticsMetricDTO;
    };
    conversation_trends: ConversationTrendPointDTO[];
    channel_performance: ChannelPerformanceRowDTO[];
    ai_outcomes: {
        segments: AIOutcomeSegmentDTO[];
        sample_size: number;
        excluded_count: number;
    };
    customer_intents: {
        rows: Array<{ intent: string; label: string; count: number; percentage: number }>;
        sample_size: number;
    };
    data_quality: {
        status_history_complete: boolean;
        status_history_complete_from: string | null;
        customer_satisfaction_available: boolean;
    };
};

// ── Domain types (camelCase — used in components) ────────────────────────────

export type AnalyticsMetric = {
    id: string;
    label: string;
    value: string;
    trend: number | null;
    isImprovement?: boolean | null;
    icon: LucideIcon;
    toneClassName: string;
    iconClassName: string;
};

export type ConversationTrendPoint = {
    label: string;
    aiHandled: number;
    humanHandled: number;
    total: number;
};

export type ChannelPerformanceRow = {
    channel: string;
    label: string;
    conversationCount: number;
    aiSuccessRate: number | null;
    avgFirstResponse: string;
    unansweredCount: number;
};

export type AIOutcomeStatus = "resolved" | "escalated" | "handoff";

export type AIOutcomeSegment = {
    status: AIOutcomeStatus;
    label: string;
    value: number;
    percentage: number;
};

export type AIOutcomes = {
    segments: AIOutcomeSegment[];
    sampleSize: number;
    excludedCount: number;
};

export type CustomerIntentRow = {
    intent: string;
    label: string;
    count: number;
    percentage: number;
};

export type CustomerIntents = {
    rows: CustomerIntentRow[];
    sampleSize: number;
};

export type AnalyticsSnapshot = {
    storeId: string;
    metrics: {
        totalConversations: { value: number | null; changePercent: number | null; isImprovement: boolean | null };
        aiSuccessRate: { value: number | null; changePercent: number | null; isImprovement: boolean | null; sampleSize?: number };
        avgFirstResponseSeconds: { value: number | null; changePercent: number | null; isImprovement: boolean | null; unansweredCount?: number };
        resolutionRate: { value: number | null; changePercent: number | null; isImprovement: boolean | null };
    };
    conversationTrends: ConversationTrendPoint[];
    channelPerformance: ChannelPerformanceRow[];
    aiOutcomes: AIOutcomes;
    customerIntents: CustomerIntents;
};
