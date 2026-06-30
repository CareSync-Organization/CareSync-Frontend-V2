import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SidebarTile } from "@/components/shared/navigation/sidebar/SidebarTile";
import { SideBarCollapseButton } from "@/components/shared/navigation/sidebar/SidebarCollapseBtn";
import { SideBarTop } from "@/components/shared/navigation/sidebar/SidebarTopLogo";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { mainNavItems, secondaryNavItems, type NavItem } from "../nav-items";
import { useLogout } from "@/features/auth/api/auth.queries";
import { useNavigate } from "@tanstack/react-router";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useMyPermissions } from "@/features/stores/api/permissions.queries";
import type { StorePermissionsDto } from "@/features/stores/api/permissions.api";

const LEVEL_ORDER: Record<string, number> = { none: 0, read: 1, write: 2 };

function canViewItem(item: NavItem, perms: StorePermissionsDto | undefined): boolean {
  if (!perms) return true; // loading or no store: show everything
  if (item.adminOnly) return perms.role === "admin";
  if (item.permission) {
    const level = perms.permissions[item.permission] ?? "none";
    return LEVEL_ORDER[level] >= LEVEL_ORDER["read"];
  }
  return true;
}

export function Sidebar() {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);
  const { data: perms } = useMyPermissions(activeStoreId);

  const topItems = mainNavItems.filter((item) => !item.bottom && canViewItem(item, perms));
  const bottomItems = mainNavItems.filter((item) => item.bottom && canViewItem(item, perms));

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
        {topItems.map((item) => (
          <SidebarTile
            key={item.to}
            collapsed={collapsed}
            icon={item.icon}
            tileText={item.label}
            tileLink={item.to}
          />
        ))}

        <div className="grow" />

        {bottomItems.map((item) => (
          <SidebarTile
            key={item.to}
            collapsed={collapsed}
            icon={item.icon}
            tileText={item.label}
            tileLink={item.to}
          />
        ))}
        <div className="h-px bg-white/20" />
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
