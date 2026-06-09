import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { inventoryItemsQueryOptions } from "@/features/inventory/api/inventory.queries";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/inventory")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Inventory | CareSync" }] }),
  loader: async ({ context }) => {
    const storeId = useActiveStoreStore.getState().activeStoreId;
    if (!storeId) return;

    return context.queryClient.ensureQueryData(inventoryItemsQueryOptions(storeId))
  },
  component: lazyRouteComponent(() => import("@/features/inventory/components/InventoryPage"), "InventoryPage"),
});
