import { api } from "@/lib/api";
import type { AppNotification, NotificationListResponse } from "../types/notification.types";

export function getNotifications(params?: { unread?: boolean }) {
  const qs = params?.unread ? "?unread=true" : "";
  return api<NotificationListResponse>(`/api/notifications/${qs}`);
}

export function getUnreadCount() {
  return api<{ count: number }>("/api/notifications/unread-count/");
}

export function markAllRead() {
  return api<{ detail: string }>("/api/notifications/read-all/", { method: "POST" });
}

export function markRead(id: string) {
  return api<AppNotification>(`/api/notifications/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ read: true }),
  });
}
