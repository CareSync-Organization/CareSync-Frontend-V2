import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Message } from "../types/conversation.types";

type MessageBubbleProps = {
  message: Message;
  customerName: string;
};

const SENDER_DISPLAY: Record<string, string> = {
  customer: "",        // filled in from customerName prop
  agent: "Admin",
  bot: "CareSync AI",
  system: "System",
};

export function MessageBubble({ message, customerName }: MessageBubbleProps) {
  const isOutgoing = message.senderType !== "customer" && message.senderType !== "system";
  const senderName =
    message.senderType === "customer" ? customerName : (SENDER_DISPLAY[message.senderType] ?? message.senderType);

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
          isOutgoing ? "bg-primary/10 text-foreground" : "bg-muted text-foreground",
        )}
      >
        <p className="mb-1 text-xs font-medium text-muted-foreground">{senderName}</p>

        <p>{message.content}</p>

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
