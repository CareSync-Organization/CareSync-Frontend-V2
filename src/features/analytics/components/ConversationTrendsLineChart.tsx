import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type TimeRange = "3m" | "6m" | "1y";

const titleMap: Record<TimeRange, string> = {
  "3m": "Conversation Trends - Last 3 Months",
  "6m": "Conversation Trends - Last 6 Months",
  "1y": "Conversation Trends - Last Year",
};

const sliceMap: Record<TimeRange, number> = { "3m": 3, "6m": 6, "1y": 12 };

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last Year" },
];

type ConversationTrendsLineChartProps = {
  data: ConversationTrendPoint[];
};

export function ConversationTrendsLineChart({
  data,
}: ConversationTrendsLineChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");

  const filteredData = useMemo(
    () => data.slice(-sliceMap[timeRange]),
    [data, timeRange],
  );

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{titleMap[timeRange]}</CardTitle>
        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
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
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={trendChartConfig}
          className="h-80 w-full aspect-auto"
          initialDimension={{ width: 800, height: 320 }}
        >
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 4, right: 16, top: 8, bottom: 8 }}
          >
            <CartesianGrid vertical strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
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
      </CardContent>
    </Card>
  );
}
