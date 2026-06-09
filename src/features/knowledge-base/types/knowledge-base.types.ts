export type KnowledgeDocument = {
  id: string;
  title: string;
  documentType: string;
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  uploadedAt: string;
  fileUrl: string;
  isOptimistic?: boolean;
};

export type KnowledgeDocumentFormValues = {
  documentType: string;
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
  documentType: string;
  file: File;
};


// using a simple convention here, data coming from the backend is ganna be all snake case
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
};

export type UpdateKnowledgeDocInput = {
  documentId: string;
  title: string;
  documentType: string;
  file: File | null;
};
