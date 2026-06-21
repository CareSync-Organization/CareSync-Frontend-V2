import { Edit2, FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import type { KnowledgeDocument } from "../types/knowledge-base.types";
import { formatDate, formatDocumentType } from "../utils/knowledge-base.utils";

type KnowledgeBaseTileProps = {
  document: KnowledgeDocument;
  onEdit: (document: KnowledgeDocument) => void;
  onDelete: (document: KnowledgeDocument) => void;
  onPreview: (document: KnowledgeDocument) => void;
};

export function KnowledgeBaseTile({
  document,
  onEdit,
  onDelete,
  onPreview,
}: KnowledgeBaseTileProps) {
  const isOptimistic = Boolean(document.isOptimistic);

  function handlePreview() {
    if (isOptimistic) {
      toast.info("Saving to database, please wait a moment...");
      return;
    }
    onPreview(document);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition hover:bg-muted/40 ${isOptimistic ? "cursor-wait opacity-60" : "cursor-pointer"}`}
      onClick={handlePreview}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handlePreview();
        }
      }}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
        {isOptimistic ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <FileText className="size-5" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold">{document.title}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="h-6">
            {formatDocumentType(document.documentType)}
          </Badge>
          {isOptimistic ? (
            <span className="text-amber-500">Saving...</span>
          ) : (
            <>
              <span>Uploaded: {formatDate(document.uploadedAt)}</span>
              <span>{document.fileSizeKb} KB</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled={isOptimistic}
          className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label={`Edit ${document.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onEdit(document);
          }}
        >
          <Edit2 className="size-4" />
        </button>
        <button
          type="button"
          disabled={isOptimistic}
          className="grid size-8 place-items-center rounded-lg text-destructive transition hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-40"
          aria-label={`Delete ${document.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(document);
          }}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
