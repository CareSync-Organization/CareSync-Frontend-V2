import { useCallback, useMemo, useState } from "react";
import { Plus, Shield } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";

import { demoMembers } from "../mocks/users.mock";
import type { InviteUserValues } from "../schemas/invite-user.schema";
import type { TeamMember } from "../types/users.types";
import { InviteUserDialog } from "./InviteUserDialog";
import { UsersSummaryCards } from "./UsersSummaryCards";
import { UsersTable } from "./UsersTable";

type DialogState = {
  mode: "invite" | "edit";
  member: TeamMember | null;
} | null;

export function UsersPage() {
  const [members, setMembers] = useState(demoMembers);
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const counts = useMemo(
    () => ({
      total: members.length,
      active: members.filter((m) => m.status === "active").length,
      pending: members.filter((m) => m.status === "pending").length,
    }),
    [members],
  );

  const handleEditMember = useCallback(
    (member: TeamMember) => setDialogState({ mode: "edit", member }),
    [],
  );
  const handleDeleteMember = useCallback(
    (memberId: string) =>
      setMembers((curr) => curr.filter((m) => m.id !== memberId)),
    [],
  );

  function handleSave(values: InviteUserValues) {
    if (dialogState?.mode === "edit" && dialogState.member) {
      setMembers((curr) =>
        curr.map((m) =>
          m.id === dialogState.member!.id ? { ...m, permissions: values.permissions } : m,
        ),
      );
    } else {
      setMembers((curr) => [
        ...curr,
        {
          id: `user_${Date.now()}`,
          name: values.email.split("@")[0],
          email: values.email,
          role: "agent",
          status: "pending",
          lastActive: null,
          permissions: values.permissions,
        },
      ]);
    }
    setDialogState(null);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1>Users & Permissions</h1>
          <p className="text-muted-foreground">
            Manage team access and control who can view and modify settings.
          </p>
        </div>
        <ActionButton
          type="button"
          startIcon={<Plus className="size-4" />}
          className="w-fit"
          onClick={() => setDialogState({ mode: "invite", member: null })}
        >
          Invite User
        </ActionButton>
      </div>

      <div className="flex gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Shield className="size-4" />
        </span>
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Permission Levels</h2>
          <p className="text-sm">
            <span className="font-semibold text-primary">Admins </span>
            <span className="text-muted-foreground">
              have full access to all features including billing, AI
              configuration, and integrations.
            </span>
          </p>
          <p className="text-sm">
            <span className="font-semibold text-primary">Agents </span>
            <span className="text-muted-foreground">
              have custom per-feature access configured by the admin at invite
              time or later.
            </span>
          </p>
        </div>
      </div>

      <UsersSummaryCards counts={counts} />

      <UsersTable
        members={members}
        onEditMember={handleEditMember}
        onDeleteMember={handleDeleteMember}
      />

      <InviteUserDialog
        key={dialogState?.member?.id ?? dialogState?.mode ?? "closed"}
        open={dialogState !== null}
        mode={dialogState?.mode ?? "invite"}
        member={dialogState?.member ?? null}
        onOpenChange={(open) => {
          if (!open) setDialogState(null);
        }}
        onSave={handleSave}
      />
    </section>
  );
}
