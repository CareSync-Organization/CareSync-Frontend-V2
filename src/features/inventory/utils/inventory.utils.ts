import type {
  InventoryAvailability,
  InventoryItem,
  InventoryItemFormValues,
  InventorySource,
} from "../types/inventory.types";

export const sourceLabel: Record<InventorySource, string> = {
  manual: "Manual",
  shopify: "Synced - Shopify",
  daraz: "Synced - Daraz",
};

export const availabilityLabel: Record<InventoryAvailability, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

export function getAvailability(stockQuantity: number): InventoryAvailability {
  if (stockQuantity === 0) return "out-of-stock";
  if (stockQuantity <= 10) return "low-stock";
  return "in-stock";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", "");
}

export function getMetricCounts(items: InventoryItem[]) {
  return {
    total: items.length,
    inStock: items.filter(
      (item) => getAvailability(item.stockQuantity) === "in-stock",
    ).length,
    lowStock: items.filter(
      (item) => getAvailability(item.stockQuantity) === "low-stock",
    ).length,
    outOfStock: items.filter(
      (item) => getAvailability(item.stockQuantity) === "out-of-stock",
    ).length,
  };
}

export function createManualItem(values: InventoryItemFormValues): InventoryItem {
  return {
    id: `item_${Date.now()}`,
    ...values,
    source: "manual",
    lastUpdated: new Date().toISOString(),
  };
}
