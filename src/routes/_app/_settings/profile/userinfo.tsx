import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/profile/userinfo")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "User Info | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/profile/components/user-info/UserInfoPage"), "UserInfoPage"),
});
