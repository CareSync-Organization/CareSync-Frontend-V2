import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getDashboard } from "./dashboard.api";
import { mapDashboardSnapshot } from "./dashboard.mapper";

export function useDashboard(storeId: string | null) {
    return useQuery({
        queryKey: queryKeys.dashboard.snapshot(storeId ?? ""),
        queryFn: () => getDashboard(storeId!).then(mapDashboardSnapshot),
        enabled: Boolean(storeId),
        staleTime: 0,
    });
}
