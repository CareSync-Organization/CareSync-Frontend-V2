import { cn } from "@/lib/utils";
import type { InventorySummary } from "../types/inventory.types";

type InventorySummaryCardsProps = {
  counts: InventorySummary;
};

export function InventorySummaryCards({ counts }: InventorySummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InventoryMetric label="Total Items" value={counts.totalItems} />
      <InventoryMetric
        label="In Stock"
        value={counts.inStock}
        className="text-emerald-500"
      />
      <InventoryMetric
        label="Low Stock"
        value={counts.lowStock}
        className="text-amber-500"
      />
      <InventoryMetric
        label="Out of Stock"
        value={counts.outOfStock}
        className="text-red-500"
      />
    </div>
  );
}

type InventoryMetricProps = {
  label: string;
  value: number;
  className?: string;
};

function InventoryMetric({ label, value, className }: InventoryMetricProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-muted-foreground">{label}</p>
      <p
        className={cn("mt-2 text-2xl font-semibold text-foreground", className)}
      >
        {value}
      </p>
    </div>
  );
}
