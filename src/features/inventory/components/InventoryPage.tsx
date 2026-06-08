import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Download, Package, Upload } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

import {
  useCreateInventoryItem,
  useDeleteInventoryItem,
  useInventoryItems,
  useInventorySummary,
  useUpdateInventoryItem,
} from "../api/inventory.queries";
import type {
  InventoryItem,
  InventoryItemFormValues,
} from "../types/inventory.types";
import { getMetricCounts } from "../utils/inventory.utils";
import { InventoryDeleteDialog } from "./InventoryDeleteDialog";
import { InventoryItemDialog } from "./InventoryItemDialog";
import { InventorySummaryCards } from "./InventorySummaryCards";
import { InventoryTable } from "./InventoryTable";

type DialogState = {
  mode: "create" | "edit";
  item: InventoryItem | null;
} | null;

export function InventoryPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const {
    data: items = [],
    isLoading,
    isError,
    refetch,
  } = useInventoryItems(activeStoreId);
  const { data: summary } = useInventorySummary(activeStoreId);

  const createInventoryItemMutation = useCreateInventoryItem(activeStoreId);
  const updateInventoryItemMutation = useUpdateInventoryItem(activeStoreId);
  const deleteInventoryItemMutation = useDeleteInventoryItem(activeStoreId);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

  const counts = summary ?? getMetricCounts(items);

  const handleAddItem = useCallback(
    () => setDialogState({ mode: "create", item: null }),
    [],
  );
  const handleEditItem = useCallback(
    (item: InventoryItem) => setDialogState({ mode: "edit", item }),
    [],
  );
  const handleDeleteItem = useCallback(
    (item: InventoryItem) => setDeleteItem(item),
    [],
  );

  const isSaving =
    createInventoryItemMutation.isPending ||
    updateInventoryItemMutation.isPending;

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
            disabled
          >
            Export
          </ActionButton>
          <ActionButton
            type="button"
            variant="outline"
            startIcon={<Upload className="size-4" />}
            disabled
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

      {!activeStoreId ? (
        <InventoryStatePanel
          title="No active store selected"
          description="Create or select a store from the top navigation before managing inventory."
        />
      ) : isLoading ? (
        <InventoryStatePanel
          title="Loading inventory"
          description="Fetching manual inventory for the active store."
        />
      ) : isError ? (
        <InventoryStatePanel
          title="Could not load inventory"
          description="Something went wrong while fetching inventory."
          action={
            <ActionButton
              type="button"
              variant="outline"
              onClick={() => refetch()}
            >
              Retry
            </ActionButton>
          }
        />
      ) : (
        <>
          <InventorySummaryCards counts={counts} />

          <InventoryTable
            items={items}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        </>
      )}

      <InventoryItemDialog
        key={dialogState?.item?.id ?? dialogState?.mode ?? "closed"}
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        item={dialogState?.item ?? null}
        onOpenChange={(open) => {
          if (!open) setDialogState(null);
        }}
        isSaving={isSaving}
        onSave={(values: InventoryItemFormValues) => {
          if (!activeStoreId) return;

          if (dialogState?.mode === "edit" && dialogState.item) {
            updateInventoryItemMutation.mutate({
              itemId: dialogState.item.id,
              ...values,
            });
          } else {
            createInventoryItemMutation.mutate({
              storeId: activeStoreId,
              ...values,
            });
          }

          setDialogState(null);
        }}
      />

      <InventoryDeleteDialog
        open={deleteItem !== null}
        item={deleteItem}
        isDeleting={deleteInventoryItemMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        onConfirm={() => {
          if (!deleteItem) return;

          deleteInventoryItemMutation.mutate(deleteItem.id);
          setDeleteItem(null);
        }}
      />
    </section>
  );
}

type InventoryStatePanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

function InventoryStatePanel({
  title,
  description,
  action,
}: InventoryStatePanelProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border bg-card p-8 text-center">
      <Package className="size-10 text-muted-foreground" />
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
