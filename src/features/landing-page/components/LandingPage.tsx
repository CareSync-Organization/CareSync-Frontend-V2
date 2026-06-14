import { LandingChannels } from "./LandingChannels";
import { LandingFeatureGrid } from "./LandingFeatureGrid";
import { LandingFinalCta } from "./LandingFinalCta";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";
import { LandingNav } from "./LandingNav";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <LandingHero />
      <LandingFeatureGrid />
      <LandingChannels />
      <LandingFinalCta />
      <LandingFooter />
    </main>
  );
}
