import { RefreshCw } from "lucide-react";
import { FaShopify } from "react-icons/fa";

import { ActionButton } from "@/components/shared/ActionButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useSyncShopifyInventory } from "../../api/connectors.queries";
import type {
  ConnectorRecord,
  ShopifyConnectorMetadata,
} from "../../types/connectors.types";

type ShopifyConfigureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: ConnectorRecord | null;
  readOnly?: boolean;
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-64 truncate text-right font-medium">
        {value || "Not available"}
      </span>
    </div>
  );
}

function formatSyncStats(metadata: ShopifyConnectorMetadata) {
  const stats = metadata.inventoryLastSync;
  if (!stats) return undefined;

  return [
    typeof stats.created === "number" ? `${stats.created} created` : null,
    typeof stats.updated === "number" ? `${stats.updated} updated` : null,
    typeof stats.skipped === "number" ? `${stats.skipped} skipped` : null,
    typeof stats.deleted === "number" ? `${stats.deleted} deleted` : null,
  ]
    .filter(Boolean)
    .join(", ");
}

export function ShopifyConfigureDialog({
  open,
  onOpenChange,
  connector,
  readOnly = false,
}: ShopifyConfigureDialogProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const syncMutation = useSyncShopifyInventory(activeStoreId ?? undefined);
  const metadata = connector?.metadata as ShopifyConnectorMetadata | undefined;

  function handleSyncInventory() {
    if (!connector) return;
    syncMutation.mutate(connector.id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaShopify className="size-5 text-shopify" />
            Shopify Configuration
          </DialogTitle>
          <DialogDescription>
            Review the Shopify store connected to this CareSync store.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border px-4">
          <DetailRow label="Display name" value={connector?.displayName} />
          <DetailRow label="Shop domain" value={connector?.externalId} />
          <DetailRow label="Status" value={connector?.status} />
          <DetailRow label="Scopes" value={metadata?.scopes} />
          <DetailRow
            label="Inventory webhook"
            value={metadata?.inventoryWebhookAddress}
          />
          <DetailRow label="Last sync" value={metadata ? formatSyncStats(metadata) : undefined} />
          <DetailRow
            label="Updated"
            value={
              connector?.updatedAt
                ? new Date(connector.updatedAt).toLocaleString()
                : undefined
            }
          />
        </div>

        {connector?.lastError ? (
          <p className="text-sm text-destructive">{connector.lastError}</p>
        ) : null}

        <DialogFooter>
          <ActionButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </ActionButton>
          <ActionButton
            type="button"
            startIcon={<RefreshCw className="size-4" />}
            isLoading={syncMutation.isPending}
            loadingText="Starting sync..."
            disabled={readOnly || !connector || connector.status !== "active"}
            onClick={handleSyncInventory}
          >
            Sync inventory now
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
