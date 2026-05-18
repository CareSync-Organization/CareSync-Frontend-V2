import { useMemo, useState } from "react";
import { Edit2, FileText, Info, Plus, Trash2 } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Badge } from "@/components/ui/badge";

import { demoDocuments } from "../mocks/knowledge-base.mock";
import type {
  KnowledgeDocument,
  KnowledgeDocumentFormValues,
} from "../types/knowledge-base.types";
import {
  createDocumentFromValues,
  documentTypeLabel,
  formatDate,
  getFileType,
} from "../utils/knowledge-base.utils";
import { KnowledgeDocumentDialog } from "./KnowledgeDocumentDialog";

type DialogState = {
  mode: "create" | "edit";
  document: KnowledgeDocument | null;
} | null;

export function KnowledgeBasePage() {
  const [documents, setDocuments] = useState(demoDocuments);
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((document) =>
      [
        document.title,
        document.fileName,
        document.fileType,
        documentTypeLabel[document.documentType],
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [documents, search]);

  function handleSave(values: KnowledgeDocumentFormValues) {
    if (dialogState?.mode === "edit" && dialogState.document) {
      setDocuments((current) =>
        current.map((document) => {
          if (document.id !== dialogState.document?.id) return document;
          return {
            ...document,
            title: values.title,
            documentType: values.documentType,
            fileName: values.file?.name ?? document.fileName,
            fileType: values.file
              ? getFileType(values.file)
              : document.fileType,
            fileSizeKb: values.file
              ? Math.max(1, Math.round(values.file.size / 1024))
              : document.fileSizeKb,
            uploadedAt: new Date().toISOString(),
          };
        }),
      );
    } else {
      const nextDocument = createDocumentFromValues(values);
      if (nextDocument) {
        setDocuments((current) => [nextDocument, ...current]);
      }
    }
    setDialogState(null);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1>Knowledge Base</h1>
        <p className="text-muted-foreground">
          Upload and manage data sources used by AI to generate accurate
          customer responses
        </p>
      </div>

      <div className="flex gap-3 rounded-xl border border-blue-500/25 bg-blue-500/10 p-4 text-blue-700 dark:text-blue-300">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-blue-500/10">
          <Info className="size-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold">How it works</h2>
          <p className="mt-1 text-blue-700/80 dark:text-blue-300/80">
            Upload documents, FAQs, and product information. Our AI analyzes and
            indexes this data to provide accurate, context-aware responses to
            customer queries. Supported formats: PDF, DOCX, TXT, CSV.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Train Your AI Assistant</h2>
            <p className="mt-1 text-muted-foreground">
              Upload FAQs, policies, troubleshooting guides, and product
              information to improve automated responses
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["PDF", "DOCX", "TXT", "CSV"].map((format) => (
                <Badge key={format} variant="secondary">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
          <ActionButton
            type="button"
            startIcon={<Plus className="size-4" />}
            className="w-fit"
            onClick={() => setDialogState({ mode: "create", document: null })}
          >
            Upload New
          </ActionButton>
        </div>
      </div>

      <SearchInput
        placeholder="Search knowledge base..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        containerClassName="max-w-md"
      />

      <div className="space-y-3">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
            <FileText className="size-8 opacity-40" />
            <p className="text-sm font-medium">No documents found</p>
            <p className="text-xs opacity-70">
              Upload a document or try a different search
            </p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold">
                  {document.title}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="h-6">
                    {documentTypeLabel[document.documentType]}
                  </Badge>
                  <span>Uploaded: {formatDate(document.uploadedAt)}</span>
                  <span>{document.fileSizeKb} KB</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label={`Edit ${document.title}`}
                  onClick={() => setDialogState({ mode: "edit", document })}
                >
                  <Edit2 className="size-4" />
                </button>
                <button
                  type="button"
                  className="grid size-8 place-items-center rounded-lg text-destructive transition hover:bg-destructive/10"
                  aria-label={`Delete ${document.title}`}
                  onClick={() =>
                    setDocuments((current) =>
                      current.filter((d) => d.id !== document.id),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <KnowledgeDocumentDialog
        key={dialogState?.document?.id ?? dialogState?.mode ?? "closed"}
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        document={dialogState?.document ?? null}
        onOpenChange={(open) => {
          if (!open) setDialogState(null);
        }}
        onSave={handleSave}
      />
    </section>
  );
}
