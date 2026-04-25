import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassPage } from "@/features/auth/components/pages/ForgotPassPage";

export const Route = createFileRoute("/_auth/forget-password")({
  head: () => ({
    meta: [{title : "Forgot Password | CareSync"}]
  }),
  component: ForgotPassPage,
});
