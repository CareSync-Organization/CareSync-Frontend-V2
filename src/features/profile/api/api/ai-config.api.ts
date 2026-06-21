import { api } from "@/lib/api";
import type {
  StoreAISettingsDTO,
  UpdateStoreAISettingsInput,
} from "../../types/ai-config.types";

export function getStoreAISettings(storeId: string) {
  return api<StoreAISettingsDTO>(`/api/stores/${storeId}/ai-settings/`);
}

export function updateStoreAISettings(input: UpdateStoreAISettingsInput) {
  return api<StoreAISettingsDTO>(`/api/stores/${input.storeId}/ai-settings/`, {
    method: "PATCH",
    body: JSON.stringify({
      auto_reply_enabled: input.autoReplyEnabled,
      confidence_threshold: input.confidenceThreshold,
      auto_escalate_enabled: input.autoEscalateEnabled,
      ai_tone: input.aiTone,
    }),
  });
}