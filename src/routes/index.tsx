import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{title: "CareSync"}]
  }) ,
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
