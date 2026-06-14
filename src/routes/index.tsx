import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/features/landing-page/components/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "CareSync | AI Customer Support for Ecommerce" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <LandingPage />;
}
