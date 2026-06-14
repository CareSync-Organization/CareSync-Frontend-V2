import { Link } from "@tanstack/react-router";

import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <CareSyncLogoBadge
            tone={"light"}
            size={44}
            className="bg-primary dark:bg-[#282828]"
          />
          <p className="text-sm text-muted-foreground">
            CareSync centralizes ecommerce customer support.
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}
