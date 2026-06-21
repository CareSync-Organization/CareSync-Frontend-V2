import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { useConversationDetail, useSendMessage } from "../api/conversation.queries";
import type { ConversationSummary } from "../types/conversation.types";

type ChatPanelProps = {
  conversation: ConversationSummary;
  className?: string;
};

export function ChatPanel({ conversation, className }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: detail, isLoading } = useConversationDetail(conversation.id);
  const sendMessage = useSendMessage({
    storeId: conversation.storeId,
    conversationId: conversation.id,
  });
  const messages = detail?.messages ?? [];
  const isAiMode = conversation.status === "open";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, messages.length]);

  return (
    <section className={cn("flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-card", className)}>
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex gap-3">
          <UserAvatar name={conversation.customer.displayName} className="size-12" />
          <div>
            <h2 className="font-semibold">{conversation.customer.displayName}</h2>
            <p className="text-sm text-muted-foreground">via {conversation.channel}</p>
          </div>
        </div>
        <Badge className={channelConfig[conversation.channel].badgeClassName}>
          {channelConfig[conversation.channel].label}
        </Badge>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary opacity-60" />
          </div>
        ) : (
          <div className="flex min-h-full flex-col justify-end">
            <div className="space-y-5">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  customerName={conversation.customer.displayName}
                />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageComposer
        onSend={(content) => sendMessage.mutate(content)}
        isSending={sendMessage.isPending}
        disabled={isAiMode}
        disabledReason="AI bot is handling this conversation. Escalate to admin to reply."
      />
    </section>
  );
}
