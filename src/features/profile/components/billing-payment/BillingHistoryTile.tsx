import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BillingHistoryTileProps = {
  date: string;
  plan: string;
  amount: string;
  status: "paid" | "pending" | "failed";
};

const statusClassName = {
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  failed: "bg-red-500/10 text-red-600 dark:text-red-400",
} satisfies Record<BillingHistoryTileProps["status"], string>;

export function BillingHistoryTile({
  date,
  plan,
  amount,
  status,
}: BillingHistoryTileProps) {
  return (
    <div className="flex items-center justify-between border-b py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{date}</p>
        <p className="text-xs text-muted-foreground">{plan}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-medium">{amount}</span>
        <Badge className={statusClassName[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
          <Download className="size-3.5" />
          Download
        </Button>
      </div>
    </div>
  );
}
