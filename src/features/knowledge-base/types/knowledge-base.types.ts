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


export type KnowledgeDocumentProcessingStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "processed"
  | "failed";


export type KnowledgeDocInput = {
  storeId: string;
  title: string;
  document_type: string;
  file: File;
};

export type  KnowledgeDocDTO = {
  id: string;
  store: string;
  title: string;
  document_type: string;
  file_extension: string;
  file_size: number;
  file_url: string;
  processing_status: KnowledgeDocumentProcessingStatus;
  created_at: string;
  updated_at: string
}