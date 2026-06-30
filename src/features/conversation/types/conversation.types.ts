// ─── Domain types (used by components) ───────────────────────────────────────

export type ConversationStatus = "open" | "manual" | "escalated" | "resolved";
export type ConversationChannel = "whatsapp" | "shopify" | "daraz";
export type MessageSenderType = "customer" | "agent" | "bot" | "system";
export type MessageDeliveryStatus = "received" | "queued" | "sent" | "failed";

export type ConversationCustomer = {
  id: string;
  displayName: string;
};

export type LatestMessage = {
  id: string;
  senderType: MessageSenderType;
  deliveryStatus: MessageDeliveryStatus;
  createdAt: string;
  content?: string;
};

export type ConversationSummary = {
  id: string;
  storeId: string;
  customer: ConversationCustomer;
  connectorId: string | null;
  channel: ConversationChannel;
  status: ConversationStatus;
  assignedUserId: string | null;
  lastMessageAt: string | null;
  latestMessage: LatestMessage | null;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderId: string;
  content: string;
  deliveryStatus: MessageDeliveryStatus;
  createdAt: string;
};

export type ConversationDetail = ConversationSummary & {
  rollingSummary: string;
  messages: Message[];
};

// ─── DTO types (what the backend sends, snake_case) ──────────────────────────

export type CustomerDTO = {
  id: string;
  display_name: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type LatestMessageDTO = {
  id: string;
  sender_type: MessageSenderType;
  delivery_status: MessageDeliveryStatus;
  created_at: string;
  content?: string;
};

export type ConversationSummaryDTO = {
  id: string;
  store: string;
  customer: CustomerDTO;
  connector: string | null;
  channel: ConversationChannel;
  status: ConversationStatus;
  assigned_user: string | null;
  last_message_at: string | null;
  latest_message: LatestMessageDTO | null;
  created_at: string;
  updated_at: string;
};

export type MessageDTO = {
  id: string;
  conversation: string;
  sender_type: MessageSenderType;
  sender_id: string;
  external_id: string;
  content: string;
  metadata: Record<string, unknown>;
  delivery_status: MessageDeliveryStatus;
  created_at: string;
};

export type ConversationDetailDTO = ConversationSummaryDTO & {
  rolling_summary: string;
  metadata: Record<string, unknown>;
  messages: MessageDTO[];
};

// websocket evennts

import type { TicketDto } from "@/features/tickets/types/ticket.types";

export type WsEvent =
  | { event: "subscription.accepted"; scope: "store" | "conversation" }
  | { event: "subscription.rejected"; payload?: unknown }
  | { event: "conversation.created"; payload: ConversationSummaryDTO }
  | { event: "conversation.updated"; payload: ConversationSummaryDTO | { conversation_id: string; status: ConversationStatus } }
  | { event: "message.created"; payload: MessageDTO }
  | { event: "message.updated"; payload: MessageDTO }
  | { event: "ai_run.updated"; payload: { ai_run_id: string; conversation_id: string; status: string } }
  | { event: "ticket.created"; payload: TicketDto }
  | { event: "ticket.updated"; payload: TicketDto }
  | { event: "analytics.changed"; payload: { store_id: string; resources: string[]; reason: string; occurred_at: string } };