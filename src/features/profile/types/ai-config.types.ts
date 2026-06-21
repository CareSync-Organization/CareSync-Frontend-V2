export type StoreAISettingsDTO = {
  store: string;
  auto_reply_enabled: boolean;
  confidence_threshold: number;
  auto_escalate_enabled: boolean;
  ai_tone: string;
  created_at: string;
  updated_at: string;
};

export type StoreAISettings = {
  storeId: string;
  autoReplyEnabled: boolean;
  confidenceThreshold: number;
  autoEscalateEnabled: boolean;
  aiTone: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateStoreAISettingsInput = {
  storeId: string;
  autoReplyEnabled: boolean;
  confidenceThreshold: number;
  autoEscalateEnabled: boolean;
  aiTone: string;
};