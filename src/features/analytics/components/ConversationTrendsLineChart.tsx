import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import type { ConversationTrendPoint } from "../types/analytics.types";

const trendChartConfig = {
  aiHandled: {
    label: "AI Handled",
    color: "#7c3aed",
  },
  humanHandled: {
    label: "Human Handled",
    color: "#f97316",
  },
  total: {
    label: "Total",
    color: "#0f766e",
  },
} satisfies ChartConfig;

type ConversationTrendsLineChartProps = {
  data: ConversationTrendPoint[];
  title: string;
  isLoading?: boolean;
};

export function ConversationTrendsLineChart({ data, title, isLoading }: ConversationTrendsLineChartProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-lg" />
        ) : data.length === 0 ? (
          <div className="flex h-80 items-center justify-center">
            <p className="text-sm text-muted-foreground">No conversation data for this period</p>
          </div>
        ) : (
          <ChartContainer
            config={trendChartConfig}
            className="h-80 w-full aspect-auto"
            initialDimension={{ width: 800, height: 320 }}
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ left: 4, right: 16, top: 8, bottom: 8 }}
            >
              <CartesianGrid vertical strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={44}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="aiHandled"
                type="monotone"
                stroke="var(--color-aiHandled)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                dataKey="humanHandled"
                type="monotone"
                stroke="var(--color-humanHandled)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                dataKey="total"
                type="monotone"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
