import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { ChatPanel } from "./ChatPanel";
import { ConversationActions } from "./ConversationActions";
import { ConversationList } from "./ConversationList";
import { useConversations } from "../api/conversation.queries";
import type { ConversationSummary } from "../types/conversation.types";
import { useConversationSocket } from "../hooks/useConversationsSocket";

export function ConversationPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const { data: conversations = [] } = useConversations(activeStoreId);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Auto-select first conversation when the list loads
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation: ConversationSummary | null = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) ?? conversations[0] ?? null,
    [conversations, selectedConversationId],
  );

  useConversationSocket(activeStoreId, selectedConversation?.id);

  return (
    <section className="flex h-[calc(100vh-9rem)] min-h-0 flex-col gap-4 overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("lg:hidden", !isMobileChatOpen && "hidden")}
        onClick={() => setIsMobileChatOpen(false)}
      >
        <ArrowLeft className="size-4" />
      </Button>

      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1>Conversations</h1>
          <p className="text-muted-foreground">
            Manage live customer conversations across every connected channel.
          </p>
        </div>
        {selectedConversation && (
          <div className="hidden lg:block">
            <ConversationActions
              conversation={selectedConversation}
              storeId={activeStoreId}
            />
          </div>
        )}
      </div>

      <div className="grid min-h-0 flex-1 overflow-hidden rounded-xl border bg-card shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className={cn(isMobileChatOpen ? "hidden lg:block" : "block")}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id ?? ""}
            onSelectConversation={(conversation) => {
              setSelectedConversationId(conversation.id);
              setIsMobileChatOpen(true);
            }}
          />
        </div>

        <div className={cn(isMobileChatOpen ? "flex" : "hidden lg:flex", "min-h-0 min-w-0 flex-col overflow-hidden")}>
          {selectedConversation ? (
            <>
              <div className="border-b bg-card p-3 lg:hidden">
                <ConversationActions
                  conversation={selectedConversation}
                  storeId={activeStoreId}
                />
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <ChatPanel
                  key={selectedConversation.id}
                  conversation={selectedConversation}
                  className="h-full rounded-none"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <p>No conversation selected</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
