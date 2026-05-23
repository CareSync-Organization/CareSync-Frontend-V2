import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/inventory")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Inventory | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/inventory/components/InventoryPage"), "InventoryPage"),
});
