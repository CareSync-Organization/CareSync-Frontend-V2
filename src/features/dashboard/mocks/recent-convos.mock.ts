import type { ChannelKey } from "@/features/integrations/types/channel.types";

export type TableConversationMode = "automated" | "manual";

export type ConversationRow = {
  id: string;
  customerName: string;
  channel: ChannelKey;
  status: TableConversationMode;
  responseTimeSeconds: number;
  satisfaction: number;
  lastMessage: string;
  updatedAt: string;
};

export const demoConversationRows: ConversationRow[] = [
  {
    id: "conv_1",
    customerName: "Sarah Johnson",
    channel: "whatsapp",
    status: "automated",
    responseTimeSeconds: 2,
    satisfaction: 95,
    lastMessage: "Thank you for the quick response!",
    updatedAt: "2026-05-17T09:30:00Z",
  },
  {
    id: "conv_2",
    customerName: "Mike Chen",
    channel: "instagram",
    status: "manual",
    responseTimeSeconds: 45,
    satisfaction: 88,
    lastMessage: "When will my order ship?",
    updatedAt: "2026-05-17T09:25:00Z",
  },
  {
    id: "conv_3",
    customerName: "Emily Davis",
    channel: "facebook",
    status: "automated",
    responseTimeSeconds: 3,
    satisfaction: 92,
    lastMessage: "Got it, thanks!",
    updatedAt: "2026-05-17T09:20:00Z",
  },
  {
    id: "conv_4",
    customerName: "John Smith",
    channel: "shopify",
    status: "automated",
    responseTimeSeconds: 2,
    satisfaction: 97,
    lastMessage: "Perfect, exactly what I needed.",
    updatedAt: "2026-05-17T09:15:00Z",
  },
  {
    id: "conv_5",
    customerName: "Lisa Wang",
    channel: "whatsapp",
    status: "manual",
    responseTimeSeconds: 80,
    satisfaction: 85,
    lastMessage: "Can I change my delivery address?",
    updatedAt: "2026-05-17T09:10:00Z",
  },
  {
    id: "conv_6",
    customerName: "David Brown",
    channel: "daraz",
    status: "automated",
    responseTimeSeconds: 4,
    satisfaction: 90,
    lastMessage: "Great service!",
    updatedAt: "2026-05-17T09:05:00Z",
  },
  {
    id: "conv_7",
    customerName: "Ayesha Khan",
    channel: "email",
    status: "manual",
    responseTimeSeconds: 120,
    satisfaction: 82,
    lastMessage: "Please send me the invoice.",
    updatedAt: "2026-05-17T09:00:00Z",
  },
  {
    id: "conv_8",
    customerName: "Omar Farooq",
    channel: "shopify",
    status: "automated",
    responseTimeSeconds: 7,
    satisfaction: 94,
    lastMessage: "The refund has been received.",
    updatedAt: "2026-05-17T08:55:00Z",
  },
  {
    id: "conv_9",
    customerName: "Nina Patel",
    channel: "instagram",
    status: "manual",
    responseTimeSeconds: 240,
    satisfaction: 76,
    lastMessage: "Is this product still available?",
    updatedAt: "2026-05-17T08:50:00Z",
  },
  {
    id: "conv_10",
    customerName: "Bilal Ahmed",
    channel: "facebook",
    status: "automated",
    responseTimeSeconds: 9,
    satisfaction: 91,
    lastMessage: "Thanks for confirming.",
    updatedAt: "2026-05-17T08:45:00Z",
  },
  {
    id: "conv_11",
    customerName: "Fatima Noor",
    channel: "whatsapp",
    status: "automated",
    responseTimeSeconds: 5,
    satisfaction: 99,
    lastMessage: "Amazing support!",
    updatedAt: "2026-05-17T08:40:00Z",
  },
  {
    id: "conv_12",
    customerName: "Hassan Ali",
    channel: "daraz",
    status: "manual",
    responseTimeSeconds: 150,
    satisfaction: 79,
    lastMessage: "I need help tracking my parcel.",
    updatedAt: "2026-05-17T08:35:00Z",
  },
];
