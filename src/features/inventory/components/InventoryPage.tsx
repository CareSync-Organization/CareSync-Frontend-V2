import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useHasPermission } from "@/lib/hooks/useHasPermission";
import { useStoreConnectors } from "@/features/connectors/api/connectors.queries";

import {
  useCreateInventoryItem,
  useDeleteInventoryItem,
  useInventoryItems,
  useInventorySummary,
  useUpdateInventoryItem,
  useUpdateShopifyStock,
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
import { UpdateStockDialog } from "./UpdateStockDialog";

type DialogState = {
  mode: "create" | "edit";
  item: InventoryItem | null;
} | null;

export function InventoryPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const canWrite = useHasPermission("inventory", "write");
  const canWriteConnectors = useHasPermission("connectors", "write");
  const canUpdateStock = canWrite && canWriteConnectors;

  const {
    data: items = [],
    isLoading,
    isError,
    refetch,
  } = useInventoryItems(activeStoreId);
  const { data: summary } = useInventorySummary(activeStoreId);
  const { data: connectors = [] } = useStoreConnectors(activeStoreId ?? undefined);
  const shopifyConnector = connectors.find((c) => c.channel === "shopify" && c.status === "active") ?? null;

  const createInventoryItemMutation = useCreateInventoryItem(activeStoreId);
  const updateInventoryItemMutation = useUpdateInventoryItem(activeStoreId);
  const deleteInventoryItemMutation = useDeleteInventoryItem(activeStoreId);
  const updateShopifyStockMutation = useUpdateShopifyStock(activeStoreId);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);
  const [updateStockItem, setUpdateStockItem] = useState<InventoryItem | null>(null);

  const counts = summary ?? getMetricCounts(items);

  function requireWrite(): boolean {
    if (!canWrite) {
      toast.error("You need write access to manage inventory.");
      return false;
    }
    return true;
  }

  const handleAddItem = useCallback(
    () => { if (requireWrite()) setDialogState({ mode: "create", item: null }); },
    [canWrite],
  );
  const handleEditItem = useCallback(
    (item: InventoryItem) => { if (requireWrite()) setDialogState({ mode: "edit", item }); },
    [canWrite],
  );
  const handleDeleteItem = useCallback(
    (item: InventoryItem) => { if (requireWrite()) setDeleteItem(item); },
    [canWrite],
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
        <InventorySkeleton />
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
            canUpdateStock={canUpdateStock && Boolean(shopifyConnector)}
            onUpdateStock={(item) => setUpdateStockItem(item)}
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

      <UpdateStockDialog
        item={updateStockItem}
        open={updateStockItem !== null}
        isSaving={updateShopifyStockMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setUpdateStockItem(null);
        }}
        onConfirm={(available) => {
          if (!updateStockItem || !shopifyConnector) return;
          updateShopifyStockMutation.mutate(
            { connectorId: shopifyConnector.id, itemId: updateStockItem.id, available },
            { onSuccess: () => setUpdateStockItem(null) },
          );
        }}
      />
    </section>
  );
}

function InventorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-8 w-12 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="grid gap-3 md:grid-cols-3 lg:flex-1">
            <div className="h-11 rounded-xl bg-muted animate-pulse" />
            <div className="h-11 rounded-xl bg-muted animate-pulse" />
            <div className="h-11 rounded-xl bg-muted animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-24 rounded-xl bg-muted animate-pulse" />
            <div className="h-11 w-28 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-card shadow-sm">
          <div className="flex gap-6 border-b px-4 py-3">
            {[28, 36, 16, 24, 20, 28, 20].map((w, i) => (
              <div key={i} className={`h-4 w-${w} rounded bg-muted animate-pulse`} />
            ))}
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-6 border-b px-4 py-3 last:border-b-0">
              <div className="h-4 w-28 rounded bg-muted animate-pulse" />
              <div className="h-4 w-36 rounded bg-muted animate-pulse" />
              <div className="h-4 w-12 rounded bg-muted animate-pulse" />
              <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="flex gap-2">
                <div className="size-8 rounded-lg bg-muted animate-pulse" />
                <div className="size-8 rounded-lg bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
