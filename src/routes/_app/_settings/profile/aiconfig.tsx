import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/profile/aiconfig")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "AI Configuration | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/profile/components/ai-config/AIConfigPage"), "AIConfigPage"),
});
