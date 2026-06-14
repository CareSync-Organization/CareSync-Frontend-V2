import {
  Bot,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  PackageCheck,
  Send,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const conversations = [
  {
    channel: "WhatsApp",
    customer: "Ayesha Khan",
    message: "Can I exchange the medium hoodie?",
    status: "AI draft ready",
    color: "text-whatsapp",
  },
  {
    channel: "Shopify",
    customer: "Hamza Store",
    message: "Order #1482 delivery status",
    status: "Auto resolved",
    color: "text-shopify",
  },
  {
    channel: "Daraz",
    customer: "Sara Malik",
    message: "Is this item still in stock?",
    status: "Needs review",
    color: "text-daraz",
  },
];

const metrics = [
  { label: "AI handled", value: "74%", icon: Bot },
  { label: "Resolution", value: "92%", icon: CheckCircle2 },
  { label: "Response", value: "1.8m", icon: Clock3 },
];

export function LandingProductMock() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="rounded-2xl border bg-card p-3 shadow-2xl shadow-primary/10">
        <div className="rounded-xl border bg-background">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <MessageSquareText className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Support command center
                </p>
                <p className="text-xs text-muted-foreground">
                  Live channels, AI context, and handoff control
                </p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary">Live</Badge>
          </div>

          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b p-3 lg:border-r lg:border-b-0">
              <div className="space-y-2">
                {conversations.map((conversation, index) => (
                  <div
                    key={conversation.customer}
                    className={`rounded-lg border p-3 ${
                      index === 0 ? "bg-primary/5" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {conversation.customer}
                      </p>
                      <span className={`text-xs font-medium ${conversation.color}`}>
                        {conversation.channel}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {conversation.message}
                    </p>
                    <p className="mt-2 text-xs text-primary">
                      {conversation.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 p-3">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      AI response
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uses policy, order, and inventory context
                    </p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-muted p-3 text-xs leading-5 text-foreground">
                  The hoodie can be exchanged within 7 days if tags are intact.
                  I can create the exchange request and send pickup details now.
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground"
                  >
                    Send reply
                    <Send className="size-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-lg border bg-card p-2">
                      <Icon className="mb-2 size-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">
                        {metric.value}
                      </p>
                      <p className="truncate text-[0.68rem] text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg border bg-card p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <p className="text-xs font-medium text-foreground">
                      Knowledge base
                    </p>
                  </div>
                  <PackageCheck className="size-4 text-emerald-500" />
                </div>
                <Progress value={82} className="h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  18 docs indexed for policy and product answers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
