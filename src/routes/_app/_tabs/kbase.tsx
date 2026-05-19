import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/kbase")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Knowledge Base | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/knowledge-base/components/KnowledgeBasePage"), "KnowledgeBasePage"),
});
