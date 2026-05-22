import { useCallback, useMemo, useState } from "react";
import { Download, Package, Upload } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";

import { demoItems } from "../mocks/inventory.mock";
import type { InventoryItem, InventoryItemFormValues } from "../types/inventory.types";
import { createManualItem, getMetricCounts } from "../utils/inventory.utils";
import { InventoryItemDialog } from "./InventoryItemDialog";
import { InventorySummaryCards } from "./InventorySummaryCards";
import { InventoryTable } from "./InventoryTable";

type DialogState = {
  mode: "create" | "edit";
  item: InventoryItem | null;
} | null;

export function InventoryPage() {
  const [items, setItems] = useState(demoItems);
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const counts = useMemo(() => getMetricCounts(items), [items]);

  const handleAddItem = useCallback(
    () => setDialogState({ mode: "create", item: null }),
    [],
  );
  const handleEditItem = useCallback(
    (item: InventoryItem) => setDialogState({ mode: "edit", item }),
    [],
  );
  const handleDeleteItem = useCallback(
    (itemId: string) =>
      setItems((current) => current.filter((i) => i.id !== itemId)),
    [],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">
            Central inventory reference for channels without native inventory
            systems
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            type="button"
            variant="outline"
            startIcon={<Download className="size-4" />}
          >
            Export
          </ActionButton>
          <ActionButton
            type="button"
            variant="outline"
            startIcon={<Upload className="size-4" />}
          >
            Import CSV
          </ActionButton>
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-blue-500/25 bg-blue-500/10 p-4 text-blue-700 dark:text-blue-300">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-blue-500/10">
          <Package className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Inventory Sync</h2>
          <p className="mt-1 text-blue-700/80 dark:text-blue-300/80">
            Items synced from Shopify and Daraz are read-only and update
            automatically. Manual items can be edited or deleted as needed.
          </p>
        </div>
      </div>

      <InventorySummaryCards counts={counts} />

      <InventoryTable
        items={items}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />

      <InventoryItemDialog
        key={dialogState?.item?.id ?? dialogState?.mode ?? "closed"}
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        item={dialogState?.item ?? null}
        onOpenChange={(open) => {
          if (!open) setDialogState(null);
        }}
        onSave={(values: InventoryItemFormValues) => {
          if (dialogState?.mode === "edit" && dialogState.item) {
            setItems((current) =>
              current.map((item) =>
                item.id === dialogState.item?.id
                  ? { ...item, ...values, lastUpdated: new Date().toISOString() }
                  : item,
              ),
            );
          } else {
            setItems((current) => [createManualItem(values), ...current]);
          }
          setDialogState(null);
        }}
      />
    </section>
  );
}
