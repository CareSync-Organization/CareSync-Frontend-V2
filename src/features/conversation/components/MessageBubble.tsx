import { Bot, User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types/chat.types";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing =
    message.sender.role === "agent" ||
    message.sender.role === "admin" ||
    message.sender.role === "ai";
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
          isOutgoing
            ? "bg-primary/10 text-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {message.sender.name}
        </p>
        {message.sender.role === "ai" ? (
          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Bot className="size-3" />
            AI Response
          </div>
        ) : null}

        <p>{message.body}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
