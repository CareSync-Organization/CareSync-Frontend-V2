import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_settings/profile/")({
  beforeLoad: () => {
    throw redirect({ to: "/profile/userinfo", replace: true });
  },
});
