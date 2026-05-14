import { ActionButton } from "@/components/shared/ActionButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { channelConfig } from "@/features/integrations/config/channel-config";
import type { ConnectorDialogTarget } from "./ConnectorActionDialog";

type DisconnectConnectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: ConnectorDialogTarget | null;
};

export function DisconnectConnectorDialog({
  open,
  onOpenChange,
  connector,
}: DisconnectConnectorDialogProps) {
  if (!connector) {
    return null;
  }

  const target = connector;
  const config = channelConfig[target.channel];

  function handleDisconnect() {
    console.log("disconnect connector", target.channel);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect {config.label}?</DialogTitle>
          <DialogDescription>
            CareSync will stop syncing new data from this connector for the
            current store. Existing conversations and analytics remain in the
            workspace.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <ActionButton type="button" variant="outline">
              Cancel
            </ActionButton>
          </DialogClose>
          <ActionButton
            type="button"
            variant="destructive"
            onClick={handleDisconnect}
          >
            Disconnect
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
