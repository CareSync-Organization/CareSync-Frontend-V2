import { api } from "@/lib/api";

export type PermissionLevel = "none" | "read" | "write";

export type StorePermissionsDto = {
    role: "admin" | "agent";
    permissions: Record<string, PermissionLevel>;
};

export function getMyPermissions(storeId: string) {
    return api<StorePermissionsDto>(`/api/stores/${storeId}/my-permissions/`);
}

export const LEVEL_ORDER: Record<PermissionLevel, number> = {
    none: 0,
    read: 1,
    write: 2,
};

export function hasPermission(
    perms: StorePermissionsDto | undefined,
    module: string,
    minLevel: PermissionLevel = "read",
): boolean {
    if (!perms) return true; // loading/unavailable: assume access
    if (perms.role === "admin") return true;
    const level = (perms.permissions[module] ?? "none") as PermissionLevel;
    return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel];
}
