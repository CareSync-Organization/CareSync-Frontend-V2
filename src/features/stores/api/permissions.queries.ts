import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getMyPermissions } from "./permissions.api";

export function useMyPermissions(storeId: string | null) {
    return useQuery({
        queryKey: queryKeys.permissions.my(storeId ?? ""),
        queryFn: () => getMyPermissions(storeId!),
        enabled: Boolean(storeId),
        staleTime: 1000 * 60 * 5,
        placeholderData: keepPreviousData,
    });
}
