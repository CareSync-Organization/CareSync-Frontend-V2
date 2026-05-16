export type KnowledgeDocumentType = "policy" | "faq" | "product-info" | "troubleshooting";

export type KnowledgeDocument = {
  id: string;
  title: string;
  documentType: KnowledgeDocumentType;
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  uploadedAt: string;
};

export type KnowledgeDocumentFormValues = {
  documentType: KnowledgeDocumentType;
  title: string;
  file: File | null;
};
