import type { ElementType } from "react";
import { Bot, ChevronDown, CheckCircle2, UserCog, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useMyPermissions } from "@/features/stores/api/permissions.queries";
import { useUpdateConversationStatus } from "../api/conversation.queries";
import type { ConversationStatus, ConversationSummary } from "../types/conversation.types";

type ConversationActionsProps = {
  conversation: ConversationSummary;
  storeId: string | null | undefined;
  readOnly?: boolean;
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
  readOnly = false,
}: ConversationActionsProps) {
  const updateStatus = useUpdateConversationStatus(storeId);
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const { data: perms } = useMyPermissions(activeStoreId);
  const isAgent = perms?.role === "agent";
  const isResolved = conversation.status === "resolved";

  if (readOnly) return null;

  const handleStatusChange = (status: ConversationStatus) => {
    updateStatus.mutate({ conversationId: conversation.id, status });
  };

  if (isResolved) {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2"
        disabled={updateStatus.isPending}
        onClick={() => handleStatusChange("open")}
      >
        <RotateCcw className="size-4" />
        Reopen
      </Button>
    );
  }

  const escalationOptions: StatusOption[] = [
    {
      label: isAgent ? "Take over as Agent" : "Escalate to admin",
      helper: isAgent
        ? "Pause AI replies and take over this conversation yourself."
        : "Pause AI replies and allow manual admin responses.",
      icon: UserCog,
      disabled: conversation.status === "manual",
      status: "manual",
    },
    {
      label: "Hand back to AI",
      helper: "Let the AI bot handle new customer messages.",
      icon: Bot,
      disabled: conversation.status === "open",
      status: "open",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2"
        disabled={updateStatus.isPending}
        onClick={() => handleStatusChange("resolved")}
      >
        <CheckCircle2 className="size-4 text-emerald-500" />
        Resolve
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-10 gap-2">
            <UserCog className="size-4" />
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
                onSelect={() => handleStatusChange(option.status)}
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
