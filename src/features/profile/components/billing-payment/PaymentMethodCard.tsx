import { CreditCard } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentMethodCard() {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          <ActionButton type="button" variant="outline" size="sm">
            Update
          </ActionButton>
        </div>
      </CardContent>
    </Card>
  );
}
