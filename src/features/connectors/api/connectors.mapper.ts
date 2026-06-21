import type { ChannelKey } from "@/features/integrations/types/channel.types";
import type {
  ConnectorDto,
  ConnectorMetadata,
  ConnectorRecord,
  ShopifyConnectorMetadata,
  WhatsAppConnectorMetadata,
} from "../types/connectors.types";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function mapWhatsAppConnectorMetadata(
  metadata: Record<string, unknown>,
): WhatsAppConnectorMetadata {
  const phoneNumber =
    metadata.phone_number && typeof metadata.phone_number === "object"
      ? (metadata.phone_number as Record<string, unknown>)
      : undefined;

  return {
    businessAccountId: asString(metadata.business_account_id),
    phoneNumberId: asString(metadata.phone_number_id),
    webhookSubscribed: asBoolean(metadata.webhook_subscribed),
    tokenSource:
      metadata.token_source === "access_token" ||
      metadata.token_source === "oauth_code"
        ? metadata.token_source
        : undefined,
    phoneNumber: phoneNumber
      ? {
          displayPhoneNumber: asString(phoneNumber.display_phone_number),
          verifiedName: asString(phoneNumber.verified_name),
        }
      : undefined,
  };
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function mapShopifyConnectorMetadata(
  metadata: Record<string, unknown>,
): ShopifyConnectorMetadata {
  const inventoryLastSync = asRecord(metadata.inventory_last_sync);

  return {
    scopes: asString(metadata.scopes),
    inventoryWebhookAddress: asString(metadata.inventory_webhook_address),
    inventoryWebhookIds: asRecord(metadata.inventory_webhook_ids) as
      | Record<string, string>
      | undefined,
    inventoryLastSync: inventoryLastSync
      ? {
          created: asNumber(inventoryLastSync.created),
          updated: asNumber(inventoryLastSync.updated),
          skipped: asNumber(inventoryLastSync.skipped),
          deleted: asNumber(inventoryLastSync.deleted),
        }
      : undefined,
  };
}

function mapConnectorMetadata(dto: ConnectorDto): ConnectorMetadata {
  if (dto.platform === "whatsapp") {
    return mapWhatsAppConnectorMetadata(dto.metadata);
  }

  if (dto.platform === "shopify") {
    return mapShopifyConnectorMetadata(dto.metadata);
  }

  return dto.metadata;
}

export function mapConnectorDto(dto: ConnectorDto): ConnectorRecord {
  return {
    id: dto.id,
    storeId: dto.store,
    channel: dto.platform as ChannelKey,
    status: dto.status,
    displayName: dto.display_name,
    externalId: dto.external_id,
    metadata: mapConnectorMetadata(dto),
    lastError: dto.last_error,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
