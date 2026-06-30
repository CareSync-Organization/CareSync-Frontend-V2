import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPassPage } from "@/features/auth/components/pages/ResetPassPage";

const searchSchema = z.object({
  token: z.string().min(1),
});

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password | CareSync" }],
  }),
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return <ResetPassPage token={token} />;
}
