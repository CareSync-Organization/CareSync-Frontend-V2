import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { LeftPanelShell } from "./LeftPanelShell";
import { TestimonialCarousel } from "@/features/auth/components/left-panel/TestimonialsCarousel";

const benefits = [
  "Centralized ticket management",
  "Real-time collaboration tools",
  "Advanced analytics & reporting",
  "Agentic RAG customer support agents",
];

const testimonials = [
  {
    quote:
      "Signing up was the best decision for our support team. We've streamlined every process and our customers are happier than ever.",
    name: "David Martinez",
    role: "CEO - GrowthCompany",
  },
  {
    quote:
      "CareSync gave our team one calm place to manage support, insights, and customer context without switching tools all day.",
    name: "Sarah Johnson",
    role: "Support Manager - TechCorp",
  },
  {
    quote:
      "The speed difference was immediate. Our agents respond faster, and leadership finally has clean visibility.",
    name: "Ayesha Khan",
    role: "Operations Lead - NovaDesk",
  },
];

export function LeftPanelSignUp() {
  return (
    <LeftPanelShell>
      <div className="mt-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-white/70"
        >
          Why teams choose us
        </motion.p>

        <div className="grid gap-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex items-center gap-3 text-sm text-white/90"
            >
              <span className="grid size-6 place-items-center rounded-full border border-white/25 bg-white/10">
                <Check className="size-3.5" />
              </span>
              {benefit}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-auto pb-14">
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </LeftPanelShell>
  );
}
