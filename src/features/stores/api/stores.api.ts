import { api } from "@/lib/api";
import type { StoreDTO, UpdateStoreInput } from "../types/stores.types";

export async function getStores(): Promise<StoreDTO[]> {
  return api<StoreDTO[]>("/api/stores/");
}

export async function createStore(name: string): Promise<StoreDTO> {
  return api<StoreDTO>("/api/stores/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateStore({storeId, name}: UpdateStoreInput): Promise<StoreDTO> {
  return api<StoreDTO>(`/api/stores/${storeId}/`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  })
}

export async function deleteStore(storeId: string): Promise<void> {
  return api<void>(`/api/stores/${storeId}/`, {
    method: "DELETE"
  });
}