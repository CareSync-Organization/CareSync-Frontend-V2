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

type DarazDisconnectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: ConnectorRecord | null;
};

export function DarazDisconnectDialog({
  open,
  onOpenChange,
  connector,
}: DarazDisconnectDialogProps) {
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
          <AlertDialogTitle>Disconnect Daraz?</AlertDialogTitle>
          <AlertDialogDescription>
            CareSync will stop importing Daraz inventory and customer messages
            for this seller account. Existing conversations and synced records
            will remain available.
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
            loadingText="Disconnecting…"
            onClick={handleDisconnect}
          >
            Disconnect
          </ActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
