import { z } from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { LandingPage } from "@/features/landing-page/components/LandingPage";
import { getMe } from "@/features/auth/api/auth.api";
import { queryKeys } from "@/lib/query-keys";
import { mapUserDto } from "@/features/auth/api/auth.mapper";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "CareSync | AI Customer Support for Ecommerce" }],
  }),
  validateSearch: z.object({
    social_auth: z.enum(["success", "error"]).optional(),
  }),
  beforeLoad: async ({ context, search }) => {
    if (search.social_auth === "success") {
      throw redirect({ to: "/dashboard" });
    }
    if (search.social_auth === "error") {
      throw redirect({ to: "/login", search: { social_auth_failed: "1" } });
    }
    let isAuthenticated = false;
    try {
      await context.queryClient.ensureQueryData({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => mapUserDto(await getMe()),
      });
      isAuthenticated = true;
    } catch {
      // Not authenticated — show landing page
    }
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <LandingPage />;
}
