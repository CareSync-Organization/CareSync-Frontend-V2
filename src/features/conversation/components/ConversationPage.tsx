import { useMemo, useState } from "react";

import { ChatPanel } from "./ChatPanel";
import { ConversationActions } from "./ConversationActions";
import { ConversationList } from "./ConversationList";
import { demoConversations } from "../types/chat-demo-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function ConversationPage() {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(
    demoConversations[0]?.id,
  );

  const selectedConversation = useMemo(() => {
    return (
      demoConversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? demoConversations[0]
    );
  }, [selectedConversationId]);

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
      <div className="shrink-0 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1>Conversations</h1>
          <p className="text-muted-foreground">
            Manage live customer conversations across every connected channel.
          </p>
        </div>

        <div className="hidden lg:block">
          <ConversationActions conversation={selectedConversation} />
        </div>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 overflow-hidden rounded-xl border bg-card shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]",
        )}
      >
        <div className={cn(isMobileChatOpen ? "hidden lg:block" : "block")}>
          <ConversationList
            conversations={demoConversations}
            selectedConversationId={selectedConversation.id}
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
          <div className="border-b bg-card p-3 lg:hidden">
            <ConversationActions conversation={selectedConversation} />
          </div>

          <div className="flex min-h-0 flex-col">
            <ChatPanel
              key={selectedConversation.id}
              conversation={selectedConversation}
              className="h-full rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
