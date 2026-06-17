import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

type SidebarTileProps = {
  tileText: string;
  tileLink: string;
  icon: React.ReactNode;
  collapsed?: boolean;
  styles?: string;
  activePropsStyles?: string;
  inactivePropsStyles?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isLoading?: boolean;
};

export function SidebarTile({
  tileText,
  tileLink,
  icon,
  collapsed,
  styles,
  activePropsStyles,
  inactivePropsStyles,
  onClick,
  isLoading,
}: SidebarTileProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -12 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Link
        to={tileLink}
        onClick={onClick}
        className={cn(
          styles,
          "relative flex h-10 items-center rounded-xl text-sm no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:no-underline",
        )}
        activeProps={{
          className: activePropsStyles ?? "bg-white/18 text-white -translate-y-1 shadow-lg",
        }}
        inactiveProps={{
          className: inactivePropsStyles ?? "text-white/80 hover:bg-white/12 hover:text-white",
        }}
      >
        <span
          className={cn(
            "absolute top-1/2 flex shrink-0 -translate-y-1/2 items-center justify-center transition-all duration-500 ease-in-out",
            collapsed ? "left-1/2 -translate-x-1/2" : "left-3 translate-x-0",
          )}
        >
          {isLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            icon
          )}
        </span>

        <span
          className={cn(
            "ml-10 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
            collapsed ? "max-w-0 opacity-0" : "max-w-48 opacity-100",
          )}
        >
          {tileText}
        </span>
      </Link>
    </motion.div>
  );
}
