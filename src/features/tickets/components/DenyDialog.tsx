import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type DenyDialogProps = {
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function DenyDialog({
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: DenyDialogProps) {
  const [reason, setReason] = useState("");

  function handleConfirm() {
    onConfirm(reason.trim());
    setReason("");
  }

  function handleOpenChange(open: boolean) {
    if (!isPending) {
      if (!open) setReason("");
      onOpenChange(open);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deny this ticket?</DialogTitle>
          <DialogDescription>
            The ticket will be marked as denied. If you add a reason, it will
            be sent directly to the customer in the conversation.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Reason for denial (optional, max 1000 characters)"
          value={reason}
          onChange={(e) => setReason(e.target.value.slice(0, 1000))}
          rows={3}
          disabled={isPending}
        />
        <p className="text-right text-xs text-muted-foreground">
          {reason.length} / 1000
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {isPending ? "Denying…" : "Deny ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
