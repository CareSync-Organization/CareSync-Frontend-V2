import { ActionButton } from "@/components/shared/ActionButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useDeleteConnector } from "../../api/connectors.queries";
import type { ConnectorRecord } from "../../types/connectors.types";

type ShopifyDisconnectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: ConnectorRecord | null;
};

export function ShopifyDisconnectDialog({
  open,
  onOpenChange,
  connector,
}: ShopifyDisconnectDialogProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const deleteMutation = useDeleteConnector(activeStoreId ?? undefined);

  function handleDisconnect() {
    if (!connector) return;

    deleteMutation.mutate(connector.id, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect Shopify?</AlertDialogTitle>
          <AlertDialogDescription>
            CareSync will stop syncing Shopify inventory and storefront chat for
            this store. Existing synced inventory records may remain until the
            backend removes or refreshes them.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="h-11" disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <ActionButton
            type="button"
            variant="destructive"
            isLoading={deleteMutation.isPending}
            loadingText="Disconnecting..."
            onClick={handleDisconnect}
          >
            Disconnect
          </ActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
