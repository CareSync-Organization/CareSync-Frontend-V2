import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon";
import { ActionButton } from "@/components/shared/ActionButton";

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        className="flex flex-col items-center gap-6 text-center max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CareSyncLogoBadge size={64} className="bg-linear-to-b from-[#0F766E] to-[#14B8A6]" tone="light"/>

        <div>
          <p className="text-8xl font-bold text-primary/15 leading-none select-none">
            404
          </p>
          <h1 className="text-2xl font-semibold mt-2">Page not found</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link to="/dashboard">
          <ActionButton>Back to Dashboard</ActionButton>
        </Link>
      </motion.div>
    </main>
  );
}
