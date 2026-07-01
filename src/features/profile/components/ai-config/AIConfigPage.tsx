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
      <div className="rounded-xl border-2 bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="h-5 w-40 rounded bg-muted animate-pulse" />
          <div className="mt-1.5 h-3.5 w-64 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-6 p-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="h-4 w-36 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-56 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-6 w-11 rounded-full bg-muted animate-pulse" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-muted animate-pulse" />
            <div className="h-3.5 w-full max-w-xs rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            <div className="h-24 w-full rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
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