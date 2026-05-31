import { Download } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";

import {
  aiAccuracyBreakdown,
  analyticsMetrics,
  channelPerformance,
  conversationTrends,
  customerIntents,
} from "../mocks/analytics.mock";
import { AIAccuracyPieChart } from "./AIAccuracyPieChart";
import { AnalyticsMetricsCard } from "./AnalyticsMetricsCard";
import { ChannelPerformance } from "./ChannelPerformance";
import { ConversationTrendsLineChart } from "./ConversationTrendsLineChart";
import { CustomerIntent } from "./CustomerIntent";

export function AnalyticsPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Deep insights into conversation trends, AI performance, and customer
            behavior
          </p>
        </div>
        <ActionButton
          type="button"
          startIcon={<Download className="size-4" />}
        >
          Export Report
        </ActionButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsMetrics.map((metric) => (
          <AnalyticsMetricsCard key={metric.id} metric={metric} />
        ))}
      </div>

      <ConversationTrendsLineChart data={conversationTrends} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <ChannelPerformance data={channelPerformance} />
        <AIAccuracyPieChart data={aiAccuracyBreakdown} />
      </div>

      <CustomerIntent data={customerIntents} />
    </section>
  );
}
