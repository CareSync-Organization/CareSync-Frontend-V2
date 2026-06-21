import { Link } from "@tanstack/react-router";

import { ThemeModeToggle } from "@/components/shared/ThemeModeToggle";
import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-foreground no-underline hover:no-underline"
        >
          <CareSyncLogoBadge
            tone={"light"}
            size={44}
            className="bg-[#35928f] dark:bg-[#282828]"
          />
          <div className="leading-none">
            <p className="text-base font-semibold text-foreground">CareSync</p>
            <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
              Centralized Customer Care Platform
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeModeToggle className="size-9" />
          <Button asChild variant="ghost" className="hidden h-9 sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="h-9">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
