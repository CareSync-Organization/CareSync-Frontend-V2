import { api } from "@/lib/api";
import type {
  ConnectorDto,
  WhatsAppOAuthCompleteInput,
  ShopifyConnectInput,
  ShopifyConnectResponse,
  ShopifyInventorySyncResponse,
  DarazConnectInput,
  DarazConnectResponse,
  DarazTaskResponse,
} from "../types/connectors.types";

export function getStoreConnectors(storeId: string) {
  return api<ConnectorDto[]>(`/api/stores/${storeId}/connectors/`);
}

export function completeWhatsAppOAuth(
  storeId: string,
  input: WhatsAppOAuthCompleteInput,
) {
  return api<ConnectorDto>(
    `/api/stores/${storeId}/connectors/whatsapp/oauth/complete/`,
    {
      method: "POST",
      body: JSON.stringify({
        access_token: input.accessToken,
        code: input.code,
        phone_number_id: input.phoneNumberId,
        business_account_id: input.businessAccountId,
        redirect_uri: input.redirectUri,
        display_name: input.displayName ?? "",
      }),
    },
  );
}

export function initiateShopifyConnect(input: ShopifyConnectInput) {
  return api<ShopifyConnectResponse>(
    `/api/stores/${input.store_id}/connectors/shopify/oauth/start/`,
    {
      method: "POST",
      body: JSON.stringify({ shop: input.shop_domain }),
    },
  );
}


export function deleteConnector(storeId: string, connectorId: string) {
  return api<void>(`/api/stores/${storeId}/connectors/${connectorId}/`, {
    method: "DELETE",
  });
}

export function syncShopifyInventory(storeId: string, connectorId: string) {
  return api<ShopifyInventorySyncResponse>(
    `/api/stores/${storeId}/connectors/${connectorId}/shopify/sync-inventory/`,
    {
      method: "POST",
    },
  );
}

export function initiateDarazConnect(input: DarazConnectInput) {
  return api<DarazConnectResponse>(
    `/api/stores/${input.storeId}/connectors/daraz/oauth/start/`,
    {
      method: "POST",
      body: JSON.stringify({
        region: input.region,
        platform: "web",
      }),
    },
  );
}

export function syncDarazInventory(storeId: string, connectorId: string) {
  return api<DarazTaskResponse>(
    `/api/stores/${storeId}/connectors/${connectorId}/daraz/sync-inventory/`,
    { method: "POST" },
  );
}

export function pollDarazMessages(storeId: string, connectorId: string) {
  return api<DarazTaskResponse>(
    `/api/stores/${storeId}/connectors/${connectorId}/daraz/poll-messages/`,
    { method: "POST" },
  );
}
