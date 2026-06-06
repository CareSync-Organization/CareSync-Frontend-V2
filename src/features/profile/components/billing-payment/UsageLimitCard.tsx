import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const usageLimits = [
  { label: "Conversations this month", used: 2847, total: 5000 },
  { label: "Connected stores", used: 1, total: 3 },
  { label: "Team members", used: 4, total: 10 },
];

export function UsageLimitCard() {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Usage Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {usageLimits.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">
                {item.used.toLocaleString()} / {item.total.toLocaleString()}
              </span>
            </div>
            <Progress
              value={Math.round((item.used / item.total) * 100)}
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
