import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { AIOutcomes, AIOutcomeStatus } from "../types/analytics.types";

const outcomeConfig = {
  value: { label: "Conversations" },
  resolved: { label: "Resolved by AI", color: "#10b981" },
  escalated: { label: "Escalated", color: "#f97316" },
  handoff: { label: "Human Handoff", color: "#7c3aed" },
} satisfies ChartConfig;

const segmentStyles: Record<AIOutcomeStatus, { indicator: string; text: string }> = {
  resolved:  { indicator: "bg-emerald-500", text: "text-emerald-500" },
  escalated: { indicator: "bg-orange-500",  text: "text-orange-500"  },
  handoff:   { indicator: "bg-violet-500",  text: "text-violet-500"  },
};

type AIAccuracyPieChartProps = {
  data: AIOutcomes;
  isLoading?: boolean;
};

export function AIAccuracyPieChart({ data, isLoading }: AIAccuracyPieChartProps) {
  return (
    <Card className="h-fit rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>AI Outcome Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="mx-auto h-55 w-55 rounded-full" />
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          </div>
        ) : data.segments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No AI outcome data for this period</p>
        ) : (
          <>
            <ChartContainer
              config={outcomeConfig}
              className="mx-auto h-55 max-w-sm aspect-square"
              initialDimension={{ width: 320, height: 220 }}
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="status"
                      formatter={(value, name) => (
                        <div className="flex min-w-32 items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            {outcomeConfig[String(name) as AIOutcomeStatus]?.label ?? name}
                          </span>
                          <span className="font-mono font-medium text-foreground">
                            {Number(value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={data.segments}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={0}
                  outerRadius={74}
                  paddingAngle={1}
                  strokeWidth={1}
                >
                  {data.segments.map((segment) => (
                    <Cell
                      key={segment.status}
                      fill={`var(--color-${segment.status})`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {data.segments.map((segment) => (
                <div key={segment.status} className="text-center">
                  <div className={cn("flex items-center justify-center gap-2 text-sm font-medium", segmentStyles[segment.status].text)}>
                    <span className={cn("size-3 rounded-sm", segmentStyles[segment.status].indicator)} />
                    {segment.label}
                  </div>
                  <p className="mt-2 text-xl font-semibold">{segment.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{segment.percentage}%</p>
                </div>
              ))}
            </div>

            {data.excludedCount > 0 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {data.excludedCount} conversations excluded (open or incomplete)
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
