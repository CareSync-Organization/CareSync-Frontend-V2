import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export function LandingFinalCta() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-b from-[#0F766E] to-[#14B8A6] p-8 text-primary-foreground shadow-xl shadow-primary/20 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-white">
                Give your support team one place to work.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Launch CareSync with your first store, upload knowledge
                documents, and start shaping AI-assisted support around your
                real ecommerce workflows.
              </p>
            </div>
            <Button asChild variant="secondary" className="h-11 w-fit">
              <Link to="/signup">
                Create account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
