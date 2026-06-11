import {
  Bot,
  CheckCircle2,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardType =
  | "convo"
  | "ai-handled"
  | "resolution-rate"
  | "escalations";

type MetricCardProps = {
  type: MetricCardType;
  label: string;
  value: string;
  helperText?: string;
  trend: number;
  className?: string;
};

const metricConfig = {
  convo: {
    icon: MessageSquare,
    iconBox: "bg-emerald-500/10 text-emerald-600",
  },
  "ai-handled": {
    icon: Bot,
    iconBox: "bg-violet-500/10 text-violet-600",
  },
  "resolution-rate": {
    icon: CheckCircle2,
    iconBox: "bg-emerald-500/10 text-emerald-600",
  },
  escalations: {
    icon: TriangleAlert,
    iconBox: "bg-orange-500/10 text-orange-600",
  },
} satisfies Record<
  MetricCardType,
  {
    icon: React.ElementType;
    iconBox: string;
  }
>;

export function MetricCard({
  type,
  label,
  value,
  helperText,
  trend,
  className,
}: MetricCardProps) {
  const config = metricConfig[type];
  const Icon = config.icon;
  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card
      className={cn(
        "min-h-40 rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "grid size-12 place-items-center rounded-xl",
              config.iconBox,
            )}
          >
            <Icon className="size-6" />
          </div>

          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400",
            )}
          >
            <TrendIcon className="size-4" />
            {isPositive ? "+" : ""}
            {trend}%
          </div>
        </div>

        <div>
          <p className="text-sm text-black dark:text-muted-foreground">{label}</p>

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-semibold tracking-tight text-black dark:text-muted-foreground">{value}</p>

            {helperText ? (
              <span className="text-sm text-black dark:text-muted-foreground">
                {helperText}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
