import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { AppNotification, NotificationListResponse } from "../types/notification.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const RECONNECT_DELAYS_MS = [1000, 3000, 8000, 15000, 30000];

function buildWsUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/^https:/, "wss:").replace(/^http:/, "ws:") + "/ws/notifications/";
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/notifications/`;
}

export function useNotificationsSocket(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    let destroyed = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempt = 0;

    function scheduleReconnect() {
      const delay = RECONNECT_DELAYS_MS[Math.min(reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)];
      reconnectAttempt++;
      reconnectTimer = setTimeout(connect, delay);
    }

    function connect() {
      if (destroyed) return;
      ws = new WebSocket(buildWsUrl());

      ws.onopen = () => {
        reconnectAttempt = 0;
      };

      ws.onmessage = (event) => {
        let notification: AppNotification;
        try {
          notification = JSON.parse(event.data) as AppNotification;
        } catch {
          return;
        }

        // Prepend to the list cache so it appears immediately at the top
        queryClient.setQueryData(
          queryKeys.notifications.list(),
          (old: NotificationListResponse | undefined) => {
            if (old?.results.some((n) => n.id === notification.id)) return old;
            return {
              count: (old?.count ?? 0) + 1,
              next: old?.next ?? null,
              previous: old?.previous ?? null,
              results: [notification, ...(old?.results ?? [])],
            };
          },
        );

        // Increment unread badge
        if (!notification.read) {
          queryClient.setQueryData(
            queryKeys.notifications.unreadCount(),
            (old: { count: number } | undefined) => ({
              count: (old?.count ?? 0) + 1,
            }),
          );
        }
      };

      ws.onclose = (event) => {
        ws = null;
        if (destroyed) return;
        if (event.code === 4401) {
          api<unknown>("/api/auth/refresh/", { method: "POST" })
            .then(() => { if (!destroyed) scheduleReconnect(); })
            .catch(() => { /* refresh failed — stay disconnected */ });
          return;
        }
        if (event.code === 4403) return;
        scheduleReconnect();
      };

      ws.onerror = () => {
        // onclose fires after onerror, handled there
      };
    }

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [enabled, queryClient]);
}
