import { useMemo, useState } from "react";
import { FileText, Info, Plus } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Badge } from "@/components/ui/badge";
import type {
  KnowledgeDocument,
  KnowledgeDocumentFormValues,
} from "../types/knowledge-base.types";
import { formatDocumentType } from "../utils/knowledge-base.utils";
import { KnowledgeBaseTile } from "./KnowledgeBaseTile";
import { KnowledgeDocumentDialog } from "./KnowledgeDocumentDialog";
import {
  useCreateKnowledgeDoc,
  useDeleteKnowledgeDoc,
  useKnowledgeDocs,
  useUpdateKnowledgeDoc,
} from "../api/knowledge-base.queries";
import { toast } from "sonner";
import { DeleteKnowledgeDocDialog } from "./KnowledgeBaseDeleteDialog";
import { useActiveStoreStore } from "@/lib/stores/active-store-store";
import { useHasPermission } from "@/lib/hooks/useHasPermission";

type DialogState = {
  mode: "create" | "edit";
  document: KnowledgeDocument | null;
} | null;

export function KnowledgeBasePage() {
  const activeStoreId = useActiveStoreStore((state) => state.activeStoreId) ?? undefined;
  const canWrite = useHasPermission("knowledgeBase", "write");
  const documentsQuery = useKnowledgeDocs(activeStoreId);
  const createKnowledgeDocMutation = useCreateKnowledgeDoc(activeStoreId);
  const updateKnowledgeDocMutation = useUpdateKnowledgeDoc(activeStoreId);
  const deleteKnowledgeDocMutation = useDeleteKnowledgeDoc(activeStoreId);
  const documents = documentsQuery.data ?? [];
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [deleteDialogDocument, setDeleteDialogDocument] =
    useState<KnowledgeDocument | null>(null);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter((document) =>
      [
        document.title,
        document.fileName,
        document.fileType,
        formatDocumentType(document.documentType),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [documents, search]);

  function requireWrite(): boolean {
    if (!canWrite) {
      toast.error("You need write access to manage the knowledge base.");
      return false;
    }
    return true;
  }

  function handleSave(values: KnowledgeDocumentFormValues) {
    if (!activeStoreId) {
      toast.error("Select or create a store before uploading document");
      return;
    }
    if (dialogState?.mode === "edit" && dialogState.document) {
      const documentId = dialogState.document.id;
      setDialogState(null);
      updateKnowledgeDocMutation.mutate({
        documentId,
        title: values.title,
        documentType: values.documentType,
        file: values.file,
      });
      return;
    }
    if (!values.file) {
      return;
    }
    setDialogState(null);
    createKnowledgeDocMutation.mutate({
      storeId: activeStoreId,
      title: values.title,
      documentType: values.documentType,
      file: values.file,
    });
  }

  function handleConfirmDelete() {
    if (!deleteDialogDocument) return;
    const documentId = deleteDialogDocument.id;
    setDeleteDialogDocument(null);
    deleteKnowledgeDocMutation.mutate(documentId);
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
            onClick={() => { if (requireWrite()) setDialogState({ mode: "create", document: null }); }}
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
        {documentsQuery.isLoading ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                <div className="size-11 shrink-0 rounded-lg bg-muted animate-pulse" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <div className="size-8 rounded-lg bg-muted animate-pulse" />
                  <div className="size-8 rounded-lg bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </>
        ) : documentsQuery.isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-destructive">
            <FileText className="size-8 opacity-40" />
            <p className="text-sm font-medium">Could not load documents</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
            <FileText className="size-8 opacity-40" />
            <p className="text-sm font-medium">No documents found</p>
            <p className="text-xs opacity-70">
              Upload a document or try a different search
            </p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <KnowledgeBaseTile
              key={document.id}
              document={document}
              onEdit={(document) => {
                if (requireWrite()) setDialogState({ mode: "edit", document });
              }}
              onDelete={(document) => {
                if (requireWrite()) setDeleteDialogDocument(document);
              }}
              onPreview={(document) => {
                window.open(document.fileUrl, "_blank", "noopener,noreferrer");
              }}
            />
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
      <DeleteKnowledgeDocDialog
        document={deleteDialogDocument}
        onOpenChange={(open) => {
          if (!open) setDeleteDialogDocument(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
