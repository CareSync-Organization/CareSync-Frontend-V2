import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";


type SideBarCollapseButtonProps = {
  collapsed: boolean;
  onClick: () => void;
  className?: string;
};

export function SideBarCollapseButton({
  collapsed,
  onClick,
  className,
}: SideBarCollapseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "absolute -right-5 top-15 z-20 grid h-10 w-10 place-items-center",
        "rounded-full border-3 border-primary bg-card text-primary shadow-md",
        "transition-transform duration-200 hover:scale-[1.03] active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
    >
      <ChevronLeft
        className={cn(
          "h-5 w-5 transition-transform duration-400",
          collapsed && "rotate-180",
        )}
        strokeWidth={2.25}
      />
    </button>
  );
}
