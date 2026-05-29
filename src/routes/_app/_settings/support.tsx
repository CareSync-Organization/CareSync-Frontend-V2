import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/support")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Support | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/support/components/SupportPage"), "SupportPage"),
});
