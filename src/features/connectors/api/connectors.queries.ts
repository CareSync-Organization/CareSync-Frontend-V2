import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import {
  completeWhatsAppOAuth,
  deleteConnector,
  getStoreConnectors,
  initiateDarazConnect,
  initiateShopifyConnect,
  pollDarazMessages,
  syncDarazInventory,
  syncShopifyInventory,
} from "./connectors.api";
import { mapConnectorDto } from "./connectors.mapper";
import type {
  ConnectorRecord,
  DarazRegion,
  WhatsAppOAuthCompleteInput,
} from "../types/connectors.types";

export function storeConnectorsQueryOptions(storeId: string) {
  return queryOptions({
    queryKey: queryKeys.connectors.list(storeId),
    queryFn: async() => {
      const dtoList = await getStoreConnectors(storeId)
      return dtoList.map(mapConnectorDto);
    },
    staleTime: 1000 * 60 * 2
  })
}

export function useStoreConnectors(storeId: string | undefined) {
  return useQuery({
    ...storeConnectorsQueryOptions(storeId ?? "missing-store"),
    enabled: Boolean(storeId),
  });
}

export function useCompleteWhatsAppOAuth(storeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: WhatsAppOAuthCompleteInput) => {
      if (!storeId) {
        throw new Error("Select a store before connecting WhatsApp.");
      }

      const dto = await completeWhatsAppOAuth(storeId, payload);
      return mapConnectorDto(dto);
    },
    onSuccess: (connector) => {
      queryClient.setQueryData<ConnectorRecord[]>(
        queryKeys.connectors.list(connector.storeId),
        (oldConnectors = []) => {
          const otherConnectors = oldConnectors.filter(
            (item) => item.channel !== connector.channel,
          );

          return [...otherConnectors, connector];
        },
      );

      toast.success("WhatsApp connected successfully.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete WhatsApp connection.",
      );
    },
  });
}

export function useInitiateShopifyConnect() {
  return useMutation({
    mutationFn: async ({ shopDomain, storeId }: { shopDomain: string, storeId: string }) => {
      return initiateShopifyConnect({ shop_domain: shopDomain, store_id: storeId });

    },
    onSuccess: (data) => {
      window.location.href = data.auth_url;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to initiate Shopify connection.",
      );
    },
  });
}


export function useDeleteConnector(storeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectorId: string) => {
      if (!storeId) {
        throw new Error("Select a store before disconnecting a connector.");
      }

      await deleteConnector(storeId, connectorId);
      return connectorId;
    },
    onSuccess: (deletedConnectorId) => {
      if (!storeId) return;

      queryClient.setQueryData<ConnectorRecord[]>(
        queryKeys.connectors.list(storeId),
        (oldConnectors = []) =>
          oldConnectors.filter(
            (connector) => connector.id !== deletedConnectorId,
          ),
      );

      toast.success("Connector disconnected.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to disconnect connector.",
      );
    },
  });
}

export function useSyncShopifyInventory(storeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectorId: string) => {
      if (!storeId) {
        throw new Error("Select a store before syncing Shopify inventory.");
      }

      return syncShopifyInventory(storeId, connectorId);
    },
    onSuccess: () => {
      if (storeId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.connectors.list(storeId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.inventory.list(storeId),
        });
      }

      toast.success("Shopify inventory sync started.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start Shopify inventory sync.",
      );
    },
  });
}

export function useInitiateDarazConnect() {
  return useMutation({
    mutationFn: ({ storeId, region }: { storeId: string; region: DarazRegion }) =>
      initiateDarazConnect({ storeId, region }),
    onSuccess: ({ auth_url }) => {
      window.location.assign(auth_url);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start Daraz authorization.",
      );
    },
  });
}

export function useSyncDarazInventory(storeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectorId: string) => {
      if (!storeId) throw new Error("Select a store before syncing Daraz inventory.");
      return syncDarazInventory(storeId, connectorId);
    },
    onSuccess: () => {
      if (storeId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.connectors.list(storeId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.inventory.list(storeId) });
      }
      toast.success("Daraz inventory sync started.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to sync Daraz inventory.",
      );
    },
  });
}

export function usePollDarazMessages(storeId: string | undefined) {
  return useMutation({
    mutationFn: (connectorId: string) => {
      if (!storeId) throw new Error("Select a store before checking Daraz messages.");
      return pollDarazMessages(storeId, connectorId);
    },
    onSuccess: () => {
      toast.success("Checking Daraz for new customer messages.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to check Daraz messages.",
      );
    },
  });
}
