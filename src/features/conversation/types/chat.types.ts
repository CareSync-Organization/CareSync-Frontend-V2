import type { ChannelKey } from "@/features/integrations/types/channel.types";

export type MessageSenderRole = "customer" | "agent" | "admin" | "ai";

export type MessageSender = {
    id: string;
    name: string;
    role: MessageSenderRole;
};

export type ChatMessage = {
    id: string;
    conversationId: string;
    sender: MessageSender;
    body: string;
    createdAt: string;
    status?: "sending" | "sent" | "failed";
};

export type ConversationChannel = ChannelKey;

export type ConversationStatus = "open" | "assigned" | "escalated" | "resolved";

export type ConversationMode = "ai" | "human";

export type ChatConversation = {
    id: string;
    customerName: string;
    channel: ConversationChannel;
    status: ConversationStatus;
    mode: ConversationMode;
    preview: string;
    updatedAt: string;
    unreadCount?: number;
    assignedTo?: {
        id: string;
        name: string;
    };
};
