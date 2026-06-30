import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/features/auth/components/pages/SignUpPage";

export const Route = createFileRoute("/_auth/signup")({
  head: () => ({ meta: [{ title: "SignUp | CareSync" }] }),
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();
  return <SignUpPage redirectTo={redirect} />;
}
