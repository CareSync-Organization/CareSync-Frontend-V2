import type { ChatConversation, ChatMessage } from "./chat.types";

export const demoConversations: ChatConversation[] = [
    {
        id: "conv_1",
        customerName: "Sarah Johnson",
        channel: "whatsapp",
        status: "escalated",
        mode: "ai",
        preview: "I need urgent help with my order",
        updatedAt: "2026-05-17T10:32:00Z",
        unreadCount: 1,
    },
    {
        id: "conv_2",
        customerName: "Mike Chen",
        channel: "shopify",
        status: "assigned",
        mode: "ai",
        preview: "Thank you for the help!",
        updatedAt: "2026-05-17T10:15:00Z",
        assignedTo: {
            id: "agent_1",
            name: "John Doe",
        },
    },
    {
        id: "conv_3",
        customerName: "Emma Wilson",
        channel: "daraz",
        status: "open",
        mode: "ai",
        preview: "Can I change my delivery address?",
        updatedAt: "2026-05-17T09:30:00Z",
    },
    {
        id: "conv_4",
        customerName: "David Brown",
        channel: "facebook",
        status: "assigned",
        mode: "human",
        preview: "I want to return this product",
        updatedAt: "2026-05-17T08:40:00Z",
        unreadCount: 2,
    },
    {
        id: "conv_5",
        customerName: "Lisa Anderson",
        channel: "instagram",
        status: "open",
        mode: "ai",
        preview: "Do you have this in blue?",
        updatedAt: "2026-05-17T07:20:00Z",
    },
];

export const demoMessages: ChatMessage[] = [
    {
        id: "msg_1",
        conversationId: "conv_1",
        sender: {
            id: "customer_1",
            name: "Sarah Johnson",
            role: "customer",
        },
        body: "Hi, I need help tracking my order",
        createdAt: "2026-05-17T10:30:00Z",
    },
    {
        id: "msg_2",
        conversationId: "conv_1",
        sender: {
            id: "ai_agent",
            name: "CareSync AI",
            role: "ai",
        },
        body: "Hello! I can help you with that. Could you please provide your order number?",
        createdAt: "2026-05-17T10:30:30Z",
    },
    {
        id: "msg_3",
        conversationId: "conv_1",
        sender: {
            id: "customer_1",
            name: "Sarah Johnson",
            role: "customer",
        },
        body: "Order #12345",
        createdAt: "2026-05-17T10:31:00Z",
    },
    {
        id: "msg_4",
        conversationId: "conv_1",
        sender: {
            id: "ai_agent",
            name: "CareSync AI",
            role: "ai",
        },
        body: "Your order is currently in transit and will arrive by June 28th.",
        createdAt: "2026-05-17T10:31:30Z",
    },
    {
        id: "msg_5",
        conversationId: "conv_1",
        sender: {
            id: "customer_1",
            name: "Sarah Johnson",
            role: "customer",
        },
        body: "I need urgent help with my order",
        createdAt: "2026-05-17T10:32:00Z",
    },
];