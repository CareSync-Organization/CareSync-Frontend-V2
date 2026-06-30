import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getAnalytics, type AnalyticsRange } from "./analytics.api";
import { mapAnalyticsSnapshot } from "./analytics.mapper";

export function useAnalytics(storeId: string | null, range: AnalyticsRange) {
    return useQuery({
        queryKey: queryKeys.analytics.snapshot(storeId ?? "", range),
        queryFn: () => getAnalytics(storeId!, range).then(mapAnalyticsSnapshot),
        enabled: Boolean(storeId),
        staleTime: 0,
    });
}
