import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/userpermissions")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "User Permissions | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/users/components/UsersPage"), "UsersPage"),
});
