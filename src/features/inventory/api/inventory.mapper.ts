import type {
  InventoryItem,
  InventoryItemDTO,
  InventorySummary,
  InventorySummaryDTO,
} from "../types/inventory.types";

export function mapInventoryItemDto(dto: InventoryItemDTO): InventoryItem {
  return {
    id: dto.id,
    storeId: dto.store,
    name: dto.name,
    sku: dto.sku,
    category: dto.category,
    price: Number(dto.price),
    quantity: dto.quantity,
    description: dto.description,
    source: dto.source,
    externalId: dto.external_id,
    availability: dto.availability,
    isReadOnly: dto.is_read_only,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapInventorySummaryDto(
  dto: InventorySummaryDTO,
): InventorySummary {
  return {
    totalItems: dto.total_items,
    inStock: dto.in_stock,
    lowStock: dto.low_stock,
    outOfStock: dto.out_of_stock,
  };
}