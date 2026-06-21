import { z } from "zod";

export const shopDomainSchema = z
  .string()
  .min(1, "Store domain is required")
  .transform((val) => {
    const trimmed = val.trim().toLowerCase();
    return trimmed.endsWith(".myshopify.com")
      ? trimmed
      : `${trimmed}.myshopify.com`;
  })
  .refine((val) => /^[a-z0-9-]+\.myshopify\.com$/.test(val), {
    message: "Enter a valid Shopify store domain (e.g. mystore.myshopify.com)",
  });