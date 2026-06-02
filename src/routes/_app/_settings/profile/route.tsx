import { appRouteLoadingOptions } from "@/components/shared/route-loading/route-loading-options";
import { ProfileSidebar } from "@/features/profile/components/ProfileSidebar";
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/_settings/profile")({
  ...appRouteLoadingOptions,
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="space-y-6 flex flex-col gap-8">
      <div>
        <h1>Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your business information and account settings
        </p>
      </div>
      <div className="flex gap-4">
        <div className="hidden md:flex">
          <ProfileSidebar />
        </div>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="min-w-0 flex-1 overflow-y-auto px-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
