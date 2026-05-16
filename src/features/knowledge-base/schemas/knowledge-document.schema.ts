import { z } from "zod";

export const knowledgeDocumentTypes = [
  "policy",
  "faq",
  "product-info",
  "troubleshooting",
] as const;

export const knowledgeDocumentSchema = z.object({
  documentType: z.enum(knowledgeDocumentTypes),
  title: z.string().min(3, "Document title must be at least 3 characters"),
  file: z.instanceof(File).nullable(),
});
