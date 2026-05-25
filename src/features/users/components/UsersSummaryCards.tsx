import { cn } from "@/lib/utils";

type UsersSummaryCardsProps = {
  counts: {
    total: number;
    active: number;
    pending: number;
  };
};

export function UsersSummaryCards({ counts }: UsersSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <UserMetric label="Total Users" value={counts.total} />
      <UserMetric label="Active" value={counts.active} className="text-emerald-500" />
      <UserMetric
        label="Pending Invites"
        value={counts.pending}
        className="text-red-500"
      />
    </div>
  );
}

type UserMetricProps = {
  label: string;
  value: number;
  className?: string;
};

function UserMetric({ label, value, className }: UserMetricProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-2xl font-semibold text-foreground", className)}>
        {value}
      </p>
    </div>
  );
}
