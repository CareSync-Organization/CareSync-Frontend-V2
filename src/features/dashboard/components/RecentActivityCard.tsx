import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActivityTone = "danger" | "success" | "info" | "warning";

type ActivityTarget =
  | { kind: "conversation"; id: string }
  | { kind: "integration"; id: string }
  | { kind: "order"; id: string };

type RecentActivity = {
  id: string;
  tone: ActivityTone;
  title: string;
  customerName?: string;
  channel: string;
  timeAgo: string;
  target: ActivityTarget;
};

const toneClassName = {
  danger: "bg-red-500",
  success: "bg-emerald-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
} satisfies Record<ActivityTone, string>;

const demoActivities: RecentActivity[] = [
  {
    id: "1",
    tone: "danger",
    title: "Customer issue escalated on WhatsApp",
    customerName: "Sarah Johnson",
    channel: "WhatsApp",
    timeAgo: "2 minutes ago",
    target: { kind: "conversation", id: "conv_1" },
  },
  {
    id: "2",
    tone: "success",
    title: "Order inquiry resolved by AI",
    customerName: "Mike Chen",
    channel: "Shopify",
    timeAgo: "15 minutes ago",
    target: { kind: "conversation", id: "conv_2" },
  },
  {
    id: "3",
    tone: "info",
    title: "New conversation started",
    customerName: "Emma Wilson",
    channel: "Daraz",
    timeAgo: "23 minutes ago",
    target: { kind: "conversation", id: "conv_3" },
  },
  {
    id: "4",
    tone: "success",
    title: "Shipping query resolved by AI",
    customerName: "David Brown",
    channel: "Facebook",
    timeAgo: "1 hour ago",
    target: { kind: "conversation", id: "conv_4" },
  },
];

function getActivityHref(target: ActivityTarget) {
  if (target.kind === "conversation") return "/conversations";
  if (target.kind === "integration") return "/connectors";
  return "/dashboard";
}

export function RecentActivityCard() {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 flex h-full flex-col">
        {demoActivities.map((activity) => (
          <div
            key={activity.id}
            className="grid grid-cols-[auto_1fr_auto] items-start gap-4"
          >
            <span
              className={cn(
                "mt-2 size-2.5 rounded-full",
                toneClassName[activity.tone],
              )}
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {activity.title}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {activity.customerName ? (
                  <span>{activity.customerName}</span>
                ) : null}
                <span>•</span>
                <span>{activity.channel}</span>
                <span>•</span>
                <span>{activity.timeAgo}</span>
              </div>
            </div>

            <Button variant="link" className="h-auto px-0 text-primary" asChild>
              <Link to={getActivityHref(activity.target)}>View</Link>
            </Button>
          </div>
        ))}

        <div className="mt-auto flex justify-center pt-12">
          <Button variant="link" className="h-auto px-0 text-primary" asChild>
            <Link to="/conversations">View All Activity</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
