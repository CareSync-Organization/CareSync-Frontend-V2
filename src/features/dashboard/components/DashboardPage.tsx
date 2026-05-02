import { useState } from "react";

import { ChannelBreakdownCard } from "./ChannelBreakdownCard";
import { MetricCard } from "./MetricCard";
import { NotificationCard } from "./NotificationCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { RecentConvoTable } from "./RecentConvoTable";
import { channelRows } from "../mocks/dashboard.mock";

type DashboardNotificationId =
  | "shopify-error"
  | "shopify-connecting"
  | "shopify-connected";

const dashboardNotifications: Array<{
  id: DashboardNotificationId;
  type: "alert" | "info" | "success";
  message: string;
  buttonText: string;
}> = [
  {
    id: "shopify-error",
    type: "alert",
    message: "Shopify Integration Connection Failed",
    buttonText: "Retry",
  },
  {
    id: "shopify-connecting",
    type: "info",
    message: "Shopify Integration is connecting at the moment",
    buttonText: "View Status",
  },
  {
    id: "shopify-connected",
    type: "success",
    message: "Shopify Integration Connected",
    buttonText: "View Integration",
  },
];

export function DashboardPage() {
  const [dismissedIds, setDismissedIds] = useState<
    Set<DashboardNotificationId>
  >(new Set());

  const visibleNotifications = dashboardNotifications.filter(
    (n) => !dismissedIds.has(n.id),
  );

  function dismiss(id: DashboardNotificationId) {
    setDismissedIds((prev) => new Set([...prev, id]));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business activity and AI automation performance
        </p>
      </div>

      {visibleNotifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          type={notification.type}
          message={notification.message}
          buttonText={notification.buttonText}
          onClick={() => {}}
          onDismiss={() => dismiss(notification.id)}
        />
      ))}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          type="convo"
          label="Total Conversations"
          value="2,847"
          trend={12.5}
        />

        <MetricCard
          type="ai-handled"
          label="AI-Handled"
          value="2,134"
          helperText="75%"
          trend={8.2}
        />

        <MetricCard
          type="resolution-rate"
          label="Resolution Rate"
          value="94.2%"
          trend={2.1}
        />

        <MetricCard
          type="escalations"
          label="Escalations"
          value="127"
          trend={-5.3}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <RecentActivityCard />
        <ChannelBreakdownCard channelRows={channelRows} />
      </div>
      <div>
        <RecentConvoTable />
      </div>
    </div>
  );
}
