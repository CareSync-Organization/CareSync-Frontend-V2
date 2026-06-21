import type { ChannelKey } from "@/features/integrations/types/channel.types";

export type BackendConnectorStatus = "active" | "inactive" | "failed";

export type ConnectorPlatform = "whatsapp" | "shopify" | "daraz";

export type ConnectorDto = {
  id: string;
  store: string;
  platform: ConnectorPlatform;
  status: BackendConnectorStatus;
  display_name: string;
  external_id: string;
  metadata: Record<string, unknown>;
  last_error: string;
  created_at: string;
  updated_at: string;
};

export type WhatsAppConnectorMetadata = {
  businessAccountId?: string;
  phoneNumberId?: string;
  webhookSubscribed?: boolean;
  tokenSource?: "access_token" | "oauth_code";
  phoneNumber?: {
    displayPhoneNumber?: string;
    verifiedName?: string;
  };
};

export type ShopifyConnectorMetadata = {
  scopes?: string;
  inventoryWebhookAddress?: string;
  inventoryWebhookIds?: Record<string, string>;
  inventoryLastSync?: {
    created?: number;
    updated?: number;
    skipped?: number;
    deleted?: number;
  };
};

export type ConnectorMetadata =
  | WhatsAppConnectorMetadata
  | ShopifyConnectorMetadata
  | Record<string, unknown>;

export type ConnectorRecord = {
  id: string;
  storeId: string;
  channel: ChannelKey;
  status: BackendConnectorStatus;
  displayName: string;
  externalId: string;
  metadata: ConnectorMetadata;
  lastError: string;
  createdAt: string;
  updatedAt: string;
};

export type WhatsAppOAuthCompleteInput = {
  accessToken?: string;
  code?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  redirectUri?: string;
  displayName?: string;
};

export type MetaWhatsAppLoginResult = WhatsAppOAuthCompleteInput;


// shopify types
export type ShopifyConnectInput = {
  shop_domain: string;
  store_id: string;
};

export type ShopifyConnectResponse = {
  auth_url: string;
};

export type ShopifyInventorySyncResponse = {
  status: "queued";
  task_id: string;
};
