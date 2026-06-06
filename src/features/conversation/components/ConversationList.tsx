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
  selectedConversationId: string;
  onSelectConversation: (conversation: ConversationSummary) => void;
};

export function ConversationList({
  conversations,
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
        {filteredConversations.length === 0 ? (
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
