import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { DataTableColumnHeader } from "@/components/shared/data-table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { ChatPanel } from "@/features/conversation/components/ChatPanel";
import type { ConversationSummary } from "@/features/conversation/types/conversation.types";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import type { RecentConversation } from "../types/dashboard.types";

function formatResponseTime(seconds: number | null): string {
  if (seconds === null) return "—";
  const s = Math.round(seconds * 10) / 10;
  if (s < 60) return `${s}s`;
  const totalMinutes = Math.floor(s / 60);
  const remSeconds = Math.round(s % 60);
  if (totalMinutes < 60) return remSeconds > 0 ? `${totalMinutes}m ${remSeconds}s` : `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const remMinutes = totalMinutes % 60;
  if (hours < 24) return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
}

const handlingModeLabel: Record<RecentConversation["handlingMode"], string> = {
  ai: "AI",
  human: "Human",
  unanswered: "Unanswered",
};

const handlingModeClass: Record<RecentConversation["handlingMode"], string> = {
  ai: "bg-emerald-500/10 text-emerald-600",
  human: "bg-amber-500/10 text-amber-600",
  unanswered: "bg-muted text-muted-foreground",
};

function mapToConversationSummary(
  row: RecentConversation,
  storeId: string,
): ConversationSummary {
  return {
    id: row.id,
    storeId,
    customer: {
      id: row.customer.id,
      displayName: row.customer.displayName,
    },
    connectorId: row.connectorId,
    channel: row.channel as ConversationSummary["channel"],
    status: row.status as ConversationSummary["status"],
    assignedUserId: null,
    lastMessageAt: row.lastMessageAt,
    latestMessage: row.latestMessage
      ? {
          id: row.latestMessage.id,
          senderType: row.latestMessage.senderType as NonNullable<ConversationSummary["latestMessage"]>["senderType"],
          deliveryStatus: row.latestMessage.deliveryStatus as NonNullable<ConversationSummary["latestMessage"]>["deliveryStatus"],
          createdAt: row.latestMessage.createdAt,
          content: row.latestMessage.content,
        }
      : null,
    createdAt: row.lastMessageAt ?? new Date().toISOString(),
    updatedAt: row.lastMessageAt ?? new Date().toISOString(),
  };
}

const columns: ColumnDef<RecentConversation>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.customer.displayName || "Unknown"}</span>
    ),
    accessorFn: (row) => row.customer.displayName,
    filterFn: "includesString",
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => {
      const cfg = channelConfig[row.original.channel as keyof typeof channelConfig];
      return cfg ? (
        <Badge className={cfg.badgeClassName}>{cfg.label}</Badge>
      ) : (
        <Badge>{row.original.channel}</Badge>
      );
    },
    filterFn: "equalsString",
  },
  {
    accessorKey: "handlingMode",
    header: "Mode",
    cell: ({ row }) => (
      <Badge className={handlingModeClass[row.original.handlingMode]}>
        {handlingModeLabel[row.original.handlingMode]}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "firstResponseSeconds",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Response" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatResponseTime(row.original.firstResponseSeconds)}
      </span>
    ),
  },
  {
    accessorKey: "latestMessage",
    header: "Last Message",
    cell: ({ row }) => (
      <span className="block max-w-[320px] truncate text-muted-foreground">
        {row.original.latestMessage?.content ?? "—"}
      </span>
    ),
  },
];

type RecentConvoTableProps = {
  conversations: RecentConversation[];
  storeId: string;
  isLoading?: boolean;
};

export function RecentConvoTable({ conversations, storeId, isLoading }: RecentConvoTableProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<RecentConversation | null>(null);

  return (
    <>
      <section className="rounded-xl border-2 bg-card shadow-sm">
        <div className="space-y-1 border-b px-4 py-4">
          <h2 className="text-base font-semibold">Recent Conversations</h2>
          <p className="text-sm text-muted-foreground">
            Click any row to open the conversation
          </p>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3 py-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={conversations}
              onRowClick={setSelectedConversation}
              toolbar={(table) => {
                const customerColumn = table.getColumn("customer");
                const channelColumn = table.getColumn("channel");
                const modeColumn = table.getColumn("handlingMode");
                const hasFilters = table.getState().columnFilters.length > 0;

                return (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="grid gap-3 md:grid-cols-[minmax(240px,360px)_180px_180px]">
                      <SearchInput
                        placeholder="Search customer..."
                        value={(customerColumn?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                          customerColumn?.setFilterValue(event.target.value)
                        }
                      />

                      <Select
                        value={(channelColumn?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                          channelColumn?.setFilterValue(value === "all" ? undefined : value)
                        }
                      >
                        <SelectTrigger className="h-11! w-full">
                          <SelectValue placeholder="Channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All channels</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="shopify">Shopify</SelectItem>
                          <SelectItem value="daraz">Daraz</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={(modeColumn?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                          modeColumn?.setFilterValue(value === "all" ? undefined : value)
                        }
                      >
                        <SelectTrigger className="h-11! w-full">
                          <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All modes</SelectItem>
                          <SelectItem value="ai">AI</SelectItem>
                          <SelectItem value="human">Human</SelectItem>
                          <SelectItem value="unanswered">Unanswered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {hasFilters ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                        className="self-start md:self-center"
                      >
                        <X className="size-4" />
                        Reset
                      </Button>
                    ) : null}
                  </div>
                );
              }}
            />
          )}
        </div>
      </section>

      <Dialog
        open={selectedConversation !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedConversation(null);
        }}
      >
        <DialogContent className="flex h-[min(800px,88vh)] max-w-4xl flex-col gap-0 p-0 overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b px-5 py-3 shrink-0 pr-12">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Conversation preview</p>
                  <p className="text-sm font-semibold truncate">{selectedConversation.customer.displayName}</p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedConversation(null)}
                >
                  <Link to="/conversations">
                    Full view
                    <ArrowUpRight className="size-3" />
                  </Link>
                </Button>
              </div>
              <div className="min-h-0 flex-1">
                <ChatPanel
                  conversation={mapToConversationSummary(selectedConversation, storeId)}
                  className="h-full rounded-none border-0 shadow-none"
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
