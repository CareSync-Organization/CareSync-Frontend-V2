import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";
import { AiTypingIndicator } from "./AiTypingIndicator";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { useConversationDetail, useSendMessage } from "../api/conversation.queries";
import type { ConversationSummary } from "../types/conversation.types";
import { useHasPermission } from "@/lib/hooks/useHasPermission";
import { useMe } from "@/features/auth/api/auth.queries";

type ChatPanelProps = {
  conversation: ConversationSummary;
  className?: string;
};

export function ChatPanel({ conversation, className }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: detail, isLoading, isError, refetch } = useConversationDetail(conversation.id);
  const sendMessage = useSendMessage({
    storeId: conversation.storeId,
    conversationId: conversation.id,
  });
  const { data: currentUser } = useMe();
  const messages = detail?.messages ?? [];
  const isAiMode = conversation.status === "open";
  const canWrite = useHasPermission("conversations", "write");
  const composerDisabled = !canWrite || isAiMode;
  const composerDisabledReason = !canWrite
    ? "You need write access to send messages."
    : "AI bot is handling this conversation. Escalate to reply manually.";

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
          <div className="flex min-h-full flex-col justify-end space-y-4">

            <div className="flex items-end gap-2">
              <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
              <div className="h-10 w-44 rounded-2xl rounded-tl-sm bg-muted animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-44 rounded-2xl rounded-tr-sm bg-muted animate-pulse" />
            </div>
            <div className="flex items-end gap-2">
              <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
              <div className="h-14 w-56 rounded-2xl rounded-tl-sm bg-muted animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="h-14 w-52 rounded-2xl rounded-tr-sm bg-muted animate-pulse" />
            </div>
            <div className="flex items-end gap-2">
              <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
              <div className="h-8 w-36 rounded-2xl rounded-tl-sm bg-muted animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="h-8 w-40 rounded-2xl rounded-tr-sm bg-muted animate-pulse" />
            </div>
            <div className="flex items-end gap-2">
              <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
              <div className="h-12 w-48 rounded-2xl rounded-tl-sm bg-muted animate-pulse" />
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-48 rounded-2xl rounded-tr-sm bg-muted animate-pulse" />
            </div>
            <div className="flex items-end gap-2">
              <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
              <div className="h-8 w-32 rounded-2xl rounded-tl-sm bg-muted animate-pulse" />
            </div>
          </div>
        ) : isError ? (
          <div className="flex min-h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">Failed to load messages.</p>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => void refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex min-h-full flex-col justify-end">
            <div className="space-y-5">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  customerName={conversation.customer.displayName}
                  currentUserId={currentUser?.id}
                  currentUserName={currentUser?.name}
                />
              ))}
              {(() => {
                const lastMsg = messages[messages.length - 1];
                const isRecent = lastMsg
                  ? Date.now() - new Date(lastMsg.createdAt).getTime() < 10 * 60 * 1000
                  : false;
                return isAiMode && lastMsg?.senderType === "customer" && isRecent
                  ? <AiTypingIndicator />
                  : null;
              })()}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageComposer
        onSend={(content) => sendMessage.mutate(content)}
        isSending={sendMessage.isPending}
        disabled={composerDisabled}
        disabledReason={composerDisabledReason}
      />
    </section>
  );
}
