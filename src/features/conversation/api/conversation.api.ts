import { api } from "@/lib/api";
import type {
  ConversationDetailDTO,
  ConversationStatus,
  ConversationSummaryDTO,
  MessageDTO,
} from "../types/conversation.types";

type GetConversationsParams = {
  storeId: string;
  status?: ConversationStatus;
  channel?: string;
};

export function getConversations(params: GetConversationsParams) {
  const { storeId, status, channel } = params;
  const search = new URLSearchParams({ store_id: storeId });

  if (status) search.set("status", status);
  if (channel) search.set("channel", channel);

  return api<ConversationSummaryDTO[]>(`/api/conversations/?${search}`);
}

export function getConversationDetail(conversationId: string) {
  return api<ConversationDetailDTO>(`/api/conversations/${conversationId}/`);
}

export function updateConversationStatus(
  conversationId: string,
  status: ConversationStatus,
) {
  return api<ConversationDetailDTO>(`/api/conversations/${conversationId}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function sendMessage(conversationId: string, content: string) {
  return api<MessageDTO>(`/api/conversations/${conversationId}/messages/`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
