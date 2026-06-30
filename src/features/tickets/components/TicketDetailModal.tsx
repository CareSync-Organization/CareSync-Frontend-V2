import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, ExternalLink, Loader2, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useHasPermission } from "@/lib/hooks/useHasPermission";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { sendMessage } from "@/features/conversation/api/conversation.api";

import { useApproveTicket, useDenyTicket } from "../api/tickets.queries";
import { ACTION_LABELS, STATUS_LABELS } from "../types/ticket.types";
import type { Ticket, TicketActionType, TicketStatus } from "../types/ticket.types";
import { ApproveDialog } from "./ApproveDialog";
import { DenyDialog } from "./DenyDialog";

type TicketDetailModalProps = {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const statusConfig: Record<
  TicketStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending review",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: Loader2,
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  denied: {
    label: "Denied",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: XCircle,
  },
  completed_externally: {
    label: "Completed externally",
    className: "bg-muted text-muted-foreground",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  },
};

function PayloadRow({ label, value }: { label: string; value: unknown }) {
  if (value === undefined || value === null || value === "") return null;
  const display =
    typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
  return (
    <div className="flex flex-col gap-0.5 border-b py-2 text-sm last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium break-all">{display}</span>
    </div>
  );
}

const PAYLOAD_FIELDS: Record<TicketActionType, Array<[string, string]>> = {
  cancel_order: [["Order ID", "order_id"], ["Reason", "reason"]],
  create_refund: [["Order ID", "order_id"], ["Line items", "line_items"]],
  refund_order: [["Order ID", "order_id"], ["Reason", "reason"]],
  update_fulfillment: [
    ["Fulfillment ID", "fulfillment_id"],
    ["Order ID", "order_id"],
    ["Tracking number", "tracking_number"],
    ["Carrier", "tracking_company"],
  ],
  update_inventory: [
    ["Item ID", "item_id"],
    ["New quantity", "available"],
  ],
};

export function TicketDetailModal({
  ticket,
  open,
  onOpenChange,
}: TicketDetailModalProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const canWrite = useHasPermission("conversations", "write");
  const approveMutation = useApproveTicket(activeStoreId);
  const denyMutation = useDenyTicket(activeStoreId);

  const [approveOpen, setApproveOpen] = useState(false);
  const [denyOpen, setDenyOpen] = useState(false);

  if (!ticket) return null;

  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;
  const isPending = ticket.status === "pending";
  const isProcessing = ticket.status === "processing";
  const isMutating = approveMutation.isPending || denyMutation.isPending;
  const channelLabel =
    channelConfig[ticket.channel as keyof typeof channelConfig]?.label ??
    ticket.channel;

  function handleApprove() {
    approveMutation.mutate(ticket!.id, {
      onSuccess: () => setApproveOpen(false),
    });
  }

  function handleDeny(reason: string) {
    denyMutation.mutate(
      { ticketId: ticket!.id, reason },
      {
        onSuccess: async () => {
          setDenyOpen(false);
          if (reason.trim() && ticket!.conversation) {
            try {
              await sendMessage(ticket!.conversation, reason.trim());
            } catch {
              // message send failure is non-fatal — ticket is already denied
            }
          }
        },
      },
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <span className="font-mono text-sm text-muted-foreground">
                {ticket.ticketNumber}
              </span>
              <Badge className={cn("text-xs", status.className)}>
                <StatusIcon
                  className={cn(
                    "mr-1 size-3",
                    isProcessing && "animate-spin",
                  )}
                />
                {status.label}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Action type + title */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {ACTION_LABELS[ticket.actionType]}
              </p>
              <p className="mt-1 font-semibold">{ticket.title}</p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Customer: <span className="text-foreground font-medium">{ticket.customerName}</span></span>
              <span>Channel: <span className="text-foreground font-medium">{channelLabel}</span></span>
              <span>
                Created:{" "}
                <span className="text-foreground font-medium">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </span>
              {ticket.resolvedAt ? (
                <span>
                  Resolved:{" "}
                  <span className="text-foreground font-medium">
                    {new Date(ticket.resolvedAt).toLocaleString()}
                  </span>
                </span>
              ) : null}
            </div>

            {/* Customer issue */}
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Customer issue
              </p>
              <p>{ticket.issue}</p>
            </div>

            {/* Action payload */}
            <div className="rounded-lg border px-4">
              <p className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Action details
              </p>
              {(PAYLOAD_FIELDS[ticket.actionType] ?? []).map(([label, key]) => (
                <PayloadRow
                  key={key}
                  label={label}
                  value={ticket.payload[key]}
                />
              ))}
            </div>

            {/* Missing fields warning */}
            {!ticket.isActionable && ticket.missingActionFields.length > 0 ? (
              <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-medium">Missing action data</p>
                  <p className="mt-0.5 text-xs">
                    Required before approving:{" "}
                    <span className="font-mono">
                      {ticket.missingActionFields.join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            ) : null}

            {/* Error message */}
            {ticket.errorMessage ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <p className="font-medium">Execution error</p>
                <p className="mt-0.5">{ticket.errorMessage}</p>
              </div>
            ) : null}

            {/* Resolution note */}
            {ticket.resolutionNote ? (
              <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Denial reason
                </p>
                <p>{ticket.resolutionNote}</p>
              </div>
            ) : null}

            {/* Processing notice */}
            {isProcessing ? (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <Loader2 className="size-4 animate-spin" />
                <span>Processing on Shopify — waiting for confirmation…</span>
              </div>
            ) : null}

            {/* Footer: conversation link + action buttons */}
            <div className="flex items-center justify-between pt-1">
              <Button variant="link" className="h-auto px-0 text-sm" asChild>
                <Link to="/conversations" onClick={() => onOpenChange(false)}>
                  <ExternalLink className="mr-1 size-3.5" />
                  View conversation
                </Link>
              </Button>

              {isPending && canWrite ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isMutating}
                    onClick={() => setDenyOpen(true)}
                  >
                    Deny
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isMutating || !ticket.isActionable}
                    title={
                      !ticket.isActionable
                        ? "Complete missing action data before approving"
                        : undefined
                    }
                    onClick={() => setApproveOpen(true)}
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    Approve
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ApproveDialog
        open={approveOpen}
        ticket={ticket}
        isPending={approveMutation.isPending}
        onOpenChange={setApproveOpen}
        onConfirm={handleApprove}
      />
      <DenyDialog
        open={denyOpen}
        isPending={denyMutation.isPending}
        onOpenChange={setDenyOpen}
        onConfirm={handleDeny}
      />
    </>
  );
}
