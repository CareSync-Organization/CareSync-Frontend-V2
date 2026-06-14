import {
  Bot,
  Boxes,
  FileSearch,
  MessageSquareMore,
  RefreshCw,
  UserRoundCheck,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareMore,
    title: "One inbox for every channel",
    description:
      "Track customer conversations from marketplace, social, chat, and email channels without switching tools.",
  },
  {
    icon: Bot,
    title: "AI replies with business context",
    description:
      "Ground responses in your knowledge base, policies, orders, and inventory instead of generic chatbot guesses.",
  },
  {
    icon: UserRoundCheck,
    title: "Human takeover when it matters",
    description:
      "Agents can review, edit, and take over sensitive conversations while automation handles routine questions.",
  },
  {
    icon: FileSearch,
    title: "Knowledge base training",
    description:
      "Upload policies, FAQs, product sheets, and troubleshooting guides so the assistant learns your store.",
  },
  {
    icon: Boxes,
    title: "Inventory-aware support",
    description:
      "Keep answers tied to stock and product context across manual and synced ecommerce inventory sources.",
  },
  {
    icon: RefreshCw,
    title: "Connector-ready workflows",
    description:
      "Designed for Shopify, Daraz, WhatsApp, Facebook, Instagram, and email workflows as integrations mature.",
  },
];

export function LandingFeatureGrid() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-foreground">
            Built around the daily support loop
          </h2>
          <p className="mt-3 text-muted-foreground">
            CareSync keeps the operating pieces close together: channels,
            answers, documents, inventory, and agent control.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
