import { z } from "zod";

export const inventoryItemSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  price: z.number().min(0, "Price cannot be negative"),
  stockQuantity: z
    .number()
    .int("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative"),
  description: z.string().optional(),
});
