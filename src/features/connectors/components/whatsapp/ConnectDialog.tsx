import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useCompleteWhatsAppOAuth } from "../../api/connectors.queries";
import { useMetaWhatsAppLogin } from "../../hooks/useMetaWhatsAppLogin";

type WhatsAppConnectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WhatsAppConnectDialog({
  open,
  onOpenChange,
}: WhatsAppConnectDialogProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const completeOAuthMutation = useCompleteWhatsAppOAuth(
    activeStoreId ?? undefined,
  );
  const metaLogin = useMetaWhatsAppLogin();

  async function handleConnect() {
    let didStartBackendMutation = false;

    try {
      const result = await metaLogin.startLogin();

      didStartBackendMutation = true;
      await completeOAuthMutation.mutateAsync({
        accessToken: result.accessToken,
        code: result.code,
        phoneNumberId: result.phoneNumberId,
        businessAccountId: result.businessAccountId,
        redirectUri: result.redirectUri,
      });

      onOpenChange(false);
    } catch (error) {
      if (didStartBackendMutation) return;

      toast.error(
        error instanceof Error ? error.message : "Failed to connect WhatsApp.",
      );
    }
  }

  const isPending = metaLogin.isLoading || completeOAuthMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect WhatsApp</DialogTitle>
          <DialogDescription>
            Authorize CareSync through Meta to sync WhatsApp Business
            conversations.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="grid size-32 place-items-center rounded-full bg-emerald-500/10 text-whatsapp">
            <FaWhatsapp className="size-20" />
          </div>

          <ActionButton
            type="button"
            onClick={handleConnect}
            disabled={isPending}
            isLoading={isPending}
            loadingText="Connecting..."
          >
            Continue with Meta
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
