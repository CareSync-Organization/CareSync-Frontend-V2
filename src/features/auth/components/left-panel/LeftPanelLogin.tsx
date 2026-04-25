import { motion } from "framer-motion";

import { LeftPanelShell } from "./LeftPanelShell";
import { TestimonialCarousel } from "@/features/auth/components/left-panel/TestimonialsCarousel"

const testimonials = [
  {
    quote:
      "Customer Care Hub has revolutionized the way we handle support tickets. The real-time updates and seamless integration have made our team incredibly efficient.",
    name: "Sarah Johnson",
    role: "Support Manager - TechCorp",
  },
  {
    quote:
      "Every morning, our support team opens CareSync first. It gives us the operational clarity we used to chase across five tools.",
    name: "Michael Chen",
    role: "Customer Experience Lead - Northstar",
  },
  {
    quote:
      "The platform feels built for teams that actually live inside support queues. Fast, clean, and deeply useful.",
    name: "Nadia Rehman",
    role: "Head of Support - OrbitDesk",
  },
];

export function LeftPanelLogin() {
  return (
    <LeftPanelShell>
      <div className="mt-28 max-w-xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70"
        >
          Welcome back
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-4 text-4xl font-semibold leading-tight"
        >
          Your support command center is ready.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-4 max-w-md text-base leading-7 text-white/75"
        >
          Pick up conversations, monitor service quality, and keep every
          customer touchpoint moving.
        </motion.p>
      </div>

      <div className="mt-auto pb-14">
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </LeftPanelShell>
  );
}
