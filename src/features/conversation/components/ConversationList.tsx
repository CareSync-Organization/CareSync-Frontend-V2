import { useMemo, useState } from "react";
import { MessageSquareDashed } from "lucide-react";

import { SearchInput } from "@/components/shared/SearchInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConversationListItem } from "./ConversationListItem";
import type { ConversationStatus, ConversationSummary } from "../types/conversation.types";

type FilterValue = "all" | ConversationStatus;

const filters: Array<{ label: string; value: FilterValue }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Manual", value: "manual" },
  { label: "Escalated", value: "escalated" },
  { label: "Resolved", value: "resolved" },
];

type ConversationListProps = {
  conversations: ConversationSummary[];
  isLoading?: boolean;
  selectedConversationId: string;
  onSelectConversation: (conversation: ConversationSummary) => void;
};

export function ConversationList({
  conversations,
  isLoading = false,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch = conversation.customer.displayName
        .toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "all") return true;
      return conversation.status === activeFilter;
    });
  }, [activeFilter, conversations, search]);

  return (
    <aside className="flex min-h-0 w-full flex-col border-r bg-card lg:w-90">
      <div className="border-b p-4">
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search conversations..."
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={activeFilter === filter.value ? "default" : "secondary"}
              onClick={() => setActiveFilter(filter.value)}
              className={cn("h-8 rounded-lg", activeFilter !== filter.value && "bg-muted")}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? (
          <ConversationListLoadingRows />
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <MessageSquareDashed className="size-8 opacity-40" />
            <p className="text-sm font-medium">No conversations found</p>
            <p className="text-xs opacity-70">Try a different search or filter</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === selectedConversationId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </ScrollArea>
    </aside>
  );
}

function ConversationListLoadingRows() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex h-28.25 w-full gap-3 border-b px-4 py-4"
        >
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="flex gap-1.5">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                  <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
              <div className="h-3 w-11 shrink-0 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-4 w-full max-w-52 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
