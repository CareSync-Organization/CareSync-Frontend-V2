import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/components/pages/LoginPage"

export const Route = createFileRoute("/_auth/login")({
  head: () => ({
    meta: [{title: "Login | CareSync"}]
  })  ,
  component: RouteComponent,
});

function RouteComponent() {
  return <div>
    <LoginPage />
  </div>;
}
