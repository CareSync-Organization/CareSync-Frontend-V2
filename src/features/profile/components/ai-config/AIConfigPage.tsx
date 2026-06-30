import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";

import {
  useStoreAISettings,
  useUpdateStoreAISettings,
} from "../../api/queries/ai-config.queries";
import { AIAutomationCard } from "./AIAutomationCard";
// import { ResponseTemplatesCard } from "./ResponseTemplatesCard";

const defaultDraft = {
  autoReplyEnabled: true,
  confidenceThreshold: 75,
  autoEscalateEnabled: true,
  aiTone: "Concise, friendly customer-care tone.",
};

export function AIConfigPage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId);

  const { data: settings, isLoading, isError, refetch } =
    useStoreAISettings(activeStoreId);

  const updateSettingsMutation = useUpdateStoreAISettings();

  const [draft, setDraft] = useState(defaultDraft);

  useEffect(() => {
    if (!settings) return;

    setDraft({
      autoReplyEnabled: settings.autoReplyEnabled,
      confidenceThreshold: settings.confidenceThreshold,
      autoEscalateEnabled: settings.autoEscalateEnabled,
      aiTone: settings.aiTone,
    });
  }, [settings]);

  async function handleSave() {
    if (!activeStoreId) return;

    await updateSettingsMutation.mutateAsync({
      storeId: activeStoreId,
      ...draft,
    });
  }

  if (!activeStoreId) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-base font-semibold">No active store selected</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create or select a store before configuring AI automation.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-base font-semibold">Loading AI settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetching automation settings for the active store.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-base font-semibold">Could not load AI settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while fetching this store's AI configuration.
        </p>
        <ActionButton
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => refetch()}
        >
          Retry
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AIAutomationCard
        autoReplyEnabled={draft.autoReplyEnabled}
        onAutoReplyEnabledChange={(value) =>
          setDraft((current) => ({ ...current, autoReplyEnabled: value }))
        }
        confidenceThreshold={draft.confidenceThreshold}
        onConfidenceThresholdChange={(value) =>
          setDraft((current) => ({ ...current, confidenceThreshold: value }))
        }
        autoEscalateEnabled={draft.autoEscalateEnabled}
        onAutoEscalateEnabledChange={(value) =>
          setDraft((current) => ({ ...current, autoEscalateEnabled: value }))
        }
        aiTone={draft.aiTone}
        onAiToneChange={(value) =>
          setDraft((current) => ({ ...current, aiTone: value }))
        }
      />

      {/* <ResponseTemplatesCard /> */}

      <div className="flex justify-end">
        <ActionButton
          type="button"
          startIcon={<Save className="size-4" />}
          isLoading={updateSettingsMutation.isPending}
          loadingText="Saving..."
          onClick={handleSave}
        >
          Save Changes
        </ActionButton>
      </div>
    </div>
  );
}