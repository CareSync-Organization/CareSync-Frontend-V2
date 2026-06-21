import type {
  StoreAISettings,
  StoreAISettingsDTO,
} from "../../types/ai-config.types"

export function mapStoreAISettingsDto(
  dto: StoreAISettingsDTO,
): StoreAISettings {
  return {
    storeId: dto.store,
    autoReplyEnabled: dto.auto_reply_enabled,
    confidenceThreshold: dto.confidence_threshold,
    autoEscalateEnabled: dto.auto_escalate_enabled,
    aiTone: dto.ai_tone,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}