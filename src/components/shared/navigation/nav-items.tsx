import {
  Book04Icon,
  ChartAnalysisIcon,
  Chat01Icon,
  ContainerTruckIcon,
  DashboardSquare02Icon,
  HelpCircleIcon,
  Link05Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogOut, Users } from "lucide-react";
import type { ReactElement } from "react";

export type NavItem = {
  label: string;
  to: string;
  icon: ReactElement;
  /** Permission module required — agents with "none" level won't see this item */
  permission?: string;
  /** Only visible to store owners / admin role */
  adminOnly?: boolean;
  /** Rendered in the bottom section of the sidebar (below the spacer) */
  bottom?: boolean;
};

export const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare02Icon} size={18} />,
  },
  {
    label: "Conversations",
    to: "/conversations",
    icon: <HugeiconsIcon icon={Chat01Icon} size={18} />,
    permission: "conversations",
  },
  {
    label: "Connectors",
    to: "/connectors",
    icon: <HugeiconsIcon icon={Link05Icon} size={18} />,
    permission: "connectors",
  },
  {
    label: "Knowledge Base",
    to: "/kbase",
    icon: <HugeiconsIcon icon={Book04Icon} size={18} />,
    permission: "knowledgeBase",
  },
  {
    label: "Inventory",
    to: "/inventory",
    icon: <HugeiconsIcon icon={ContainerTruckIcon} size={18} />,
    permission: "inventory",
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: <HugeiconsIcon icon={ChartAnalysisIcon} size={18} />,
    permission: "analytics",
  },
  {
    label: "Users & Permissions",
    to: "/userpermissions",
    icon: <Users size={18} />,
    adminOnly: true,
    bottom: true,
  },
  {
    label: "Help & Support",
    to: "/support",
    icon: <HugeiconsIcon icon={HelpCircleIcon} size={18} />,
    bottom: true,
  },
  {
    label: "Profile",
    to: "/profile/userinfo",
    icon: <HugeiconsIcon icon={UserIcon} size={18} />,
    bottom: true,
  },
];

export const secondaryNavItems = [
  {
    label: "Logout",
    to: "/login",
    icon: <LogOut size={18} />,
  },
];
