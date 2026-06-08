import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  sku: z.string().trim().min(2, "Product code / SKU must be at least 2 characters"),
  category: z.string().trim().min(2, "Category is required"),
  price: z.number().min(0, "Price cannot be negative"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  description: z.string(),
});