import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/connectors")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Connectors | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/connectors/components/ConnectorsPage"), "ConnectorsPage"),
});
