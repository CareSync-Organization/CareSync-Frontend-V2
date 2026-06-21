import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { storeConnectorsQueryOptions } from "@/features/connectors/api/connectors.queries";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/connectors")({
  ...appRouteLoadingOptions,
  loader: ({ context }) => {
    const storeId = useActiveStoreStore.getState().activeStoreId
    if (!storeId) return;
    return context.queryClient.ensureQueryData(
      storeConnectorsQueryOptions(storeId)
    )
  },
  head: () => ({ meta: [{ title: "Connectors | CareSync" }] }),
  component: lazyRouteComponent(
    () => import("@/features/connectors/components/ConnectorsPage"),
    "ConnectorsPage",
  ),
});
