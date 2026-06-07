import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/profile/privacy")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Privacy & Security | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/profile/components/privacy-security/PrivacyPage"), "PrivacyPage"),
});
