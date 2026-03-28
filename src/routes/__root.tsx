import * as React from "react";
import { Outlet, createRootRoute, HeadContent } from "@tanstack/react-router";

import { NotFoundPage } from "@/components/shared/not-found/NotFoundPage";
import { ErrorPage } from "@/components/shared/error-page/ErrorPage";

export const Route = createRootRoute({
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
