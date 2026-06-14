// import type {
//   KnowledgeDocument,
//   KnowledgeDocumentFormValues,
// } from "../types/knowledge-base.types";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-CA").format(new Date(date));
}

export function formatDocumentType(documentType: string) {
  return documentType.trim() || "Document";
}

// export function getFileType(file: File) {
//   return file.name.split(".").pop()?.toUpperCase() ?? "FILE";
// }

// export function createDocumentFromValues(
//   values: KnowledgeDocumentFormValues,
// ): KnowledgeDocument | null {
//   if (!values.file) return null;

//   return {
//     id: `kb_${Date.now()}`,
//     title: values.title,
//     documentType: values.documentType,
//     fileName: values.file.name,
//     fileType: getFileType(values.file),
//     fileSizeKb: Math.max(1, Math.round(values.file.size / 1024)),
//     uploadedAt: new Date().toISOString(),
//   };
// }
