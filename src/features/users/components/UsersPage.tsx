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

function UsersSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
                        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                        <div className="h-8 w-10 rounded bg-muted animate-pulse" />
                    </div>
                ))}
            </div>
            <div className="rounded-xl border-2 bg-card shadow-sm">
                <div className="border-b px-4 py-4">
                    <div className="h-5 w-32 rounded bg-muted animate-pulse" />
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_160px_160px_auto]">
                        <div className="h-11 rounded-xl bg-muted animate-pulse" />
                        <div className="h-11 rounded-xl bg-muted animate-pulse" />
                        <div className="h-11 rounded-xl bg-muted animate-pulse" />
                        <div className="h-11 w-24 rounded-xl bg-muted animate-pulse" />
                    </div>
                    <div className="overflow-hidden rounded-xl border">
                        <div className="flex gap-6 border-b bg-muted/40 px-4 py-3">
                            {[32, 20, 20, 24, 20].map((w, i) => (
                                <div key={i} className={`h-4 w-${w} rounded bg-muted animate-pulse`} />
                            ))}
                        </div>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-6 border-b px-4 py-3 last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-muted animate-pulse" />
                                    <div className="space-y-1.5">
                                        <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                                        <div className="h-3 w-36 rounded bg-muted animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
                                <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="size-8 rounded-lg bg-muted animate-pulse" />
                                    <div className="size-8 rounded-lg bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

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

            {isLoading ? (
                <UsersSkeleton />
            ) : (
                <>
                    <UsersSummaryCards counts={counts} />
                    <UsersTable
                        members={members}
                        onEditMember={handleEditMember}
                        onDeleteMember={handleDeleteMember}
                    />
                </>
            )}

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
