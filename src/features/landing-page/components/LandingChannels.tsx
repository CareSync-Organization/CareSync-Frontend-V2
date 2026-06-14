import { Badge } from "@/components/ui/badge";

const channels = [
  { label: "WhatsApp", className: "bg-whatsapp/10 text-whatsapp" },
  { label: "Shopify", className: "bg-shopify/10 text-shopify" },
  { label: "Daraz", className: "bg-daraz/10 text-daraz" },
  { label: "Facebook", className: "bg-facebook/10 text-facebook" },
  { label: "Instagram", className: "bg-instagram/10 text-instagram" },
  { label: "Email", className: "bg-primary/10 text-primary" },
];

export function LandingChannels() {
  return (
    <section className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold text-foreground">
            Your customer channels, gathered into one flow
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start with the channels you already use, then expand support
            coverage as your store grows.
          </p>
        </div>

        <div className="flex max-w-xl flex-wrap gap-2">
          {channels.map((channel) => (
            <Badge
              key={channel.label}
              variant="secondary"
              className={`h-8 rounded-full px-3 ${channel.className}`}
            >
              {channel.label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
