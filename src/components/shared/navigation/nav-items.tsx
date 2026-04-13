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

export const mainNavItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare02Icon} size={18} />,
  },
  {
    label: "Conversations",
    to: "/conversations",
    icon: <HugeiconsIcon icon={Chat01Icon} size={18} />,
  },
  {
    label: "Stores and Connectors",
    to: "/connectors",
    icon: <HugeiconsIcon icon={Link05Icon} size={18} />,
  },
  {
    label: "Knowledge Base",
    to: "/kbase",
    icon: <HugeiconsIcon icon={Book04Icon} size={18} />,
  },
  {
    label: "Inventory",
    to: "/inventory",
    icon: <HugeiconsIcon icon={ContainerTruckIcon} size={18} />,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: <HugeiconsIcon icon={ChartAnalysisIcon} size={18} />,
  },
  {
    label: "Users & Permissions",
    to: "/userpermissions",
    icon: <Users size={18} />,
  },
  {
    label: "Help & Support",
    to: "/support",
    icon: <HugeiconsIcon icon={HelpCircleIcon} size={18} />,
  },
  {
    label: "Profile",
    to: "/profile/businessinfo",
    icon: <HugeiconsIcon icon={UserIcon} size={18} />,
  },
];

export const secondaryNavItems = [
  {
    label: "Logout",
    to: "/login",
    icon: <LogOut size={18} />,
  },
];
