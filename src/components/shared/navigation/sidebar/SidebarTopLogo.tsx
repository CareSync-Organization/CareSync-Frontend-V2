import { cn } from "@/lib/utils";
import { CareSyncLogoBadge } from "../../brand/animated-caresync-logo-icon";
import { Link } from "@tanstack/react-router";
import { useTheme } from "next-themes";

type SideBarTopProps = {
  collapsed: boolean;
};

export function SideBarTop({ collapsed }: SideBarTopProps) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="mb-5">
      <Link
        to="/dashboard"
        className="relative flex h-14 items-center rounded-xl no-underline hover:no-underline"
      >
        <div
          className={cn(
            "absolute top-1/2 flex h-12 w-14 -translate-y-1/2 items-center justify-center rounded-xl bg-white/18 transition-all duration-500 ease-in-out",
            collapsed ? "left-1/2 -translate-x-1/2" : "left-0 translate-x-0",
          )}
        >
          <CareSyncLogoBadge
            tone={resolvedTheme === "dark" ? "dark" : "light"}
            size={54}
          />
        </div>

        <span
          className={cn(
            "ml-18 overflow-hidden whitespace-nowrap text-2xl font-semibold text-white transition-all duration-300 ease-in-out",
            collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100",
          )}
        >
          CareSync
        </span>
      </Link>
    </div>
  );
}
