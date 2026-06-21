import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  getInventorySummary,
  updateInventoryItem,
} from "./inventory.api";
import {
  mapInventoryItemDto,
  mapInventorySummaryDto,
} from "./inventory.mapper";
import type {
  CreateInventoryItemInput,
  InventoryAvailability,
  InventoryItem,
  UpdateInventoryItemInput,
} from "../types/inventory.types";

function getAvailability(quantity: number): InventoryAvailability {
  if (quantity === 0) return "out_of_stock";
  if (quantity <= 10) return "low_stock";
  return "in_stock";
}

export function inventoryItemsQueryOptions(storeId: string) {
  return queryOptions({
    queryKey: queryKeys.inventory.list(storeId) ,
    queryFn: async () => {
      const dtos = await getInventoryItems(storeId);
      return dtos.map(mapInventoryItemDto)
    },
    staleTime: 1000 * 60 * 3
  })
}

export function useInventoryItems(storeId: string | null) {
  return useQuery({
    ...inventoryItemsQueryOptions(storeId ?? "missing-store"),
    enabled: Boolean(storeId),
  });
}

export function useInventorySummary(storeId: string | null) {
  return useQuery({
    queryKey: storeId
      ? queryKeys.inventory.summary(storeId)
      : queryKeys.inventory.summary("missing-store"),
    queryFn: async () => {
      if (!storeId) {
        return { totalItems: 0, inStock: 0, lowStock: 0, outOfStock: 0 };
      }

      return mapInventorySummaryDto(await getInventorySummary(storeId));
    },
    enabled: Boolean(storeId),
    staleTime: Infinity
  });
}

export function useCreateInventoryItem(storeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInventoryItemInput) => createInventoryItem(input),

    onMutate: async (input) => {
      if (!storeId) return;

      await queryClient.cancelQueries({
        queryKey: queryKeys.inventory.list(storeId),
      });

      const previousItems =
        queryClient.getQueryData<InventoryItem[]>(
          queryKeys.inventory.list(storeId),
        ) ?? [];

      const now = new Date().toISOString();
      const optimisticItem: InventoryItem = {
        id: `optimistic-${crypto.randomUUID()}`,
        storeId,
        name: input.name.trim(),
        sku: input.sku.trim(),
        category: input.category.trim(),
        price: input.price,
        quantity: input.quantity,
        description: input.description.trim(),
        source: "manual",
        externalId: "",
        availability: getAvailability(input.quantity),
        isReadOnly: false,
        isOptimistic: true,
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueryData<InventoryItem[]>(
        queryKeys.inventory.list(storeId),
        [optimisticItem, ...previousItems],
      );

      return { previousItems, optimisticItemId: optimisticItem.id };
    },

    onError: (error, _input, context) => {
      if (storeId && context?.previousItems) {
        queryClient.setQueryData(
          queryKeys.inventory.list(storeId),
          context.previousItems,
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Could not create inventory item",
      );
    },

    onSuccess: (dto, _input, context) => {
      const createdItem = mapInventoryItemDto(dto);

      if (storeId) {
        queryClient.setQueryData<InventoryItem[]>(
          queryKeys.inventory.list(storeId),
          (oldItems = []) => [
            createdItem,
            ...oldItems.filter((item) => item.id !== context?.optimisticItemId),
          ],
        );

        queryClient.invalidateQueries({
          queryKey: queryKeys.inventory.summary(storeId),
        });
      }

      toast.success("Inventory item created");
    },
  });
}

export function useUpdateInventoryItem(storeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateInventoryItemInput) => updateInventoryItem(input),

    onMutate: async (input) => {
      if (!storeId) return;

      await queryClient.cancelQueries({
        queryKey: queryKeys.inventory.list(storeId),
      });

      const previousItems =
        queryClient.getQueryData<InventoryItem[]>(
          queryKeys.inventory.list(storeId),
        ) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        queryKeys.inventory.list(storeId),
        previousItems.map((item) =>
          item.id === input.itemId
            ? {
                ...item,
                name: input.name.trim(),
                sku: input.sku.trim(),
                category: input.category.trim(),
                price: input.price,
                quantity: input.quantity,
                description: input.description.trim(),
              }
            : item,
        ),
      );

      return { previousItems };
    },

    onError: (error, _input, context) => {
      if (storeId && context?.previousItems) {
        queryClient.setQueryData(
          queryKeys.inventory.list(storeId),
          context.previousItems,
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Could not update inventory item",
      );
    },

    onSuccess: (dto) => {
      const updatedItem = mapInventoryItemDto(dto);

      if (storeId) {
        queryClient.setQueryData<InventoryItem[]>(
          queryKeys.inventory.list(storeId),
          (oldItems = []) =>
            oldItems.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
        );

        queryClient.invalidateQueries({
          queryKey: queryKeys.inventory.summary(storeId),
        });
      }

      toast.success("Inventory item updated");
    },
  });
}

export function useDeleteInventoryItem(storeId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteInventoryItem(itemId),

    onMutate: async (itemId) => {
      if (!storeId) return;

      await queryClient.cancelQueries({
        queryKey: queryKeys.inventory.list(storeId),
      });

      const previousItems =
        queryClient.getQueryData<InventoryItem[]>(
          queryKeys.inventory.list(storeId),
        ) ?? [];

      queryClient.setQueryData<InventoryItem[]>(
        queryKeys.inventory.list(storeId),
        previousItems.filter((item) => item.id !== itemId),
      );

      return { previousItems };
    },

    onError: (error, _itemId, context) => {
      if (storeId && context?.previousItems) {
        queryClient.setQueryData(
          queryKeys.inventory.list(storeId),
          context.previousItems,
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Could not delete inventory item",
      );
    },

    onSuccess: () => {
      if (storeId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.inventory.summary(storeId),
        });
      }

      toast.success("Inventory item deleted");
    },
  });
}
