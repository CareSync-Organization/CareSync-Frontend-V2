import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ConnectorRecord,
  WhatsAppConnectorMetadata,
} from "../../types/connectors.types";

type WhatsAppConfigureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: ConnectorRecord | null;
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-64 truncate font-medium">
        {value || "Not available"}
      </span>
    </div>
  );
}

export function WhatsAppConfigureDialog({
  open,
  onOpenChange,
  connector,
}: WhatsAppConfigureDialogProps) {
  const metadata = connector?.metadata as WhatsAppConnectorMetadata | undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>WhatsApp Configuration</DialogTitle>
          <DialogDescription>
            Review the WhatsApp Business account connected to this store.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border px-4">
          <DetailRow label="Display name" value={connector?.displayName} />
          <DetailRow label="Status" value={connector?.status} />
          <DetailRow label="Phone number ID" value={metadata?.phoneNumberId} />
          <DetailRow
            label="Business account ID"
            value={metadata?.businessAccountId}
          />
          <DetailRow
            label="Verified name"
            value={metadata?.phoneNumber?.verifiedName}
          />
          <DetailRow
            label="Display phone"
            value={metadata?.phoneNumber?.displayPhoneNumber}
          />
          <DetailRow
            label="Webhook"
            value={metadata?.webhookSubscribed ? "Subscribed" : "Not subscribed"}
          />
        </div>

        {connector?.lastError ? (
          <p className="text-sm text-destructive">{connector.lastError}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
