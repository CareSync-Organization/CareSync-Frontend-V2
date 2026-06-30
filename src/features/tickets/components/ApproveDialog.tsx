import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Ticket } from "../types/ticket.types";
import { ACTION_LABELS } from "../types/ticket.types";

type ApproveDialogProps = {
  open: boolean;
  ticket: Ticket;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ApproveDialog({
  open,
  ticket,
  isPending,
  onOpenChange,
  onConfirm,
}: ApproveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve this action?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {ACTION_LABELS[ticket.actionType]}
            </span>{" "}
            for customer <span className="font-medium text-foreground">{ticket.customerName}</span>.
            <br />
            <br />
            This will execute the action on Shopify. The customer will receive a
            confirmation message once processing completes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-primary"
          >
            {isPending ? "Submitting…" : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
