import type {
  InventoryAvailability,
  InventoryItem,
  InventorySource,
} from "../types/inventory.types";

export const sourceLabel: Record<InventorySource, string> = {
  manual: "Manual",
  shopify: "Synced - Shopify",
  daraz: "Synced - Daraz",
};

export const availabilityLabel: Record<InventoryAvailability, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

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
    totalItems: items.length,
    inStock: items.filter((item) => item.availability === "in_stock").length,
    lowStock: items.filter((item) => item.availability === "low_stock").length,
    outOfStock: items.filter((item) => item.availability === "out_of_stock").length,
  };
}