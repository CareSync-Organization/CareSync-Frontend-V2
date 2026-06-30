import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AnalyticsMetric } from "../types/analytics.types";

type AnalyticsMetricsCardProps = {
  metric: AnalyticsMetric;
};

export function AnalyticsMetricsCard({ metric }: AnalyticsMetricsCardProps) {
  const Icon = metric.icon;
  const trend = metric.trend;
  const good = metric.isImprovement ?? (trend !== null && trend >= 0);
  const TrendIcon = trend !== null && trend >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "grid size-11 place-items-center rounded-lg",
              metric.toneClassName,
            )}
          >
            <Icon className={cn("size-5", metric.iconClassName)} />
          </span>
          {trend !== null ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                good ? "text-emerald-500" : "text-red-500",
              )}
            >
              <TrendIcon className="size-4" />
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          ) : (
            <span className="inline-flex items-center text-sm font-medium text-muted-foreground">—</span>
          )}
        </div>
        <p className="mt-5 text-sm text-black dark:text-muted-foreground">{metric.label}</p>
        <p className="mt-3 text-2xl font-semibold tracking-normal text-black dark:text-muted-foreground">
          {metric.value}
        </p>
      </CardContent>
    </Card>
  );
}
