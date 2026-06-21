import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SidebarTile } from "@/components/shared/navigation/sidebar/SidebarTile";
import { SideBarCollapseButton } from "@/components/shared/navigation/sidebar/SidebarCollapseBtn";
import { SideBarTop } from "@/components/shared/navigation/sidebar/SidebarTopLogo";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { mainNavItems, secondaryNavItems } from "../nav-items";
import { useLogout } from "@/features/auth/api/auth.queries";
import { useNavigate } from "@tanstack/react-router";

export function Sidebar() {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const mainItemsAboveGrow = mainNavItems.slice(0, 6);
  const mainItemsAfterGrow = mainNavItems.slice(6);

  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await navigate({ to: "/login" });
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={cn(
        "relative bg-primary h-screen shrink-0 flex flex-col py-4 transition-all duration-500",
        collapsed ? "w-20 px-2" : "w-72 px-4",
      )}
    >
      <SideBarCollapseButton collapsed={collapsed} onClick={toggleCollapsed} />
      <SideBarTop collapsed={collapsed} />
      <motion.nav
        className="mt-4 flex flex-col gap-4 flex-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.06,
              delayChildren: 0.08,
            },
          },
        }}
      >
        {mainItemsAboveGrow.map((item) => (
          <SidebarTile
            key={item.to}
            collapsed={collapsed}
            icon={item.icon}
            tileText={item.label}
            tileLink={item.to}
          />
        ))}

        <div className="grow"></div>

        {mainItemsAfterGrow.map((item) => (
          <SidebarTile
            key={item.to}
            collapsed={collapsed}
            icon={item.icon}
            tileText={item.label}
            tileLink={item.to}
          />
        ))}
        <div className="h-px bg-white/20" />
        {/* logout should call a function that would clear the auth state or query cache or whatever and then navigate to /login */}
        {secondaryNavItems.map((item) => (
          <SidebarTile
            key={item.to}
            collapsed={collapsed}
            icon={item.icon}
            tileText={item.label}
            tileLink={item.to}
            onClick={item.label === "Logout" ? handleLogout : undefined}
            isLoading={item.label === "Logout" ? logoutMutation.isPending : undefined}
          />
        ))}
      </motion.nav>
    </aside>
  );
}
