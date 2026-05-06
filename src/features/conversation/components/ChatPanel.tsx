import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { demoMessages } from "../types/chat-demo-data";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";
import type { ChatConversation, ChatMessage } from "../types/chat.types";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";

type ChatPanelProps = {
  conversation: ChatConversation;
  className?: string;
};

export function ChatPanel({ conversation, className }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(
    demoMessages.filter(
      (message) => message.conversationId === conversation.id,
    ),
  );

  function handleSend(body: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        conversationId: conversation.id,
        sender: {
          id: "current_user",
          name: "John Doe",
          role: "admin",
        },
        body,
        createdAt: new Date().toISOString(),
        status: "sent",
      },
    ]);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, messages.length]);

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-card",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex gap-3">
          <UserAvatar name={conversation.customerName} className="size-12" />
          <div>
            <h2 className="font-semibold">{conversation.customerName}</h2>
            <p className="text-sm text-muted-foreground">
              via {conversation.channel}
            </p>
          </div>
        </div>

        <Badge variant="secondary">{conversation.channel}</Badge>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-5">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageComposer onSend={handleSend} />
    </section>
  );
}
