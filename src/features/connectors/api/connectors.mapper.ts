import type { ChannelKey } from "@/features/integrations/types/channel.types";
import type {
  ConnectorDto,
  ConnectorMetadata,
  ConnectorRecord,
  DarazConnectorMetadata,
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

function mapDarazConnectorMetadata(
  metadata: Record<string, unknown>,
): DarazConnectorMetadata {
  const lastInventorySync = asRecord(metadata.last_inventory_sync);
  const lastImPoll = asRecord(metadata.last_im_poll);
  const region = asString(metadata.region);

  return {
    region:
      region === "pk" ||
      region === "bd" ||
      region === "lk" ||
      region === "np" ||
      region === "mm"
        ? region
        : undefined,
    regionName: asString(metadata.region_name),
    sellerId: asString(metadata.seller_id),
    shortCode: asString(metadata.short_code),
    accountId: asString(metadata.account_id),
    accessTokenExpiresAt: asString(metadata.access_token_expires_at),
    refreshTokenExpiresAt: asString(metadata.refresh_token_expires_at),
    connectedAt: asString(metadata.connected_at),
    lastInventorySync: lastInventorySync
      ? {
          created: asNumber(lastInventorySync.created),
          updated: asNumber(lastInventorySync.updated),
          skipped: asNumber(lastInventorySync.skipped),
          conflicts: asNumber(lastInventorySync.conflicts),
          syncedAt: asString(lastInventorySync.synced_at),
        }
      : undefined,
    lastImPoll: lastImPoll
      ? {
          sessions: asNumber(lastImPoll.sessions),
          messagesCreated: asNumber(lastImPoll.messages_created),
          polledAt: asString(lastImPoll.polled_at),
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

  if (dto.platform === "daraz") {
    return mapDarazConnectorMetadata(dto.metadata);
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
