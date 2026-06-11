import { TextareaField } from "@/components/shared/forms/TextareaField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
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

type AIAutomationCardProps = {
  autoReplyEnabled: boolean;
  onAutoReplyEnabledChange: (value: boolean) => void;
  confidenceThreshold: number;
  onConfidenceThresholdChange: (value: number) => void;
  autoEscalateEnabled: boolean;
  onAutoEscalateEnabledChange: (value: boolean) => void;
  aiTone: string;
  onAiToneChange: (value: string) => void;
};

export function AIAutomationCard({
  autoReplyEnabled,
  onAutoReplyEnabledChange,
  confidenceThreshold,
  onConfidenceThresholdChange,
  autoEscalateEnabled,
  onAutoEscalateEnabledChange,
  aiTone,
  onAiToneChange,
}: AIAutomationCardProps) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>AI Automation</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Enable AI Responses
            </p>
            <p className="text-xs text-muted-foreground">
              Allow AI to automatically respond to customer inquiries.
            </p>
          </div>
          <Toggle
            checked={autoReplyEnabled}
            onCheckedChange={onAutoReplyEnabledChange}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Confidence Threshold
            </p>
            <span className="text-sm font-semibold text-primary">
              {confidenceThreshold}%
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={confidenceThreshold}
            onChange={(event) =>
              onConfidenceThresholdChange(Number(event.target.value))
            }
            className="w-full accent-primary"
          />

          <p className="text-xs text-muted-foreground">
            Minimum confidence required before AI responds automatically.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Auto-Escalate Complex Queries
            </p>
            <p className="text-xs text-muted-foreground">
              Escalate conversations when AI confidence is low.
            </p>
          </div>
          <Toggle
            checked={autoEscalateEnabled}
            onCheckedChange={onAutoEscalateEnabledChange}
          />
        </div>

        <TextareaField
          label="AI Tone"
          value={aiTone}
          onChange={(event) => onAiToneChange(event.target.value)}
          className="min-h-28"
          placeholder="Concise, friendly customer-care tone."
        />
      </CardContent>
    </Card>
  );
}