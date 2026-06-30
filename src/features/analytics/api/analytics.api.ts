import { api } from "@/lib/api";
import type { AnalyticsSnapshotDTO } from "../types/analytics.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type AnalyticsRange = {
    start: string;
    end: string;
    granularity: string;
};

export function getAnalytics(storeId: string, range: AnalyticsRange): Promise<AnalyticsSnapshotDTO> {
    const params = new URLSearchParams({
        start: range.start,
        end: range.end,
        granularity: range.granularity,
    });
    return api<AnalyticsSnapshotDTO>(`/api/stores/${storeId}/analytics/?${params}`);
}

export async function downloadAnalyticsExport(storeId: string, range: AnalyticsRange): Promise<void> {
    const params = new URLSearchParams({
        start: range.start,
        end: range.end,
        granularity: range.granularity,
    });
    const response = await fetch(
        `${API_BASE_URL}/api/stores/${storeId}/analytics/export/?${params}`,
        { credentials: "include" },
    );
    if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
    }
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = /filename="([^"]+)"/.exec(disposition);
    const filename = match?.[1] ?? `caresync-analytics-${storeId}-${range.start}-${range.end}.csv`;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
