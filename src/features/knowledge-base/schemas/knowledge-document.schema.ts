import { z } from "zod";

export const knowledgeDocumentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  title: z.string(),
  file: z.instanceof(File).nullable(),
});
