import { z } from "zod";

export const knowledgeDocumentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  title: z.string().min(3, "Document title must be at least 3 characters"),
  file: z.instanceof(File).nullable(),
});
