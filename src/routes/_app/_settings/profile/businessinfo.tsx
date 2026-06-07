import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/profile/businessinfo")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Business Info | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/profile/components/business-info/BusinessInfoPage"), "BusinessInfoPage"),
});
