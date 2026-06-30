import { z } from "zod";
import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  ...appRouteLoadingOptions,
  validateSearch: z.object({ ticket: z.string().optional() }),
  head: () => ({
    meta: [{ title: "Dashboard | CareSync" }],
  }),
  component: lazyRouteComponent(() => import("@/features/dashboard/components/DashboardPage"), "DashboardPage"),
});
