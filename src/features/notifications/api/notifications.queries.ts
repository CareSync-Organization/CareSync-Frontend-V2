import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
} from "./notifications.api";
import type { NotificationListResponse } from "../types/notification.types";

export function useNotifications(params?: { unread?: boolean }) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => getNotifications(params),
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 0,
    refetchInterval: 60_000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.notifications.unreadCount(), { count: 0 });
      queryClient.setQueryData(
        queryKeys.notifications.list(),
        (old: NotificationListResponse | undefined) => {
          if (!old) return old;
          return { ...old, results: old.results.map((n) => ({ ...n, read: true })) };
        },
      );
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markRead,
    onSuccess: (updated) => {
      queryClient.setQueryData(
        queryKeys.notifications.list(),
        (old: NotificationListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((n) => (n.id === updated.id ? updated : n)),
          };
        },
      );
      queryClient.setQueryData(
        queryKeys.notifications.list({ unread: true }),
        (old: NotificationListResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.filter((n) => n.id !== updated.id),
          };
        },
      );
      queryClient.setQueryData(
        queryKeys.notifications.unreadCount(),
        (old: { count: number } | undefined) => ({
          count: Math.max(0, (old?.count ?? 1) - 1),
        }),
      );
    },
  });
}
