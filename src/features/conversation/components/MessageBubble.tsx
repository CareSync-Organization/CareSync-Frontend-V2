import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Message } from "../types/conversation.types";

type MessageBubbleProps = {
  message: Message;
  customerName: string;
  currentUserId?: string;
  currentUserName?: string;
};

export function MessageBubble({ message, customerName, currentUserId, currentUserName }: MessageBubbleProps) {
  if (message.senderType === "system") {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">{message.content}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    );
  }

  const isOutgoing = message.senderType !== "customer";

  function getSenderName(): string {
    if (message.senderType === "customer") return customerName;
    if (message.senderType === "bot") return "CareSync AI";
    if (message.senderType === "agent") {
      if (currentUserId && message.senderId === currentUserId) {
        return currentUserName ?? "You";
      }
      return "Agent";
    }
    return message.senderType;
  }

  const senderName = getSenderName();

  return (
    <div className={cn("flex gap-2", isOutgoing && "justify-end")}>
      {!isOutgoing ? (
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
          <User className="size-4" />
        </div>
      ) : null}

      <div
        className={cn(
          "max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm",
          isOutgoing ? "bg-green-300 dark:bg-black/30 text-foreground" : "bg-muted text-foreground",
        )}
      >
        <p className="mb-1 text-xs font-medium text-muted-foreground">{senderName}</p>

        <p className="text-black dark:text-white">{message.content}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {message.senderType !== "customer" ? (
            <span className="ml-2 capitalize">· {message.deliveryStatus}</span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
