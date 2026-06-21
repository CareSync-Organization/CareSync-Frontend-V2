import { api } from "@/lib/api";
import type {
  CreateInventoryItemInput,
  InventoryItemDTO,
  InventorySummaryDTO,
  UpdateInventoryItemInput,
} from "../types/inventory.types";

function toInventoryPayload(
  input: CreateInventoryItemInput | UpdateInventoryItemInput,
) {
  return {
    name: input.name.trim(),
    sku: input.sku.trim(),
    category: input.category.trim(),
    price: input.price,
    quantity: input.quantity,
    description: input.description.trim(),
  };
}

export function getInventoryItems(storeId: string) {
  return api<InventoryItemDTO[]>(
    `/api/inventory/?store_id=${encodeURIComponent(storeId)}`,
  );
}

export function getInventorySummary(storeId: string) {
  return api<InventorySummaryDTO>(
    `/api/inventory/summary/?store_id=${encodeURIComponent(storeId)}`,
  );
}

export function createInventoryItem(input: CreateInventoryItemInput) {
  return api<InventoryItemDTO>("/api/inventory/", {
    method: "POST",
    body: JSON.stringify({
      store_id: input.storeId,
      ...toInventoryPayload(input),
    }),
  });
}

export function updateInventoryItem(input: UpdateInventoryItemInput) {
  return api<InventoryItemDTO>(`/api/inventory/${input.itemId}/`, {
    method: "PATCH",
    body: JSON.stringify(toInventoryPayload(input)),
  });
}

export function deleteInventoryItem(itemId: string) {
  return api<void>(`/api/inventory/${itemId}/`, {
    method: "DELETE",
  });
}