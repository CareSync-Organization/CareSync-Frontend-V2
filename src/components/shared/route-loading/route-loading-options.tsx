import { RouteLoadingScreen } from "@/components/shared/route-loading/RouteLoadingScreen";

export const appRouteLoadingOptions = {
  pendingComponent: RouteLoadingScreen,
  pendingMs: 0,
  pendingMinMs: 1200,
} as const;
