import type { ElementType } from "react";
import { Bot, ChevronDown, Flag, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateConversationStatus } from "../api/conversation.queries";
import type { ConversationStatus, ConversationSummary } from "../types/conversation.types";

type ConversationActionsProps = {
  conversation: ConversationSummary;
  storeId: string | null | undefined;
};

type StatusOption = {
  label: string;
  helper: string;
  icon: ElementType;
  disabled: boolean;
  status: ConversationStatus;
};

export function ConversationActions({
  conversation,
  storeId,
}: ConversationActionsProps) {
  const updateStatus = useUpdateConversationStatus(storeId);

  const escalationOptions: StatusOption[] = [
    {
      label: "Escalate to admin",
      helper: "Pause AI replies and allow manual admin responses.",
      icon: UserCog,
      disabled: conversation.status === "manual",
      status: "manual",
    },
    {
      label: "Escalate to AI bot",
      helper: "Let the AI bot handle new customer messages.",
      icon: Bot,
      disabled: conversation.status === "open",
      status: "open",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-10 gap-2">
            <Flag className="size-4" />
            Escalate
            <ChevronDown className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Conversation owner</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {escalationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.status}
                disabled={option.disabled || updateStatus.isPending}
                className="items-start gap-3 py-2"
                onSelect={() =>
                  updateStatus.mutate({ conversationId: conversation.id, status: option.status })
                }
              >
                <Icon className="mt-0.5 size-4 shrink-0" />
                <span className="grid gap-0.5">
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.helper}</span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
