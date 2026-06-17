import * as React from "react";
import { Outlet, createRootRouteWithContext, HeadContent } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { NotFoundPage } from "@/components/shared/not-found/NotFoundPage";
import { ErrorPage } from "@/components/shared/error-page/ErrorPage";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;}>()({
    component: RootComponent,
    notFoundComponent: NotFoundPage,
    errorComponent: ErrorPage,
  });

function RootComponent() {
  return (
    <React.Fragment>
      <HeadContent />
      <Outlet />
    </React.Fragment>
  );
}
