import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/components/pages/LoginPage";

export const Route = createFileRoute("/_auth/login")({
  head: () => ({ meta: [{ title: "Login | CareSync" }] }),
  validateSearch: z.object({
    redirect: z.string().optional(),
    social_auth_failed: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect, social_auth_failed } = Route.useSearch();
  return <LoginPage redirectTo={redirect} socialAuthFailed={!!social_auth_failed} />;
}
