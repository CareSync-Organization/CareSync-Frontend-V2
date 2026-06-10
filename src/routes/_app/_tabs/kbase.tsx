import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { knowledgeDocsQueryOptions } from "@/features/knowledge-base/api/knowledge-base.queries";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

export const Route = createFileRoute("/_app/_tabs/kbase")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Knowledge Base | CareSync" }] }),
  loader: async ({ context }) => {
    const storeId = useActiveStoreStore.getState().activeStoreId;
    if (!storeId) return;

    return context.queryClient.ensureQueryData(
      knowledgeDocsQueryOptions(storeId),
    );
  },
  component: lazyRouteComponent(
    () => import("@/features/knowledge-base/components/KnowledgeBasePage"),
    "KnowledgeBasePage",
  ),
});
