import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/profile/billing")({
  ...appRouteLoadingOptions,
  head: () => ({ meta: [{ title: "Billing & Payments | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/profile/components/billing-payment/BillingPage"), "BillingPage"),
});
