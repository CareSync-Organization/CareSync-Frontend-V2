import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { cn } from "@/lib/utils";
import { type ChannelKey } from "@/features/dashboard/types/channel-keys"

type ChannelBreakdownItem = {
  channel: string;
  label: string;
  count: number;
  percentage: number | null;
};

type ChannelBreakdownCardProps = {
  channelRows: ChannelBreakdownItem[];
};

export function ChannelBreakdownCard({
  channelRows,
}: ChannelBreakdownCardProps) {
  return (
    <Card className="rounded-xl border shadow-sm bg-card">
      <CardHeader>
        <CardTitle>Channel Breakdown</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {channelRows.map((item) => {
          const config = channelConfig[item.channel as ChannelKey];
          const Icon = config?.icon;
          const pct = item.percentage ?? 0;

          return (
            <div key={item.channel} className="space-y-1.5">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center",
                      "size-6",
                      config?.textClassName,
                    )}
                  >
                    {Icon && typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt=""
                        className="h-5 w-auto scale-125 object-contain"
                      />
                    ) : Icon ? (
                      <Icon className="size-4" />
                    ) : null}
                  </span>

                  <span className="truncate text-sm font-medium">
                    {item.label}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-medium">
                  {item.count}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", config?.barClassName)}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {item.percentage !== null ? `${item.percentage}% of total` : "—"}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
