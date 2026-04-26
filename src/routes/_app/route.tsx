import { Navbar } from "@/components/shared/navigation/navbar/Navbar";
import { Sidebar } from "@/components/shared/navigation/sidebar/Sidebar";
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app")({
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
