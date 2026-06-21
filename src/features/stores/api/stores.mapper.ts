import type { Store, StoreDTO } from "../types/stores.types";

export function mapStoreDto(dto: StoreDTO): Store {
  return {
    id: dto.id,
    name: dto.name,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}