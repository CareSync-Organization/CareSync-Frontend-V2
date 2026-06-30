import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CustomerIntentRow } from "../types/analytics.types";

type CustomerIntentProps = {
  data: CustomerIntentRow[];
  sampleSize?: number;
  isLoading?: boolean;
};

export function CustomerIntent({ data, sampleSize, isLoading }: CustomerIntentProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Common Customer Intents</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No intent data for this period</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Intent</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead className="min-w-48">Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((intent) => (
                    <TableRow key={intent.intent}>
                      <TableCell className="font-medium">{intent.label}</TableCell>
                      <TableCell>{intent.count.toLocaleString()}</TableCell>
                      <TableCell>{intent.percentage}%</TableCell>
                      <TableCell>
                        <Progress value={intent.percentage} className="h-2" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {sampleSize !== undefined && (
              <p className="mt-3 text-xs text-muted-foreground">
                Based on {sampleSize.toLocaleString()} AI interactions
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
