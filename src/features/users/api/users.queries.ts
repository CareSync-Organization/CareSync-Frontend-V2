import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import type { AgentPermissions, TeamMember } from "../types/users.types";
import {
    acceptInvitation,
    getInvitationDetails,
    inviteTeamMember,
    listTeamMembers,
    removeTeamMember,
    updateTeamMember,
} from "./users.api";

export function useTeamMembers(storeId: string | null) {
    return useQuery({
        queryKey: queryKeys.team.list(storeId ?? ""),
        queryFn: () => listTeamMembers(storeId!),
        enabled: Boolean(storeId),
    });
}

export function useInviteTeamMember(storeId: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: { email: string; permissions: AgentPermissions }) =>
            inviteTeamMember(storeId!, input),
        onSuccess: (newMember) => {
            queryClient.setQueryData(
                queryKeys.team.list(storeId!),
                (old: TeamMember[] | undefined) => (old ? [...old, newMember] : [newMember]),
            );
            toast.success("Invitation sent");
        },
        onError: () => {
            toast.error("Failed to send invitation");
        },
    });
}

export function useUpdateTeamMember(storeId: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ workerId, permissions }: { workerId: string; permissions: AgentPermissions }) =>
            updateTeamMember(storeId!, workerId, { permissions }),
        onSuccess: (updated) => {
            queryClient.setQueryData(
                queryKeys.team.list(storeId!),
                (old: TeamMember[] | undefined) =>
                    old?.map((m) => (m.id === updated.id ? updated : m)),
            );
            toast.success("Permissions updated");
        },
        onError: () => {
            toast.error("Failed to update permissions");
        },
    });
}

export function useRemoveTeamMember(storeId: string | null) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (workerId: string) => removeTeamMember(storeId!, workerId),
        onSuccess: (_data, workerId) => {
            queryClient.setQueryData(
                queryKeys.team.list(storeId!),
                (old: TeamMember[] | undefined) => old?.filter((m) => m.id !== workerId),
            );
            toast.success("Team member removed");
        },
        onError: () => {
            toast.error("Failed to remove team member");
        },
    });
}

export function useInvitationDetails(token: string) {
    return useQuery({
        queryKey: queryKeys.team.invitation(token),
        queryFn: () => getInvitationDetails(token),
        retry: false,
    });
}

export function useAcceptInvitation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: acceptInvitation,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.stores.list() });
            useActiveStoreStore.getState().setActiveStoreId(data.store.id);
        },
    });
}
