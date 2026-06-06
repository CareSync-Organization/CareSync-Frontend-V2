import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "../types/conversation.types";

type ConversationListItemProps = {
  conversation: ConversationSummary;
  isActive: boolean;
  onSelect: (conversation: ConversationSummary) => void;
};

const SENDER_LABEL: Record<string, string> = {
  customer: "Customer message",
  agent: "Agent replied",
  bot: "AI responded",
  system: "System event",
};

export function ConversationListItem({
  conversation,
  isActive,
  onSelect,
}: ConversationListItemProps) {
  const preview = conversation.latestMessage
    ? (conversation.latestMessage.content ??
      SENDER_LABEL[conversation.latestMessage.senderType] ??
      "New message")
    : "No messages yet";
  const timestamp = conversation.lastMessageAt ?? conversation.updatedAt;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={cn(
        "flex w-full gap-3 border-b px-4 py-4 text-left transition hover:bg-muted/60",
        isActive && "bg-primary/10 hover:bg-primary/10",
      )}
    >
      <UserAvatar name={conversation.customer.displayName} className="size-10 shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{conversation.customer.displayName}</p>

            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge className={channelConfig[conversation.channel].badgeClassName}>
                {channelConfig[conversation.channel].label}
              </Badge>

              <Badge
                variant="secondary"
                className={cn(
                  conversation.status === "escalated" && "bg-destructive/15 text-destructive",
                )}
              >
                {conversation.status}
              </Badge>
            </div>
          </div>

          <div className="shrink-0 text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <p className="mt-2 truncate text-sm text-muted-foreground">{preview}</p>
      </div>
    </button>
  );
}
