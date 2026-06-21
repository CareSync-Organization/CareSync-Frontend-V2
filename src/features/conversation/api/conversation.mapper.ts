import type {
    ConversationCustomer,
    ConversationDetail,
    ConversationDetailDTO,
    ConversationSummary,
    ConversationSummaryDTO,
    CustomerDTO,
    Message,
    MessageDTO,
} from "../types/conversation.types";

export function mapCustomerDto(dto: CustomerDTO): ConversationCustomer {
    return {
        id: dto.id,
        displayName: dto.display_name || "Customer",
    };
}

export function mapMessageDto(dto: MessageDTO): Message {
    return {
        id: dto.id,
        conversationId: dto.conversation,
        senderType: dto.sender_type,
        senderId: dto.sender_id,
        content: dto.content,
        deliveryStatus: dto.delivery_status,
        createdAt: dto.created_at,
    };
}

export function mapConversationSummaryDto(dto: ConversationSummaryDTO): ConversationSummary {
    return {
        id: dto.id,
        storeId: dto.store,
        customer: mapCustomerDto(dto.customer),
        connectorId: dto.connector,
        channel: dto.channel,
        status: dto.status,
        assignedUserId: dto.assigned_user,
        lastMessageAt: dto.last_message_at,
        latestMessage: dto.latest_message
            ? {
                id: dto.latest_message.id,
                senderType: dto.latest_message.sender_type,
                deliveryStatus: dto.latest_message.delivery_status,
                createdAt: dto.latest_message.created_at,
                content: dto.latest_message.content,
            }
            : null,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    };
}

export function mapConversationDetailDto(dto: ConversationDetailDTO): ConversationDetail {
    return {
        ...mapConversationSummaryDto(dto),
        rollingSummary: dto.rolling_summary,
        messages: dto.messages.map(mapMessageDto),
    };
}
