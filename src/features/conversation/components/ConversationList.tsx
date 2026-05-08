import { useMemo, useState } from "react";
import { MessageSquareDashed } from "lucide-react";

import { SearchInput } from "@/components/shared/SearchInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConversationListItem } from "./ConversationListItem";
import type { ChatConversation, ConversationStatus } from "../types/chat.types";

type ConversationListProps = {
  conversations: ChatConversation[];
  selectedConversationId: string;
  onSelectConversation: (conversation: ChatConversation) => void;
};

const filters: Array<{
  label: string;
  value: ConversationStatus | "all" | "ai" | "human";
}> = [
  { label: "All", value: "all" },
  { label: "AI", value: "ai" },
  { label: "Human", value: "human" },
  { label: "Escalated", value: "escalated" },
];

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]["value"]>("all");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch =
        conversation.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        conversation.preview.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        conversation.status === activeFilter ||
        conversation.mode === activeFilter;

      return matchesSearch && matchesFilter;
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
              className={cn(
                "h-8 rounded-lg",
                activeFilter !== filter.value && "bg-muted",
              )}
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
