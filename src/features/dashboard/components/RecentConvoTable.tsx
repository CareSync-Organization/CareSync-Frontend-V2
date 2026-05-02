import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";

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
import { channelConfig } from "@/features/integrations/config/channel-config";
import { ChatPanel } from "@/features/conversation/components/ChatPanel";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import {
  type ConversationRow,
  type TableConversationMode,
  demoConversationRows,
} from "../mocks/recent-convos.mock";

function formatResponseTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
}

const statusClassName: Record<TableConversationMode, string> = {
  automated: "bg-emerald-500/10 text-emerald-500",
  manual: "bg-amber-500/10 text-amber-500",
};

const columns: ColumnDef<ConversationRow>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.customerName}</span>
    ),
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => (
      <Badge className={channelConfig[row.original.channel].badgeClassName}>
        {channelConfig[row.original.channel].label}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={statusClassName[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "responseTimeSeconds",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Response Time" />
    ),
    cell: ({ row }) => formatResponseTime(row.original.responseTimeSeconds),
  },
  {
    accessorKey: "satisfaction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Satisfaction" />
    ),
    cell: ({ row }) => `${row.original.satisfaction}%`,
  },
  {
    accessorKey: "lastMessage",
    header: "Last Message",
    cell: ({ row }) => (
      <span className="block max-w-[320px] truncate text-muted-foreground">
        {row.original.lastMessage}
      </span>
    ),
  },
];

export function RecentConvoTable() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationRow | null>(null);

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
          <DataTable
            columns={columns}
            data={demoConversationRows}
            onRowClick={setSelectedConversation}
            toolbar={(table) => {
              const customerColumn = table.getColumn("customerName");
              const channelColumn = table.getColumn("channel");
              const statusColumn = table.getColumn("status");

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
                      value={
                        (channelColumn?.getFilterValue() as string) ?? "all"
                      }
                      onValueChange={(value) =>
                        channelColumn?.setFilterValue(
                          value === "all" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger className="h-11! w-full">
                        <SelectValue placeholder="Channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All channels</SelectItem>
                        {Object.entries(channelConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={
                        (statusColumn?.getFilterValue() as string) ?? "all"
                      }
                      onValueChange={(value) =>
                        statusColumn?.setFilterValue(
                          value === "all" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger className="h-11! w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="automated">Automated</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
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
        </div>
      </section>

      <Dialog
        open={selectedConversation !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedConversation(null);
        }}
      >
        <DialogContent className="h-[min(760px,85vh)] max-w-5xl p-0">
          {selectedConversation ? (
            <ChatPanel
              conversation={{
                id: selectedConversation.id,
                customerName: selectedConversation.customerName,
                channel: selectedConversation.channel,
                status:
                  selectedConversation.status === "manual"
                    ? "assigned"
                    : "open",
                mode:
                  selectedConversation.status === "automated" ? "ai" : "human",
                preview: selectedConversation.lastMessage,
                updatedAt: selectedConversation.updatedAt,
              }}
              className="h-full rounded-none"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
