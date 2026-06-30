import type {
    AnalyticsSnapshotDTO,
    AnalyticsSnapshot,
    ChannelPerformanceRow,
} from "../types/analytics.types";

function formatSeconds(seconds: number | null): string {
    if (seconds === null) return "—";
    const s = Math.round(seconds * 10) / 10;
    if (s < 60) return `${s}s`;
    const totalMinutes = Math.floor(s / 60);
    const remSeconds = Math.round(s % 60);
    if (totalMinutes < 60) return remSeconds > 0 ? `${totalMinutes}m ${remSeconds}s` : `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const remMinutes = totalMinutes % 60;
    if (hours < 24) return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
}

export function mapAnalyticsSnapshot(dto: AnalyticsSnapshotDTO): AnalyticsSnapshot {
    return {
        storeId: dto.store_id,
        metrics: {
            totalConversations: {
                value: dto.metrics.total_conversations.value,
                changePercent: dto.metrics.total_conversations.change_percent,
                isImprovement: dto.metrics.total_conversations.is_improvement,
            },
            aiSuccessRate: {
                value: dto.metrics.ai_success_rate.value,
                changePercent: dto.metrics.ai_success_rate.change_percent,
                isImprovement: dto.metrics.ai_success_rate.is_improvement,
                sampleSize: dto.metrics.ai_success_rate.sample_size,
            },
            avgFirstResponseSeconds: {
                value: dto.metrics.avg_first_response_seconds.value,
                changePercent: dto.metrics.avg_first_response_seconds.change_percent,
                isImprovement: dto.metrics.avg_first_response_seconds.is_improvement,
                unansweredCount: dto.metrics.avg_first_response_seconds.unanswered_count,
            },
            resolutionRate: {
                value: dto.metrics.resolution_rate.value,
                changePercent: dto.metrics.resolution_rate.change_percent,
                isImprovement: dto.metrics.resolution_rate.is_improvement,
            },
        },
        conversationTrends: dto.conversation_trends.map((p) => ({
            label: p.label,
            aiHandled: p.ai_handled,
            humanHandled: p.human_handled,
            total: p.total,
        })),
        channelPerformance: dto.channel_performance.map((r): ChannelPerformanceRow => ({
            channel: r.channel,
            label: r.label,
            conversationCount: r.conversation_count,
            aiSuccessRate: r.ai_success_rate,
            avgFirstResponse: formatSeconds(r.avg_first_response_seconds),
            unansweredCount: r.unanswered_count,
        })),
        aiOutcomes: {
            segments: dto.ai_outcomes.segments.map((s) => ({
                status: s.status,
                label: s.label,
                value: s.value,
                percentage: s.percentage,
            })),
            sampleSize: dto.ai_outcomes.sample_size,
            excludedCount: dto.ai_outcomes.excluded_count,
        },
        customerIntents: {
            rows: dto.customer_intents.rows.map((r) => ({
                intent: r.intent,
                label: r.label,
                count: r.count,
                percentage: r.percentage,
            })),
            sampleSize: dto.customer_intents.sample_size,
        },
    };
}
