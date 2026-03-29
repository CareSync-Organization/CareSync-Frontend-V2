import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";
import { ActionButton } from "@/components/shared/ActionButton";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        className="flex flex-col items-center gap-6 text-center max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CareSyncLogoBadge
          size={64}
          className="bg-linear-to-b from-[#0F766E] to-[#14B8A6]"
          tone="light"
        />
        <div className="grid place-items-center size-14 rounded-full bg-destructive/10 mx-auto">
          <AlertTriangle className="size-6 text-destructive" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            An unexpected error occurred. Try refreshing the page or going back
            to the dashboard.
          </p>
          {import.meta.env.DEV && (
            <p className="mt-3 text-xs text-muted-foreground/70 font-mono bg-muted px-3 py-2 rounded-md text-left break-all">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <ActionButton variant="outline" onClick={reset}>
            Try again
          </ActionButton>
          <ActionButton onClick={() => router.navigate({ to: "/dashboard" })}>
            Back to Dashboard
          </ActionButton>
        </div>
      </motion.div>
    </main>
  );
}
