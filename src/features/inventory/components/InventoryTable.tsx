import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, Filter, Plus, Trash2 } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { SearchInput } from "@/components/shared/SearchInput";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { DataTableColumnHeader } from "@/components/shared/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { InventoryItem } from "../types/inventory.types";
import {
  availabilityLabel,
  formatDateTime,
  getAvailability,
  sourceLabel,
} from "../utils/inventory.utils";

type InventoryTableProps = {
  items: InventoryItem[];
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (itemId: string) => void;
};

export function InventoryTable({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: InventoryTableProps) {
  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: "sku",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="SKU / Part Number" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.sku}</span>
        ),
      },
      {
        accessorKey: "productName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product Name" />
        ),
        cell: ({ row }) => (
          <span className="block max-w-55 whitespace-normal font-medium">
            {row.original.productName}
          </span>
        ),
      },
      {
        accessorKey: "stockQuantity",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock Level" />
        ),
      },
      {
        id: "availability",
        accessorFn: (row) => getAvailability(row.stockQuantity),
        header: "Availability",
        filterFn: "equalsString",
        cell: ({ row }) => {
          const availability = getAvailability(row.original.stockQuantity);

          return (
            <Badge
              className={cn(
                availability === "in-stock" &&
                  "bg-emerald-500/10 text-emerald-500",
                availability === "low-stock" &&
                  "bg-amber-500/10 text-amber-500",
                availability === "out-of-stock" &&
                  "bg-red-500/10 text-red-500",
              )}
            >
              {availabilityLabel[availability]}
            </Badge>
          );
        },
      },
      {
        accessorKey: "source",
        header: "Source",
        filterFn: "equalsString",
        cell: ({ row }) => (
          <Badge
            className={cn(
              row.original.source === "manual" &&
                "bg-primary/10 text-primary",
              row.original.source === "shopify" &&
                "bg-violet-500/10 text-shopify",
              row.original.source === "daraz" &&
                "bg-orange-500/10 text-daraz",
            )}
          >
            {sourceLabel[row.original.source]}
          </Badge>
        ),
      },
      {
        accessorKey: "lastUpdated",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Updated" />
        ),
        cell: ({ row }) => formatDateTime(row.original.lastUpdated),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          if (row.original.source !== "manual") {
            return (
              <span className="text-xs text-muted-foreground">Read-only</span>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={`Edit ${row.original.productName}`}
                onClick={() => onEditItem(row.original)}
              >
                <Edit2 className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-destructive transition hover:bg-destructive/10"
                aria-label={`Delete ${row.original.productName}`}
                onClick={() => onDeleteItem(row.original.id)}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [onDeleteItem, onEditItem],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      toolbar={(table) => {
        const sourceColumn = table.getColumn("source");
        const availabilityColumn = table.getColumn("availability");

        return (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_180px_180px] lg:flex-1">
              <SearchInput
                placeholder="Search by product name or SKU..."
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
              />
              <Select
                value={(sourceColumn?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) =>
                  sourceColumn?.setFilterValue(
                    value === "all" ? undefined : value,
                  )
                }
              >
                <SelectTrigger className="h-11! w-full">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="shopify">Shopify</SelectItem>
                  <SelectItem value="daraz">Daraz</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={
                  (availabilityColumn?.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  availabilityColumn?.setFilterValue(
                    value === "all" ? undefined : value,
                  )
                }
              >
                <SelectTrigger className="h-11! w-full">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All availability</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton
                type="button"
                variant="outline"
                startIcon={<Filter className="size-4" />}
                onClick={() => {
                  table.resetColumnFilters();
                  table.setGlobalFilter("");
                }}
              >
                Reset
              </ActionButton>
              <ActionButton
                type="button"
                startIcon={<Plus className="size-4" />}
                onClick={onAddItem}
              >
                Add Item
              </ActionButton>
            </div>
          </div>
        );
      }}
    />
  );
}
