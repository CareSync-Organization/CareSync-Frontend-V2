import { useState } from "react";
import { Save } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";

import { AIAutomationCard } from "./AIAutomationCard";
import { ResponseTemplatesCard } from "./ResponseTemplatesCard";

export function AIConfigPage() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [threshold, setThreshold] = useState(75);
  const [autoEscalate, setAutoEscalate] = useState(true);

  return (
    <div className="space-y-6">
      <AIAutomationCard
        aiEnabled={aiEnabled}
        onAiEnabledChange={setAiEnabled}
        threshold={threshold}
        onThresholdChange={setThreshold}
        autoEscalate={autoEscalate}
        onAutoEscalateChange={setAutoEscalate}
      />
      <ResponseTemplatesCard />
      <div className="flex justify-end">
        <ActionButton
          type="button"
          startIcon={<Save className="size-4" />}
          onClick={() =>
            console.log("Saving AI config:", { aiEnabled, threshold, autoEscalate })
          }
        >
          Save Changes
        </ActionButton>
      </div>
    </div>
  );
}
