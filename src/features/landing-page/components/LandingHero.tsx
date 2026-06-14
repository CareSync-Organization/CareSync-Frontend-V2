import { ArrowRight, Bot, MessageSquareText, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { LandingProductMock } from "./LandingProductMock";

const proofPoints = [
  { icon: MessageSquareText, label: "Unified inbox" },
  { icon: Bot, label: "AI-assisted replies" },
  { icon: ShieldCheck, label: "Human takeover ready" },
];

export function LandingHero() {
  return (
    <section className="overflow-hidden border-b bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-5 h-7 rounded-full px-3">
            Built for Shopify, Daraz, WhatsApp, social, and email support
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            CareSync
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Bring ecommerce conversations, knowledge documents, inventory
            context, and AI automation into one support workspace your team can
            actually run every day.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11">
              <Link to="/signup">
                Start free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11">
              <Link to="/login">Log in</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {proofPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.label}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <Icon className="size-4 text-primary" />
                  <span>{point.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <LandingProductMock />
      </div>
    </section>
  );
}
