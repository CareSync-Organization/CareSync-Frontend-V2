import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { cn } from "@/lib/utils";
import { type ChannelKey } from "@/features/dashboard/types/channel-keys"

type ChannelBreakdownItem = {
  channel: ChannelKey;
  label: string;
  count: number;
  percentage: number;
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
          const config = channelConfig[item.channel];
          const Icon = config.icon;

          return (
            <div key={item.channel} className="space-y-1.5">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center",
                      "size-6",
                      config.textClassName,
                    )}
                  >
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt=""
                        className="h-5 w-auto scale-125 object-contain"
                      />
                    ) : (
                      <Icon className="size-4" />
                    )}
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
                  className={cn("h-full rounded-full", config.barClassName)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {item.percentage}% of total
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
