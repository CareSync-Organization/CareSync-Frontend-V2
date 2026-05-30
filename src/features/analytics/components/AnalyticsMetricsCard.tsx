import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AnalyticsMetric } from "../types/analytics.types";

type AnalyticsMetricsCardProps = {
  metric: AnalyticsMetric;
};

export function AnalyticsMetricsCard({ metric }: AnalyticsMetricsCardProps) {
  const Icon = metric.icon;
  const TrendIcon = metric.trend < 0 ? ArrowDownRight : ArrowUpRight;
  const isPositive = metric.trend >= 0;

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
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              isPositive ? "text-emerald-500" : "text-red-500",
            )}
          >
            <TrendIcon className="size-4" />
            {metric.trendLabel}
          </span>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{metric.label}</p>
        <p className="mt-3 text-2xl font-semibold tracking-normal">
          {metric.value}
        </p>
      </CardContent>
    </Card>
  );
}
