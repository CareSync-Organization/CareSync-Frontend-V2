import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/tickets/$ticketId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/dashboard",
      search: { ticket: params.ticketId },
      replace: true,
    });
  },
});
