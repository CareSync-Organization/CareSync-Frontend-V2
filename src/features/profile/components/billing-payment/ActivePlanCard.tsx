import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivePlanCard() {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Billing &amp; Subscription</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing information
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border bg-primary/5 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Professional Plan</span>
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Premium
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                All channels • Unlimited conversations • Advanced automation
              </p>
              <p className="mt-2 text-xl font-semibold">
                $99.00{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / month
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <ActionButton type="button" size="sm" onClick={() => toast.info("Coming soon")}>
                Change Plan
              </ActionButton>
              <ActionButton
                type="button"
                size="sm"
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => toast.info("Coming soon")}
              >
                Cancel Plan
              </ActionButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
