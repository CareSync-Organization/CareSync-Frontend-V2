import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useUnreadCount,
  useMarkAllRead,
  useMarkRead,
} from "@/features/notifications/api/notifications.queries";
import type { AppNotification, NotificationType } from "@/features/notifications/types/notification.types";

const NOTIFICATION_ROUTES: Partial<Record<NotificationType, string>> = {
  inventory_sync_complete: "/inventory",
  connector_failed: "/connectors",
  knowledge_doc_processed: "/kbase",
  new_conversation: "/conversations",
  new_message: "/conversations",
  escalation: "/conversations",
  action_request_pending: "/conversations",
  invitation_received: "/userpermissions",
};

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationRow({
  notification,
  onRead,
  onClose,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  function handleClick() {
    if (!notification.read) onRead(notification.id);
    const route = NOTIFICATION_ROUTES[notification.type];
    if (route) {
      onClose();
      const conversationId = notification.metadata?.conversation_id as string | undefined;
      if (route === "/conversations" && conversationId) {
        void navigate({ to: "/conversations", search: { c: conversationId } });
      } else {
        void navigate({ to: route });
      }
    }
  }

  return (
    <button
      type="button"
      className="flex w-full gap-3 px-4 py-3 text-left hover:bg-muted transition-colors"
      onClick={handleClick}
    >
      <span
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          notification.read ? "bg-transparent" : "bg-primary",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-snug">{notification.title}</p>
          <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
            {relativeTime(notification.created_at)}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.body}
        </p>
      </div>
    </button>
  );
}

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();
  const { data: notificationsData, isLoading } = useNotifications();
  const markAllReadMutation = useMarkAllRead();
  const markReadMutation = useMarkRead();

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notificationsData?.results ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 relative rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:border-primary/30 dark:bg-primary/20"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />

          {unreadCount > 0 ? (
            <span className="absolute -right-px -top-px size-2 rounded-full bg-red-500" />
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">No notifications yet</span>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onRead={(id) => markReadMutation.mutate(id)}
                onClose={() => setOpen(false)}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
