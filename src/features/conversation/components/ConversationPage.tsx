import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useSearch } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useHasPermission } from "@/lib/hooks/useHasPermission";
import { ChatPanel } from "./ChatPanel";
import { ConversationActions } from "./ConversationActions";
import { ConversationList } from "./ConversationList";
import { useConversations } from "../api/conversation.queries";
import type { ConversationSummary } from "../types/conversation.types";

export function ConversationPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const canWrite = useHasPermission("conversations", "write");
  const { data: conversations = [], isLoading: isConversationsLoading } =
    useConversations(activeStoreId);
  const { c: deepLinkId } = useSearch({ from: "/_app/_tabs/conversations" });
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const deepLinkApplied = useRef(false);

  useEffect(() => {
    if (conversations.length === 0) return;
    if (deepLinkId && !deepLinkApplied.current) {
      const match = conversations.find((c) => c.id === deepLinkId);
      if (match) {
        deepLinkApplied.current = true;
        setSelectedConversationId(match.id);
        setIsMobileChatOpen(true);
        return;
      }
    }
    if (!selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId, deepLinkId]);

  const selectedConversation: ConversationSummary | null = useMemo(
    () =>
      conversations.find((c) => c.id === selectedConversationId) ??
      conversations[0] ??
      null,
    [conversations, selectedConversationId],
  );


  return (
    <section className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden px-1">
      <div className="flex shrink-0 items-center gap-3 lg:justify-between">
        {isMobileChatOpen && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setIsMobileChatOpen(false)}
          >
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <div className={cn("min-w-0 flex-1", isMobileChatOpen && "lg:block hidden")}>
          <h1>Conversations</h1>
          <p className="hidden sm:block text-muted-foreground">
            Manage live customer conversations across every connected channel.
          </p>
        </div>
        {selectedConversation && (
          <div className="hidden lg:block shrink-0">
            <ConversationActions
              conversation={selectedConversation}
              storeId={activeStoreId}
              readOnly={!canWrite}
            />
          </div>
        )}
      </div>

      <div className="grid min-h-0 flex-1 overflow-hidden rounded-xl border bg-card shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className={cn(isMobileChatOpen ? "hidden lg:flex" : "flex", "min-h-0 flex-col overflow-hidden")}>
          <ConversationList
            conversations={conversations}
            isLoading={Boolean(activeStoreId) && isConversationsLoading}
            selectedConversationId={selectedConversation?.id ?? ""}
            onSelectConversation={(conversation) => {
              setSelectedConversationId(conversation.id);
              setIsMobileChatOpen(true);
            }}
          />
        </div>

        <div
          className={cn(
            isMobileChatOpen ? "flex" : "hidden lg:flex",
            "min-h-0 min-w-0 flex-col overflow-hidden",
          )}
        >
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
