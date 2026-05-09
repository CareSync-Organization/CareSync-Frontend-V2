import { Bot, ChevronDown, Flag, Shield, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ChatConversation, MessageSenderRole } from "../types/chat.types";

type ConversationActionsProps = {
  conversation: ChatConversation;
  currentUserRole?: Extract<MessageSenderRole, "admin" | "agent">;
};

const demoAgents = [
  { id: "agent_1", name: "John Doe" },
  { id: "agent_2", name: "Sarah Williams" },
  { id: "agent_3", name: "Mike Chen" },
];

export function ConversationActions({
  conversation,
  currentUserRole = "admin",
}: ConversationActionsProps) {
  const escalationOptions =
    currentUserRole === "admin"
      ? [
          {
            label: "Move control to CareSync AI",
            helper: "Let the AI agent continue the conversation.",
            icon: Bot,
            disabled: conversation.mode === "ai",
          },
          {
            label: conversation.assignedTo
              ? `Move control to ${conversation.assignedTo.name}`
              : "Move control to assigned human agent",
            helper: conversation.assignedTo
              ? "Return control to the assigned human agent."
              : "Assign this conversation before handing it to a human agent.",
            icon: UserPlus,
            disabled: !conversation.assignedTo || conversation.mode === "human",
          },
        ]
      : [
          {
            label: "Escalate to admin",
            helper: "Ask an admin to take ownership of this conversation.",
            icon: Shield,
            disabled: false,
          },
          {
            label: "Move control to CareSync AI",
            helper: "Let the AI agent continue the conversation.",
            icon: Bot,
            disabled: conversation.mode === "ai",
          },
        ];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-10 gap-2">
            <UserPlus className="size-4" />
            Assign
            <ChevronDown className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Assign to agent</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {demoAgents.map((agent) => (
            <DropdownMenuItem
              key={agent.id}
              onSelect={() => console.log("Assign conversation", conversation.id, agent.id)}
            >
              <UserPlus className="size-4" />
              {agent.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="h-10 gap-2">
            <Flag className="size-4" />
            Escalate
            <ChevronDown className="size-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Escalation path</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {escalationOptions.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuItem
                key={option.label}
                disabled={option.disabled}
                className="items-start gap-3 py-2"
                onSelect={() =>
                  console.log("Escalate conversation", conversation.id, option.label)
                }
              >
                <Icon className="mt-0.5 size-4" />
                <span className="grid gap-0.5">
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.helper}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
