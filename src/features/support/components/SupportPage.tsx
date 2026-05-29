import {
  BookOpen,
  ExternalLink,
  FileText,
  Mail,
  MessageCircle,
} from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { SearchInput } from "@/components/shared/SearchInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SupportCategory = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  toneClassName: string;
  iconClassName: string;
};

const supportCategories: SupportCategory[] = [
  {
    title: "Documentation",
    description: "Browse our guides and tutorials",
    icon: BookOpen,
    toneClassName: "bg-primary/10",
    iconClassName: "text-primary",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team",
    icon: MessageCircle,
    toneClassName: "bg-orange-500/10",
    iconClassName: "text-orange-500",
  },
  {
    title: "Email Support",
    description: "Send us an email",
    icon: Mail,
    toneClassName: "bg-violet-500/10",
    iconClassName: "text-violet-500",
  },
  {
    title: "API Docs",
    description: "Integration documentation",
    icon: FileText,
    toneClassName: "bg-emerald-500/10",
    iconClassName: "text-emerald-500",
  },
];

const popularArticles = [
  "Getting started with CareSync",
  "How to connect your first store",
  "Setting up AI automation",
  "Managing team permissions",
  "Understanding your analytics",
];

export function SupportPage() {
  return (
    <section className="w-full space-y-6">
      <div>
        <h1>Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with CareSync and access resources
        </p>
      </div>

      <SearchInput
        placeholder="Search for help articles..."
        containerClassName="max-w-4xl"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supportCategories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.title}
              type="button"
              className="rounded-xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-lg",
                  category.toneClassName,
                )}
              >
                <Icon className={cn("size-5", category.iconClassName)} />
              </span>
              <h2 className="mt-5 text-base font-semibold">
                {category.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>

      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Popular Articles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {popularArticles.map((article) => (
            <button
              key={article}
              type="button"
              className="flex h-11 w-full items-center justify-between gap-4 rounded-lg px-3 text-left text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="truncate text-foreground">{article}</span>
              <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-xl bg-linear-to-br from-primary to-[#14B8A6] p-5 text-primary-foreground shadow-sm sm:p-6">
        <h2 className="text-base font-semibold">Still need help?</h2>
        <p className="mt-2 max-w-3xl text-sm text-primary-foreground/80">
          Our support team is available 24/7 to assist you with any questions or
          issues.
        </p>
        <ActionButton
          type="button"
          variant="secondary"
          className="mt-4 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20"
        >
          Contact Support
        </ActionButton>
      </div>
    </section>
  );
}
