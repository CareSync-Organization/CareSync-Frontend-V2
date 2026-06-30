import { api } from "@/lib/api";
import type { AgentPermissions, TeamMember } from "../types/users.types";

type WorkerUserDto = {
    id: string;
    name: string;
    email: string;
    profile_pic: string | null;
};

export type StoreWorkerDto = {
    id: string;
    user: WorkerUserDto | null;
    store: string;
    role: "admin" | "agent";
    permissions: AgentPermissions;
    status: "active" | "pending";
    invited_email: string;
    invited_at: string;
    accepted_at: string | null;
};

export type InvitationDetailsDto = {
    store_name: string;
    invited_email: string;
    inviter_name: string;
    expires_at: string;
};

export function mapWorkerToMember(dto: StoreWorkerDto): TeamMember {
    return {
        id: dto.id,
        name: dto.user?.name ?? dto.invited_email,
        email: dto.user?.email ?? dto.invited_email,
        role: dto.role,
        status: dto.status,
        lastActive: dto.accepted_at
            ? new Date(dto.accepted_at).toLocaleDateString()
            : null,
        permissions: dto.permissions,
    };
}

export async function listTeamMembers(storeId: string) {
    const data = await api<StoreWorkerDto[]>(`/api/stores/${storeId}/team/`);
    return data.map(mapWorkerToMember);
}

export async function inviteTeamMember(
    storeId: string,
    input: { email: string; permissions: AgentPermissions },
) {
    const data = await api<StoreWorkerDto>(`/api/stores/${storeId}/team/invite/`, {
        method: "POST",
        body: JSON.stringify({ email: input.email, permissions: input.permissions }),
    });
    return mapWorkerToMember(data);
}

export async function updateTeamMember(
    storeId: string,
    workerId: string,
    input: { permissions?: AgentPermissions },
) {
    const data = await api<StoreWorkerDto>(
        `/api/stores/${storeId}/team/${workerId}/`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
    return mapWorkerToMember(data);
}

export async function removeTeamMember(storeId: string, workerId: string) {
    return api<void>(`/api/stores/${storeId}/team/${workerId}/`, {
        method: "DELETE",
    });
}

export async function getInvitationDetails(token: string) {
    return api<InvitationDetailsDto>(`/api/auth/invitation/${token}/`);
}

export async function acceptInvitation(token: string) {
    return api<{ detail: string; store: { id: string; name: string } }>(
        "/api/auth/accept-invitation/",
        {
            method: "POST",
            body: JSON.stringify({ token }),
        },
    );
}
