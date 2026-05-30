import { channelConfig } from "@/features/integrations/config/channel-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ChannelKey } from "@/features/integrations/types/channel.types";
import { cn } from "@/lib/utils";

import type { ChannelPerformanceRow } from "../types/analytics.types";

const channelProgressClassName: Record<ChannelKey, string> = {
  whatsapp: "[&_[data-slot=progress-indicator]]:bg-whatsapp",
  daraz: "[&_[data-slot=progress-indicator]]:bg-daraz",
  shopify: "[&_[data-slot=progress-indicator]]:bg-shopify",
  facebook: "[&_[data-slot=progress-indicator]]:bg-facebook",
  instagram: "[&_[data-slot=progress-indicator]]:bg-instagram",
  email: "[&_[data-slot=progress-indicator]]:bg-muted-foreground",
};

type ChannelPerformanceProps = {
  data: ChannelPerformanceRow[];
};

export function ChannelPerformance({ data }: ChannelPerformanceProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Channel Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {data.map((row) => {
          const config = channelConfig[row.channel];

          return (
            <div
              key={row.channel}
              className="border-b pb-5 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">{config.label}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    AI Success Rate
                  </p>
                </div>
                <p className="text-right text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {row.conversationCount.toLocaleString()}
                  </span>{" "}
                  conversations
                </p>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(180px,1fr)_72px_120px] sm:items-end">
                <div className="space-y-2">
                  <Progress
                    value={row.aiSuccessRate}
                    className={cn("h-2", channelProgressClassName[row.channel])}
                  />
                </div>
                <p className={cn("text-sm font-medium", config.textClassName)}>
                  {row.aiSuccessRate}%
                </p>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Avg Time (min)
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {row.avgResponseMinutes}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
