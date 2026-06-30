import type {
    DashboardMetricDTO,
    DashboardSnapshotDTO,
    DashboardMetric,
    DashboardSnapshot,
} from "../types/dashboard.types";

function mapMetric(dto: DashboardMetricDTO): DashboardMetric {
    return {
        value: dto.value,
        previousValue: dto.previous_value,
        changePercent: dto.change_percent,
        isImprovement: dto.is_improvement,
        percentage: dto.percentage,
    };
}

export function mapDashboardSnapshot(dto: DashboardSnapshotDTO): DashboardSnapshot {
    return {
        storeId: dto.store_id,
        generatedAt: dto.generated_at,
        metrics: {
            totalConversations: mapMetric(dto.metrics.total_conversations),
            aiHandled: mapMetric(dto.metrics.ai_handled),
            resolutionRate: mapMetric(dto.metrics.resolution_rate),
            escalations: mapMetric(dto.metrics.escalations),
        },
        channelBreakdown: dto.channel_breakdown.map((c) => ({
            channel: c.channel,
            label: c.label,
            count: c.count,
            percentage: c.percentage,
        })),
        recentConversations: dto.recent_conversations.map((c) => ({
            id: c.id,
            customer: {
                id: c.customer.id,
                displayName: c.customer.display_name,
            },
            connectorId: c.connector_id,
            channel: c.channel,
            status: c.status,
            handlingMode: c.handling_mode,
            firstResponseSeconds: c.first_response_seconds,
            lastMessageAt: c.last_message_at,
            latestMessage: c.latest_message
                ? {
                      id: c.latest_message.id,
                      senderType: c.latest_message.sender_type,
                      content: c.latest_message.content,
                      deliveryStatus: c.latest_message.delivery_status,
                      createdAt: c.latest_message.created_at,
                  }
                : null,
        })),
    };
}
