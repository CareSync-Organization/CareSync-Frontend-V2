import { useCallback, useMemo, useState } from "react";
import { Plus, Shield } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

import type { InviteUserValues } from "../schemas/invite-user.schema";
import type { TeamMember } from "../types/users.types";
import {
    useInviteTeamMember,
    useRemoveTeamMember,
    useTeamMembers,
    useUpdateTeamMember,
} from "../api/users.queries";
import { InviteUserDialog } from "./InviteUserDialog";
import { UsersSummaryCards } from "./UsersSummaryCards";
import { UsersTable } from "./UsersTable";

type DialogState = {
    mode: "invite" | "edit";
    member: TeamMember | null;
} | null;

export function UsersPage() {
    const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
    const [dialogState, setDialogState] = useState<DialogState>(null);

    const { data: members = [], isLoading, isError, refetch } = useTeamMembers(activeStoreId);
    const inviteMutation = useInviteTeamMember(activeStoreId);
    const updateMutation = useUpdateTeamMember(activeStoreId);
    const removeMutation = useRemoveTeamMember(activeStoreId);

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
        (memberId: string) => {
            if (!activeStoreId) return;
            removeMutation.mutate(memberId);
        },
        [activeStoreId, removeMutation],
    );

    async function handleSave(values: InviteUserValues) {
        if (!activeStoreId) return;
        try {
            if (dialogState?.mode === "edit" && dialogState.member) {
                await updateMutation.mutateAsync({
                    workerId: dialogState.member.id,
                    permissions: values.permissions,
                });
            } else {
                await inviteMutation.mutateAsync({
                    email: values.email,
                    permissions: values.permissions,
                });
            }
            setDialogState(null);
        } catch {
            // toast shown by mutation onError
        }
    }

    if (!activeStoreId) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <h2 className="text-base font-semibold">No active store selected</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Select a store to manage your team.
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <h2 className="text-base font-semibold">Failed to load team</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Something went wrong while fetching your team members.
                </p>
                <ActionButton
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => refetch()}
                >
                    Retry
                </ActionButton>
            </div>
        );
    }

    const isSubmitting = inviteMutation.isPending || updateMutation.isPending;

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
                isLoading={isLoading}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
            />

            <InviteUserDialog
                key={dialogState?.member?.id ?? dialogState?.mode ?? "closed"}
                open={dialogState !== null}
                mode={dialogState?.mode ?? "invite"}
                member={dialogState?.member ?? null}
                isSubmitting={isSubmitting}
                onOpenChange={(open) => {
                    if (!open) setDialogState(null);
                }}
                onSave={handleSave}
            />
        </section>
    );
}
