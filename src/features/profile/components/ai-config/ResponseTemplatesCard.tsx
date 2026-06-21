import { LayoutTemplate } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResponseTemplatesCard() {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Response Templates</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage pre-defined response templates for common scenarios
        </p>
      </CardHeader>
      <CardContent>
        <ActionButton
          type="button"
          variant="outline"
          disabled
          startIcon={<LayoutTemplate className="size-4" />}
        >
          Manage Templates (Coming Soon)
        </ActionButton>
      </CardContent>
    </Card>
  );
}
