import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import {
  getConversationDetail,
  getConversations,
  sendMessage,
  updateConversationStatus,
} from "./conversation.api";
import {
  mapConversationDetailDto,
  mapConversationSummaryDto,
  mapMessageDto,
} from "./conversation.mapper";
import type {
  ConversationDetail,
  ConversationStatus,
  ConversationSummary,
  Message,
} from "../types/conversation.types";

export function useConversations(storeId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.conversations.list({ storeId: storeId ?? null }),
    queryFn: async () => {
      if (!storeId) return [];
      const dtos = await getConversations({ storeId });
      return dtos.map(mapConversationSummaryDto);
    },
    enabled: Boolean(storeId),
  });
}

export function useConversationDetail(conversationId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(conversationId ?? "missing"),
    queryFn: async () => {
      if (!conversationId) throw new Error("No conversation ID");
      const dto = await getConversationDetail(conversationId);
      return mapConversationDetailDto(dto);
    },
    enabled: Boolean(conversationId),
  });
}

export function useUpdateConversationStatus(storeId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, status }: { conversationId: string; status: ConversationStatus }) =>
      updateConversationStatus(conversationId, status),

    onSuccess: (dto, { conversationId }) => {
      const updated = mapConversationDetailDto(dto);

      queryClient.setQueryData<ConversationDetail>(
        queryKeys.conversations.detail(conversationId),
        (old) => (old ? { ...old, ...updated } : undefined),
      );

      if (storeId) {
        queryClient.setQueryData<ConversationSummary[]>(
          queryKeys.conversations.list({ storeId }),
          (oldConversations = []) =>
            oldConversations.map((conversation) =>
              conversation.id === updated.id
                ? {
                  ...conversation,
                  status: updated.status,
                  assignedUserId: updated.assignedUserId,
                  updatedAt: updated.updatedAt,
                }
                : conversation,
            ),
        );
      }

      toast.success(`Status changed to ${updated.status}`);
    },

    onError: () => toast.error("Failed to update status"),
  });
}

export function useSendMessage({
  storeId,
  conversationId,
}: {
  storeId: string | null | undefined;
  conversationId: string | null | undefined;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => {
      if (!conversationId) {
        throw new Error("No conversation selected.");
      }

      return sendMessage(conversationId, content);
    },

    onMutate: async (content) => {
      if (!conversationId) return;

      await queryClient.cancelQueries({
        queryKey: queryKeys.conversations.detail(conversationId),
      });

      const previousDetail = queryClient.getQueryData<ConversationDetail>(
        queryKeys.conversations.detail(conversationId),
      );

      const previousList = storeId
        ? queryClient.getQueryData<ConversationSummary[]>(
          queryKeys.conversations.list({ storeId }),
        )
        : undefined;

      const optimisticMessage: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        conversationId,
        senderType: "agent",
        senderId: "",
        content,
        deliveryStatus: "queued",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ConversationDetail>(
        queryKeys.conversations.detail(conversationId),
        (old) =>
          old
            ? {
              ...old,
              lastMessageAt: optimisticMessage.createdAt,
              messages: [...old.messages, optimisticMessage],
            }
            : undefined,
      );

      if (storeId) {
        queryClient.setQueryData<ConversationSummary[]>(
          queryKeys.conversations.list({ storeId }),
          (oldConversations = []) =>
            oldConversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                  ...conversation,
                  lastMessageAt: optimisticMessage.createdAt,
                  latestMessage: {
                    id: optimisticMessage.id,
                    senderType: optimisticMessage.senderType,
                    deliveryStatus: optimisticMessage.deliveryStatus,
                    createdAt: optimisticMessage.createdAt,
                    content: optimisticMessage.content,
                  },
                }
                : conversation,
            ),
        );
      }

      return {
        previousDetail,
        previousList,
        optimisticId: optimisticMessage.id,
      };
    },

    onError: (_err, _content, context) => {
      if (conversationId && context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.conversations.detail(conversationId),
          context.previousDetail,
        );
      }

      if (storeId && context?.previousList) {
        queryClient.setQueryData(
          queryKeys.conversations.list({ storeId }),
          context.previousList,
        );
      }

      toast.error("Failed to send message");
    },

    onSuccess: (dto, _content, context) => {
      if (!conversationId) return;

      const realMessage = mapMessageDto(dto);
      queryClient.setQueryData<ConversationDetail>(
        queryKeys.conversations.detail(conversationId),
        (old) =>
          old
            ? {
              ...old,
              messages: (() => {
                const withoutOptimistic = old.messages.filter(
                  (m) => m.id !== context?.optimisticId
                );
                const alreadyAdded = withoutOptimistic.some((m) => m.id === realMessage.id);
                return alreadyAdded
                  ? withoutOptimistic.map((m) =>
                    m.id === realMessage.id ? realMessage : m
                  )
                  : [...withoutOptimistic, realMessage];
              })(),

            }
            : undefined,
      );

      if (storeId) {
        queryClient.setQueryData<ConversationSummary[]>(
          queryKeys.conversations.list({ storeId }),
          (oldConversations = []) =>
            oldConversations.map((conversation) =>
              conversation.id === conversationId
                ? {
                  ...conversation,
                  lastMessageAt: realMessage.createdAt,
                  latestMessage: {
                    id: realMessage.id,
                    senderType: realMessage.senderType,
                    deliveryStatus: realMessage.deliveryStatus,
                    createdAt: realMessage.createdAt,
                    content: realMessage.content,
                  },
                }
                : conversation,
            ),
        );
      }
    },
  });
}
