import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
};

export function CustomerIntent({ data }: CustomerIntentProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Common Customer Intents</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <TableCell className="font-medium">{intent.intent}</TableCell>
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
      </CardContent>
    </Card>
  );
}
