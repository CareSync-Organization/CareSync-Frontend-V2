import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Preference = {
  id: "emailNotifications" | "weeklyReports" | "marketingEmails";
  label: string;
  description: string;
};

const preferences: Preference[] = [
  {
    id: "emailNotifications",
    label: "Email Notifications",
    description: "Receive email updates about your account",
  },
  {
    id: "weeklyReports",
    label: "Weekly Reports",
    description: "Get weekly analytics summaries via email",
  },
  {
    id: "marketingEmails",
    label: "Marketing Emails",
    description: "Receive product updates and tips",
  },
];

function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

export function PreferencesCard() {
  const [enabled, setEnabled] = useState({
    emailNotifications: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <Toggle
              checked={enabled[pref.id]}
              onCheckedChange={(v) =>
                setEnabled((prev) => ({ ...prev, [pref.id]: v }))
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
