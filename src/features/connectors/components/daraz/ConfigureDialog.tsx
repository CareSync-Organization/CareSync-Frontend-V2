import { MessageCircleMore, RefreshCw } from "lucide-react";

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
import {
  usePollDarazMessages,
  useSyncDarazInventory,
} from "../../api/connectors.queries";
import type {
  ConnectorRecord,
  DarazConnectorMetadata,
} from "../../types/connectors.types";

type DarazConfigureDialogProps = {
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

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString() : undefined;
}

function formatSyncStats(metadata?: DarazConnectorMetadata) {
  const stats = metadata?.lastInventorySync;
  if (!stats) return undefined;
  return [
    typeof stats.created === "number" ? `${stats.created} created` : null,
    typeof stats.updated === "number" ? `${stats.updated} updated` : null,
    typeof stats.skipped === "number" ? `${stats.skipped} skipped` : null,
    typeof stats.conflicts === "number" ? `${stats.conflicts} conflicts` : null,
  ]
    .filter(Boolean)
    .join(", ");
}

export function DarazConfigureDialog({
  open,
  onOpenChange,
  connector,
  readOnly = false,
}: DarazConfigureDialogProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const syncMutation = useSyncDarazInventory(activeStoreId ?? undefined);
  const pollMutation = usePollDarazMessages(activeStoreId ?? undefined);
  const metadata = connector?.metadata as DarazConnectorMetadata | undefined;
  const actionsDisabled =
    readOnly || !connector || connector.status !== "active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img
              src="/Connectors/Daraz.png"
              alt=""
              className="h-6 w-auto object-contain"
            />
            Daraz configuration
          </DialogTitle>
          <DialogDescription>
            Review the connected seller account and run an on-demand sync.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border px-4">
          <DetailRow label="Seller" value={connector?.displayName} />
          <DetailRow label="Marketplace" value={metadata?.regionName} />
          <DetailRow
            label="Seller ID"
            value={metadata?.sellerId || metadata?.shortCode || connector?.externalId}
          />
          <DetailRow label="Status" value={connector?.status} />
          <DetailRow
            label="Inventory sync"
            value={formatSyncStats(metadata)}
          />
          <DetailRow
            label="Inventory last checked"
            value={formatDate(metadata?.lastInventorySync?.syncedAt)}
          />
          <DetailRow
            label="Messages last checked"
            value={formatDate(metadata?.lastImPoll?.polledAt)}
          />
        </div>

        {connector?.lastError ? (
          <p className="text-sm text-destructive">{connector.lastError}</p>
        ) : null}

        <DialogFooter className="sm:flex-wrap">
          <ActionButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </ActionButton>
          <ActionButton
            type="button"
            variant="secondary"
            startIcon={<MessageCircleMore className="size-4" />}
            isLoading={pollMutation.isPending}
            loadingText="Checking…"
            disabled={actionsDisabled || syncMutation.isPending}
            onClick={() => connector && pollMutation.mutate(connector.id)}
          >
            Check messages
          </ActionButton>
          <ActionButton
            type="button"
            startIcon={<RefreshCw className="size-4" />}
            isLoading={syncMutation.isPending}
            loadingText="Starting sync…"
            disabled={actionsDisabled || pollMutation.isPending}
            onClick={() => connector && syncMutation.mutate(connector.id)}
          >
            Sync inventory
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
