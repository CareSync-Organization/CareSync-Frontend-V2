import { z } from "zod";
import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_tabs/conversations")({
  ...appRouteLoadingOptions,
  validateSearch: z.object({
    c: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Conversations | CareSync" }] }),
  component: lazyRouteComponent(() => import("@/features/conversation/components/ConversationPage"), "ConversationPage"),
});
