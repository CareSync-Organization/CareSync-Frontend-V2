export type InventorySource = "manual" | "shopify" | "daraz";

export type InventoryAvailability = "in_stock" | "low_stock" | "out_of_stock";


export type InventoryItemDTO = {
  id: string;
  store: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  quantity: number;
  description: string;
  source: InventorySource;
  external_id: string;
  availability: InventoryAvailability;
  is_read_only: boolean;
  created_at: string;
  updated_at: string;
}

export type InventoryItem = {
  id: string;
  storeId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  source: InventorySource;
  externalId: string;
  availability: InventoryAvailability;
  isReadOnly: boolean;
  isOptimistic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InventoryItemFormValues = {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
};

export type CreateInventoryItemInput = InventoryItemFormValues & {
  storeId: string
};

export type UpdateInventoryItemInput = InventoryItemFormValues & {
  itemId: string
}

export type InventorySummaryDTO = {
  total_items: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
}

export type InventorySummary = {
  totalItems: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}
