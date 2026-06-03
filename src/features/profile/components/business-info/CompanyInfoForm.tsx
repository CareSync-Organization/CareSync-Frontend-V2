import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyInfoFormProps = {
  children: ReactNode;
};

export function CompanyInfoForm({ children }: CompanyInfoFormProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <p className="text-sm text-muted-foreground">
          Edit your company details and contact information
        </p>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
