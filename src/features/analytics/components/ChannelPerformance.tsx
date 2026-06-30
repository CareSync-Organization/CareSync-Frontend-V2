import { channelConfig } from "@/features/integrations/config/channel-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { ChannelPerformanceRow } from "../types/analytics.types";

const channelProgressClassName: Record<string, string> = {
  whatsapp: "[&_[data-slot=progress-indicator]]:bg-whatsapp",
  daraz: "[&_[data-slot=progress-indicator]]:bg-daraz",
  shopify: "[&_[data-slot=progress-indicator]]:bg-shopify",
};

type ChannelPerformanceProps = {
  data: ChannelPerformanceRow[];
  isLoading?: boolean;
};

export function ChannelPerformance({ data, isLoading }: ChannelPerformanceProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Channel Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 border-b pb-5 last:border-b-0 last:pb-0">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))
        ) : data.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No channel data for this period</p>
        ) : (
          data.map((row) => {
            const config = channelConfig[row.channel as keyof typeof channelConfig];
            const successRate = row.aiSuccessRate ?? 0;

            return (
              <div key={row.channel} className="border-b pb-5 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">{row.label}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">AI Success Rate</p>
                  </div>
                  <p className="text-right text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {row.conversationCount.toLocaleString()}
                    </span>{" "}
                    conversations
                  </p>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(180px,1fr)_72px_140px] sm:items-end">
                  <div className="space-y-2">
                    <Progress
                      value={successRate}
                      className={cn("h-2", channelProgressClassName[row.channel])}
                    />
                  </div>
                  <p className={cn("text-sm font-medium", config?.textClassName)}>
                    {row.aiSuccessRate !== null ? `${row.aiSuccessRate}%` : "—"}
                  </p>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg First Response</p>
                    <p className="mt-1 text-sm font-medium">{row.avgFirstResponse}</p>
                  </div>
                </div>

                {row.unansweredCount > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {row.unansweredCount} unanswered
                  </p>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
