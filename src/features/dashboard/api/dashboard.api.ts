import { api } from "@/lib/api";
import type { DashboardSnapshotDTO } from "../types/dashboard.types";

export function getDashboard(storeId: string): Promise<DashboardSnapshotDTO> {
    return api<DashboardSnapshotDTO>(`/api/stores/${storeId}/dashboard/`);
}
