import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/analytics")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Analytics | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/analytics/components/AnalyticsPage"), "AnalyticsPage"),
});
