import { Navbar } from "@/components/shared/navigation/navbar/Navbar";
import { Sidebar } from "@/components/shared/navigation/sidebar/Sidebar";
import {
  createFileRoute,
  Outlet,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { queryKeys } from "@/lib/query-keys";
import { getMe } from "@/features/auth/api/auth.api";
import { mapUserDto } from "@/features/auth/api/auth.mapper";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => mapUserDto(await getMe()),
      });
    } catch (error) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const topSegment = pathname.split("/")[1];


  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <motion.main
          key={topSegment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="min-w-0 flex-1 overflow-y-auto px-6 py-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
