import type { ReactNode } from "react";

import { AuthLogoThemeToggle } from "@/features/auth/components/left-panel/AuthLogoThemeToggle";

type LeftPanelShellProps = {
  children: ReactNode;
  backgroundImage?: string;
};

export function LeftPanelShell({
  children,
  backgroundImage = "/auth/Office-background.png",
}: LeftPanelShellProps) {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-primary text-white lg:flex lg:w-full">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-95"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />
      <div className="absolute inset-0 bg-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(135deg,rgba(0,192,232,0.18),transparent_42%)]" />

      <div className="relative z-10 flex min-h-screen w-full flex-col px-14 py-12">
        <AuthLogoThemeToggle />

        {children}

        <p className="mt-auto text-xs text-white/65">
          © 2026 CareSync. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
