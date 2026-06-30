import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { mapConversationSummaryDto, mapMessageDto } from "../api/conversation.mapper";
import { mapTicketDto } from "@/features/tickets/types/ticket.types";
import type { Ticket } from "@/features/tickets/types/ticket.types";
import type {
    ConversationDetail,
    Message,
    ConversationStatus,
    ConversationSummary,
    WsEvent,
} from "../types/conversation.types";

const RECENT_TICKETS_LIMIT = 10;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const RECONNECT_DELAYS_MS = [1000, 3000, 8000, 15000, 30000];
const OPTIMISTIC_MESSAGE_WINDOW_MS = 2 * 60 * 1000;

function buildWsUrl(): string {
    if (API_BASE_URL) {
        return API_BASE_URL.replace(/^https:/, "wss:").replace(/^http:/, "ws:") + "/ws/conversations/";
    }
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws/conversations/`;
}

export function useConversationSocket(
    storeId: string | null | undefined,
    activeConversationId: string | null | undefined,
) {
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);

    // Refs so the onmessage handler always reads the latest values
    // without causing the socket-creation effect to re-run
    const storeIdRef = useRef(storeId);
    const activeConversationIdRef = useRef(activeConversationId);
    storeIdRef.current = storeId;
    activeConversationIdRef.current = activeConversationId;

    const analyticsDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Effect 1: Create socket once per storeId ──────────────────────────────
    useEffect(() => {
        if (!storeId) return;

        let destroyed = false;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let reconnectAttempt = 0;

        function scheduleReconnect() {
            const delay =
                RECONNECT_DELAYS_MS[
                    Math.min(reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)
                ];
            reconnectAttempt += 1;
            reconnectTimer = setTimeout(connect, delay);
        }

        function connect() {
            if (destroyed) return;

            const ws = new WebSocket(buildWsUrl());
            wsRef.current = ws;

            ws.onopen = () => {
                reconnectAttempt = 0;

                // Subscribe to the store group so we get all conversation events
                queryClient.invalidateQueries({ queryKey: ["conversations", "detail"] });
                // Refetch recent tickets after reconnect so missed events don't leave stale state
                queryClient.invalidateQueries({ queryKey: queryKeys.tickets.recent(storeIdRef.current ?? "") });
                ws.send(JSON.stringify({ action: "subscribe_store", store_id: storeIdRef.current }));
                ws.send(JSON.stringify({ action: "subscribe_analytics_store", store_id: storeIdRef.current }));

                // If a conversation was already selected when the socket connected, subscribe to it too
                const convId = activeConversationIdRef.current;
                if (convId) {
                    ws.send(JSON.stringify({ action: "subscribe_conversation", conversation_id: convId }));
                }
            };

            ws.onmessage = (event: MessageEvent) => {
                try {
                    const data: WsEvent = JSON.parse(event.data as string);

                    if (data.event === "subscription.accepted" || data.event === "subscription.rejected") return;

                    if (data.event === "conversation.created") {
                        const conversation = mapConversationSummaryDto(data.payload);
                        const currentStoreId = storeIdRef.current;

                        if (currentStoreId) {
                            queryClient.setQueryData<ConversationSummary[]>(
                                queryKeys.conversations.list({ storeId: currentStoreId }),
                                (old) => {
                                    if (!old) return undefined;
                                    return old.some((item) => item.id === conversation.id)
                                        ? old
                                        : [conversation, ...old];
                                },
                            );
                        }
                    }

                    if (data.event === "message.created" || data.event === "message.updated") {
                        const message = mapMessageDto(data.payload);
                        const convId = data.payload.conversation;

                        queryClient.setQueryData<ConversationDetail>(
                            queryKeys.conversations.detail(convId),
                            (old) => {
                                if (!old) return undefined;
                                const existingMessage = old.messages.some((m) => m.id === message.id);
                                const optimisticMessage = findMatchingOptimisticMessage(old.messages, message);

                                return {
                                    ...old,
                                    lastMessageAt: message.createdAt,
                                    messages: existingMessage
                                        ? old.messages.map((m) => (m.id === message.id ? message : m))
                                        : optimisticMessage
                                            ? old.messages.map((m) => (m.id === optimisticMessage.id ? message : m))
                                        : [...old.messages, message],
                                };
                            },
                        );

                        const currentStoreId = storeIdRef.current;
                        if (currentStoreId) {
                            queryClient.setQueryData<ConversationSummary[]>(
                                queryKeys.conversations.list({ storeId: currentStoreId }),
                                (old) => {
                                    if (!old) return undefined;
                                    const updated = old.map((conv) =>
                                        conv.id === convId
                                            ? {
                                                ...conv,
                                                lastMessageAt: message.createdAt,
                                                latestMessage: {
                                                    id: message.id,
                                                    senderType: message.senderType,
                                                    deliveryStatus: message.deliveryStatus,
                                                    createdAt: message.createdAt,
                                                    content: message.content,
                                                },
                                            }
                                            : conv,
                                    );
                                    return [...updated].sort(
                                        (a, b) =>
                                            new Date(b.lastMessageAt ?? b.updatedAt).getTime() -
                                            new Date(a.lastMessageAt ?? a.updatedAt).getTime(),
                                    );
                                },
                            );
                        }
                    }

                    if (data.event === "conversation.updated") {
                        const currentStoreId = storeIdRef.current;

                        // tasks.py sends a truncated payload {conversation_id, status}
                        // views.py sends a full ConversationSummaryDTO
                        // detect which one arrived by checking for the "customer" field
                        if ("customer" in data.payload) {
                            const updated = mapConversationSummaryDto(data.payload);
                            if (currentStoreId) {
                                queryClient.setQueryData<ConversationSummary[]>(
                                    queryKeys.conversations.list({ storeId: currentStoreId }),
                                    (old) => {
                                        if (!old) return undefined;
                                        return [...old.map((conv) => (conv.id === updated.id ? updated : conv))].sort(
                                            (a, b) =>
                                                new Date(b.lastMessageAt ?? b.updatedAt).getTime() -
                                                new Date(a.lastMessageAt ?? a.updatedAt).getTime(),
                                        );
                                    },
                                );
                            }
                            queryClient.setQueryData<ConversationDetail>(
                                queryKeys.conversations.detail(updated.id),
                                (old) => (old ? { ...old, ...updated } : undefined),
                            );
                        } else {
                            // Partial update from tasks.py — only status changed
                            const partialPayload = data.payload as unknown as { conversation_id: string; status: ConversationStatus };
                            const convId = partialPayload.conversation_id;
                            const newStatus = partialPayload.status;
                            if (currentStoreId) {
                                queryClient.setQueryData<ConversationSummary[]>(
                                    queryKeys.conversations.list({ storeId: currentStoreId }),
                                    (old) => {
                                        if (!old) return undefined;
                                        return old.map((conv) => conv.id === convId ? { ...conv, status: newStatus } : conv);
                                    },
                                );
                            }
                            queryClient.setQueryData<ConversationDetail>(
                                queryKeys.conversations.detail(convId),
                                (old) => (old ? { ...old, status: newStatus } : undefined),
                            );
                        }
                    }
                    if (data.event === "analytics.changed") {
                        const resources: string[] = data.payload.resources;
                        if (analyticsDebounceTimerRef.current) clearTimeout(analyticsDebounceTimerRef.current);
                        analyticsDebounceTimerRef.current = setTimeout(() => {
                            const sid = storeIdRef.current;
                            if (!sid) return;
                            if (resources.includes("dashboard")) {
                                queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.snapshot(sid) });
                            }
                            if (resources.includes("analytics")) {
                                queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
                            }
                        }, 350);
                    }

                    if (data.event === "ticket.created" || data.event === "ticket.updated") {
                        const ticket = mapTicketDto(data.payload);
                        const currentStoreId = storeIdRef.current;

                        queryClient.setQueryData(queryKeys.tickets.detail(ticket.id), ticket);

                        if (currentStoreId) {
                            queryClient.setQueryData<Ticket[]>(
                                queryKeys.tickets.recent(currentStoreId),
                                (old = []) => {
                                    const exists = old.some((t) => t.id === ticket.id);
                                    if (exists) return old.map((t) => (t.id === ticket.id ? ticket : t));
                                    return [ticket, ...old].slice(0, RECENT_TICKETS_LIMIT);
                                },
                            );
                        }
                    }
                } catch {
                    // malformed message from server — ignore
                }
            };

            ws.onclose = (event) => {
                if (destroyed) return;

                if (event.code === 4401) {
                    // Token expired — refresh then reconnect
                    api<unknown>("/api/auth/refresh/", { method: "POST" })
                        .then(() => { if (!destroyed) scheduleReconnect(); })
                        .catch(() => { /* refresh failed — stay disconnected */ });
                    return;
                }

                if (event.code === 4403) {
                    return; // permission denied — don't reconnect
                }

                scheduleReconnect();
            };
        }

        connect();

        return () => {
            destroyed = true;
            if (reconnectTimer) clearTimeout(reconnectTimer);
            if (analyticsDebounceTimerRef.current) clearTimeout(analyticsDebounceTimerRef.current);
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [storeId, queryClient]); // ← activeConversationId intentionally NOT here

    // ── Effect 2: Subscribe to a conversation when it changes ─────────────────
    // The socket stays open — we just send a new subscription message
    useEffect(() => {
        if (!activeConversationId) return;
        const ws = wsRef.current;
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "subscribe_conversation", conversation_id: activeConversationId }));
        }
        // If ws isn't open yet (race on first load), activeConversationIdRef.current
        // is already set and onopen will send the subscription
    }, [activeConversationId]);
}

function findMatchingOptimisticMessage(messages: Message[], realMessage: Message) {
    if (realMessage.senderType === "customer") return undefined;
    const realCreatedAt = new Date(realMessage.createdAt).getTime();

    return messages.find((message) => {
        if (!message.id.startsWith("optimistic-")) return false;
        if (message.conversationId !== realMessage.conversationId) return false;
        if (message.senderType !== realMessage.senderType) return false;
        if (message.content !== realMessage.content) return false;

        const optimisticCreatedAt = new Date(message.createdAt).getTime();
        if (Number.isNaN(realCreatedAt) || Number.isNaN(optimisticCreatedAt)) {
            return true;
        }

        return Math.abs(realCreatedAt - optimisticCreatedAt) <= OPTIMISTIC_MESSAGE_WINDOW_MS;
    });
}
