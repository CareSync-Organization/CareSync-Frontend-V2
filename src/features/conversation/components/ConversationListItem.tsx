import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";
import { channelConfig } from "@/features/integrations/config/channel-config";
import { cn } from "@/lib/utils";
import type { ChatConversation } from "../types/chat.types";

type ConversationListItemProps = {
  conversation: ChatConversation;
  isActive: boolean;
  onSelect: (conversation: ChatConversation) => void;
};

export function ConversationListItem({
  conversation,
  isActive,
  onSelect,
}: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={cn(
        "flex w-full gap-3 border-b px-4 py-4 text-left transition hover:bg-muted/60",
        isActive && "bg-primary/10 hover:bg-primary/10",
      )}
    >
      <UserAvatar name={conversation.customerName} className="size-10 shrink-0" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{conversation.customerName}</p>

            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge
                className={channelConfig[conversation.channel].badgeClassName}
              >
                {channelConfig[conversation.channel].label}
              </Badge>

              <Badge
                variant="secondary"
                className={cn(
                  conversation.status === "escalated" &&
                    "bg-destructive/15 text-destructive",
                )}
              >
                {conversation.status}
              </Badge>

              <Badge variant="outline">{conversation.mode}</Badge>
            </div>
          </div>

          <div className="shrink-0 text-xs text-muted-foreground">
            {new Date(conversation.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="truncate text-sm text-muted-foreground">
            {conversation.preview}
          </p>

          {conversation.unreadCount ? (
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {conversation.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
