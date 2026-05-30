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
import { cn } from "@/lib/utils";

import type { AIAccuracySegment, AIAccuracyStatus } from "../types/analytics.types";

const accuracyConfig = {
  value: {
    label: "Conversations",
  },
  resolved: {
    label: "Resolved",
    color: "#10b981",
  },
  escalated: {
    label: "Escalated",
    color: "#f97316",
  },
  handoff: {
    label: "Handoff",
    color: "#7c3aed",
  },
} satisfies ChartConfig;

const segmentStyles = {
  resolved: { label: "Resolved", indicator: "bg-emerald-500", text: "text-emerald-500" },
  escalated: { label: "Escalated", indicator: "bg-orange-500", text: "text-orange-500" },
  handoff:   { label: "Handoff",   indicator: "bg-violet-500", text: "text-violet-500" },
} satisfies Record<AIAccuracyStatus, { label: string; indicator: string; text: string }>;

type AIAccuracyPieChartProps = {
  data: AIAccuracySegment[];
};

export function AIAccuracyPieChart({ data }: AIAccuracyPieChartProps) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <Card className="h-fit rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>AI Accuracy Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <ChartContainer
          config={accuracyConfig}
          className="mx-auto h-[220px] max-w-sm aspect-square"
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
                        {segmentStyles[String(name) as AIAccuracyStatus]?.label ?? name}
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
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={0}
              outerRadius={74}
              paddingAngle={1}
              strokeWidth={1}
            >
              {data.map((segment) => (
                <Cell
                  key={segment.status}
                  fill={`var(--color-${segment.colorKey})`}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {data.map((segment) => (
            <div key={segment.status} className="text-center">
              <div
                className={cn(
                  "flex items-center justify-center gap-2 text-sm font-medium",
                  segmentStyles[segment.status].text,
                )}
              >
                <span
                  className={cn(
                    "size-3 rounded-sm",
                    segmentStyles[segment.status].indicator,
                  )}
                />
                {segment.label}
              </div>
              <p className="mt-2 text-xl font-semibold">
                {segment.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {Math.round((segment.value / total) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
