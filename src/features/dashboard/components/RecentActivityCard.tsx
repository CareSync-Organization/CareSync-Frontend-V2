import { AlertTriangle, Clock, FileText, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useRecentTickets } from "@/features/tickets/api/tickets.queries";
import { channelConfig } from "@/features/integrations/config/channel-config";
import type { Ticket, TicketStatus } from "@/features/tickets/types/ticket.types";
import { ACTION_LABELS } from "@/features/tickets/types/ticket.types";

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const statusStyle: Partial<Record<TicketStatus, string>> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  failed: "bg-red-500/10 text-red-600 dark:text-red-400",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  denied: "bg-red-500/10 text-red-500",
  completed_externally: "bg-muted text-muted-foreground",
};

const dotStyle: Partial<Record<TicketStatus, string>> = {
  pending: "bg-amber-500",
  processing: "bg-blue-500",
  failed: "bg-red-500",
  approved: "bg-emerald-500",
  denied: "bg-red-400",
  completed_externally: "bg-muted-foreground",
};

type TicketRowProps = {
  ticket: Ticket;
  onClick: () => void;
};

function TicketRow({ ticket, onClick }: TicketRowProps) {
  const channelLabel =
    channelConfig[ticket.channel as keyof typeof channelConfig]?.label ??
    ticket.channel;
  const isPending = ticket.status === "pending";
  const isFailed = ticket.status === "failed";
  const isProcessing = ticket.status === "processing";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 rounded-lg px-2 py-2 text-left transition hover:bg-muted/50",
        (isPending || isFailed) && "bg-amber-500/5 hover:bg-amber-500/10",
      )}
    >
      <span
        className={cn(
          "mt-1.5 size-2.5 shrink-0 rounded-full",
          dotStyle[ticket.status] ?? "bg-muted-foreground",
        )}
      />

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {ticket.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span>{ticket.customerName}</span>
          <span>·</span>
          <span>{channelLabel}</span>
          <span>·</span>
          <span>{ACTION_LABELS[ticket.actionType]}</span>
          <span>·</span>
          <span>{formatRelativeTime(ticket.createdAt)}</span>
        </div>
      </div>

      <Badge
        className={cn(
          "shrink-0 text-xs",
          statusStyle[ticket.status] ?? "bg-muted text-muted-foreground",
        )}
      >
        {isProcessing ? (
          <Loader2 className="mr-1 size-3 animate-spin" />
        ) : isPending ? (
          <Clock className="mr-1 size-3" />
        ) : isFailed ? (
          <AlertTriangle className="mr-1 size-3" />
        ) : null}
        {ticket.status.replace(/_/g, " ")}
      </Badge>
    </button>
  );
}

type RecentActivityCardProps = {
  onTicketClick: (ticket: Ticket) => void;
};

export function RecentActivityCard({ onTicketClick }: RecentActivityCardProps) {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const { data: tickets = [], isLoading, isError } = useRecentTickets(activeStoreId);

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>

      <CardContent className="flex h-full flex-col space-y-1">
        {isLoading ? (
          <div className="space-y-2 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[auto_1fr_auto] items-start gap-4 px-2 py-2"
              >
                <div className="mt-1.5 size-2.5 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <AlertTriangle className="size-6 opacity-40" />
            <p className="text-sm">Could not load tickets</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <FileText className="size-6 opacity-40" />
            <p className="text-sm">No tickets yet</p>
            <p className="text-xs opacity-70">
              AI-created action requests will appear here
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
