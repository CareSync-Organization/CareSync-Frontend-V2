export type InventorySource = "manual" | "shopify" | "daraz";

export type InventoryAvailability = "in-stock" | "low-stock" | "out-of-stock";

export type InventoryItem = {
  id: string;
  sku: string;
  productName: string;
  category: string;
  stockQuantity: number;
  price: number;
  source: InventorySource;
  lastUpdated: string;
  description: string;
};

export type InventoryItemFormValues = {
  productName: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
};
