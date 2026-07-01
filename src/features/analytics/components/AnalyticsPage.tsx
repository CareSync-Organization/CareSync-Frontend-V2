import { useMemo, useState } from "react";
import { Download, Bot, Clock3, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

import { AIAccuracyPieChart } from "./AIAccuracyPieChart";
import { AnalyticsMetricsCard } from "./AnalyticsMetricsCard";
import { ChannelPerformance } from "./ChannelPerformance";
import { ConversationTrendsLineChart } from "./ConversationTrendsLineChart";
import { CustomerIntent } from "./CustomerIntent";

import { useAnalytics } from "../api/analytics.queries";
import { downloadAnalyticsExport, type AnalyticsRange } from "../api/analytics.api";
import type { AnalyticsMetric, AnalyticsSnapshot } from "../types/analytics.types";

type TimeRange = "3m" | "6m" | "1y";

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
];

const trendTitleMap: Record<TimeRange, string> = {
  "3m": "Conversation Trends of the Last 3 Months",
  "6m": "Conversation Trends of the Last 6 Months",
  "1y": "Conversation Trends of the Last Year",
};

function computeRange(range: TimeRange): AnalyticsRange {
  const end = new Date();
  const start = new Date(end);
  if (range === "3m") start.setMonth(start.getMonth() - 3);
  else if (range === "6m") start.setMonth(start.getMonth() - 6);
  else start.setFullYear(start.getFullYear() - 1);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { start: fmt(start), end: fmt(end), granularity: "month" };
}

function buildMetrics(snapshot: AnalyticsSnapshot | undefined): AnalyticsMetric[] {
  const m = snapshot?.metrics;
  return [
    {
      id: "total-conversations",
      label: "Total Conversations",
      value: m?.totalConversations.value?.toLocaleString() ?? "—",
      trend: m?.totalConversations.changePercent ?? null,
      isImprovement: m?.totalConversations.isImprovement,
      icon: MessageSquare,
      toneClassName: "bg-primary/10",
      iconClassName: "text-primary",
    },
    {
      id: "ai-success-rate",
      label: "AI Success Rate",
      value: m?.aiSuccessRate.value !== null && m?.aiSuccessRate.value !== undefined
        ? `${m.aiSuccessRate.value.toFixed(1)}%`
        : "—",
      trend: m?.aiSuccessRate.changePercent ?? null,
      isImprovement: m?.aiSuccessRate.isImprovement,
      icon: Bot,
      toneClassName: "bg-violet-500/10",
      iconClassName: "text-violet-500",
    },
    {
      id: "avg-first-response",
      label: "Avg First Response",
      value: m?.avgFirstResponseSeconds.value !== null && m?.avgFirstResponseSeconds.value !== undefined
        ? formatSeconds(m.avgFirstResponseSeconds.value)
        : "—",
      trend: m?.avgFirstResponseSeconds.changePercent ?? null,
      isImprovement: m?.avgFirstResponseSeconds.isImprovement,
      icon: Clock3,
      toneClassName: "bg-emerald-500/10",
      iconClassName: "text-emerald-500",
    },
    {
      id: "resolution-rate",
      label: "Resolution Rate",
      value: m?.resolutionRate.value !== null && m?.resolutionRate.value !== undefined
        ? `${m.resolutionRate.value.toFixed(1)}%`
        : "—",
      trend: m?.resolutionRate.changePercent ?? null,
      isImprovement: m?.resolutionRate.isImprovement,
      icon: CheckCircle2,
      toneClassName: "bg-teal-500/10",
      iconClassName: "text-teal-500",
    },
  ];
}

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const totalMinutes = Math.floor(seconds / 60);
  const remSeconds = Math.round(seconds % 60);
  if (totalMinutes < 60) return remSeconds > 0 ? `${totalMinutes}m ${remSeconds}s` : `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;
  return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
}

const EMPTY_OUTCOMES = { segments: [], sampleSize: 0, excludedCount: 0 };

export function AnalyticsPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");
  const [isExporting, setIsExporting] = useState(false);

  const analyticsRange = useMemo(() => computeRange(timeRange), [timeRange]);
  const { data: snapshot, isLoading } = useAnalytics(activeStoreId, analyticsRange);

  const metrics = useMemo(() => buildMetrics(snapshot), [snapshot]);

  async function handleExport() {
    if (!activeStoreId || isExporting) return;
    setIsExporting(true);
    try {
      await downloadAnalyticsExport(activeStoreId, analyticsRange);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1>Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Deep insights into conversation trends, AI performance, and customer behavior
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-44 h-11!">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ActionButton
            type="button"
            startIcon={<Download className="size-4" />}
            onClick={handleExport}
            disabled={isExporting || !activeStoreId}
          >
            {isExporting ? "Exporting…" : "Export Report"}
          </ActionButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
          : metrics.map((metric) => <AnalyticsMetricsCard key={metric.id} metric={metric} />)}
      </div>

      <ConversationTrendsLineChart
        data={snapshot?.conversationTrends ?? []}
        title={trendTitleMap[timeRange]}
        isLoading={isLoading}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        <ChannelPerformance data={snapshot?.channelPerformance ?? []} isLoading={isLoading} />
        <AIAccuracyPieChart data={snapshot?.aiOutcomes ?? EMPTY_OUTCOMES} isLoading={isLoading} />
      </div>

      <CustomerIntent
        data={snapshot?.customerIntents.rows ?? []}
        sampleSize={snapshot?.customerIntents.sampleSize}
        isLoading={isLoading}
      />
    </section>
  );
}
