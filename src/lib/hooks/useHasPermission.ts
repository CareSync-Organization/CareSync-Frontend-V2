import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useMyPermissions } from "@/features/stores/api/permissions.queries";
import { hasPermission, type PermissionLevel } from "@/features/stores/api/permissions.api";

/**
 * Returns true if the current user has at least `minLevel` permission for the given module.
 * Defaults to true while permissions are loading (graceful fallback).
 */
export function useHasPermission(
    module: string,
    minLevel: PermissionLevel = "read",
): boolean {
    const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
    const { data: perms } = useMyPermissions(activeStoreId);
    return hasPermission(perms, module, minLevel);
}
