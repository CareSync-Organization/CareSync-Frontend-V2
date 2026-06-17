import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

// const LOADING_PREVIEW_DELAY_MS = 2400;

export const Route = createFileRoute("/_app/dashboard")({
  ...appRouteLoadingOptions,
  head: () => ({
    meta: [{ title: "Dashboard | CareSync" }],
  }),
  // beforeLoad: async () => {
  //   await new Promise((resolve) => setTimeout(resolve, LOADING_PREVIEW_DELAY_MS));
  // },
  component: lazyRouteComponent(() => import("@/features/dashboard/components/DashboardPage"), "DashboardPage"),
});
