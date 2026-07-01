import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { ChannelBreakdownCard } from "./ChannelBreakdownCard";
import { MetricCard } from "./MetricCard";
import { NotificationCard } from "./NotificationCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { RecentConvoTable } from "./RecentConvoTable";
import { TicketDetailModal } from "@/features/tickets/components/TicketDetailModal";
import { useTicket } from "@/features/tickets/api/tickets.queries";
import type { Ticket } from "@/features/tickets/types/ticket.types";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useDashboard } from "../api/dashboard.queries";
import { useNotifications, useMarkRead } from "@/features/notifications/api/notifications.queries";
import type { NotificationType } from "@/features/notifications/types/notification.types";
import { Skeleton } from "@/components/ui/skeleton";

type BannerType = "alert" | "info" | "success";

const NOTIFICATION_BANNER_TYPE: Partial<Record<NotificationType, BannerType>> = {
  connector_failed: "alert",
  escalation: "alert",
  action_request_pending: "alert",
  inventory_sync_complete: "success",
  knowledge_doc_processed: "success",
  new_conversation: "info",
  new_message: "info",
  invitation_received: "info",
};

const NOTIFICATION_BUTTON_TEXT: Partial<Record<NotificationType, string>> = {
  connector_failed: "View Connectors",
  escalation: "View Conversation",
  action_request_pending: "Review",
  inventory_sync_complete: "View Inventory",
  knowledge_doc_processed: "View Knowledge Base",
  new_conversation: "View",
  new_message: "View",
  invitation_received: "View",
};

const NOTIFICATION_ROUTES: Partial<Record<NotificationType, string>> = {
  connector_failed: "/connectors",
  escalation: "/conversations",
  action_request_pending: "/conversations",
  inventory_sync_complete: "/inventory",
  knowledge_doc_processed: "/kbase",
  new_conversation: "/conversations",
  new_message: "/conversations",
  invitation_received: "/userpermissions",
};

function formatMetricValue(value: number | null, asPercent = false): string {
  if (value === null) return "—";
  if (asPercent) return `${value.toFixed(1)}%`;
  return value.toLocaleString();
}

export function DashboardPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);

  const navigate = useNavigate();
  const {
    data: snapshot,
    isLoading: dashboardLoading,
    isError: dashboardError,
    refetch: refetchDashboard,
  } = useDashboard(activeStoreId);
  const { data: notificationsData } = useNotifications({ unread: true });
  const markReadMutation = useMarkRead();

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const search = useSearch({ from: "/_app/dashboard" });
  const deepLinkTicketId = (search as Record<string, string>).ticket ?? null;
  const { data: deepLinkedTicket } = useTicket(
    deepLinkTicketId && !selectedTicket ? deepLinkTicketId : null,
  );

  useEffect(() => {
    if (deepLinkedTicket && !modalOpen) {
      setSelectedTicket(deepLinkedTicket);
      setModalOpen(true);
    }
  }, [deepLinkedTicket, modalOpen]);

  const banners = useMemo(() => {
    const notifications = notificationsData?.results ?? [];
    return notifications
      .filter((n) => NOTIFICATION_BANNER_TYPE[n.type] !== undefined)
      .map((n) => ({
        id: n.id,
        type: NOTIFICATION_BANNER_TYPE[n.type]!,
        message: n.title,
        buttonText: NOTIFICATION_BUTTON_TEXT[n.type] ?? "View",
        route: NOTIFICATION_ROUTES[n.type] ?? null,
      }));
  }, [notificationsData]);

  const visibleBanners = banners.filter((b) => !dismissedIds.has(b.id)).slice(0, 3);

  function dismiss(id: string) {
    setDismissedIds((prev) => new Set([...prev, id]));
    markReadMutation.mutate(id);
  }

  function handleTicketClick(ticket: Ticket) {
    setSelectedTicket(ticket);
    setModalOpen(true);
  }

  function handleModalClose(open: boolean) {
    setModalOpen(open);
    if (!open) setSelectedTicket(null);
  }

  const m = snapshot?.metrics;

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business activity and AI automation performance
        </p>
      </div>

      {visibleBanners.map((banner) => (
        <NotificationCard
          key={banner.id}
          type={banner.type}
          message={banner.message}
          buttonText={banner.buttonText}
          onClick={() => { if (banner.route) void navigate({ to: banner.route }); }}
          onDismiss={() => dismiss(banner.id)}
        />
      ))}

      {dashboardError ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <p>Failed to load dashboard data. Some sections may be incomplete.</p>
          <button
            type="button"
            className="shrink-0 font-medium hover:underline"
            onClick={() => void refetchDashboard()}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="min-h-40 rounded-xl" />
          ))
        ) : (
          <>
            <MetricCard
              type="convo"
              label="Total Conversations"
              value={formatMetricValue(m?.totalConversations.value ?? null)}
              trend={m?.totalConversations.changePercent ?? null}
              isImprovement={m?.totalConversations.isImprovement}
            />

            <MetricCard
              type="ai-handled"
              label="AI-Handled"
              value={formatMetricValue(m?.aiHandled.value ?? null)}
              helperText={
                m?.aiHandled.percentage !== null && m?.aiHandled.percentage !== undefined
                  ? `${m.aiHandled.percentage.toFixed(1)}%`
                  : undefined
              }
              trend={m?.aiHandled.changePercent ?? null}
              isImprovement={m?.aiHandled.isImprovement}
            />

            <MetricCard
              type="resolution-rate"
              label="Resolution Rate"
              value={formatMetricValue(m?.resolutionRate.value ?? null, true)}
              trend={m?.resolutionRate.changePercent ?? null}
              isImprovement={m?.resolutionRate.isImprovement}
            />

            <MetricCard
              type="escalations"
              label="Escalations"
              value={formatMetricValue(m?.escalations.value ?? null)}
              trend={m?.escalations.changePercent ?? null}
              isImprovement={m?.escalations.isImprovement}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <RecentActivityCard onTicketClick={handleTicketClick} />
        <ChannelBreakdownCard channelRows={snapshot?.channelBreakdown ?? []} />
      </div>

      <div>
        <RecentConvoTable
          conversations={snapshot?.recentConversations ?? []}
          storeId={activeStoreId ?? ""}
          isLoading={dashboardLoading}
        />
      </div>

      <TicketDetailModal
        ticket={selectedTicket}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  );
}
