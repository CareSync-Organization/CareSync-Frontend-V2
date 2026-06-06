import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ActivePlanCard } from "./ActivePlanCard";
import { BillingHistoryTile } from "./BillingHistoryTile";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { UsageLimitCard } from "./UsageLimitCard";

const billingHistory = [
  {
    date: "June 1, 2024",
    plan: "Professional Plan",
    amount: "$99.00",
    status: "paid" as const,
  },
  {
    date: "May 1, 2024",
    plan: "Professional Plan",
    amount: "$99.00",
    status: "paid" as const,
  },
  {
    date: "April 1, 2024",
    plan: "Professional Plan",
    amount: "$99.00",
    status: "paid" as const,
  },
];

export function BillingPage() {
  return (
    <div className="space-y-6">
      <ActivePlanCard />
      <PaymentMethodCard />
      <UsageLimitCard />
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {billingHistory.map((item) => (
            <BillingHistoryTile key={item.date} {...item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
