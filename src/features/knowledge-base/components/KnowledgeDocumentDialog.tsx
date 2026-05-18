import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFieldError } from "@/lib/get-field-error";

import {
  knowledgeDocumentSchema,
  knowledgeDocumentTypes,
} from "../schemas/knowledge-document.schema";
import type {
  KnowledgeDocument,
  KnowledgeDocumentFormValues,
  KnowledgeDocumentType,
} from "../types/knowledge-base.types";
import { documentTypeLabel } from "../utils/knowledge-base.utils";

export type KnowledgeDocumentDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  document: KnowledgeDocument | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: KnowledgeDocumentFormValues) => void;
};

export function KnowledgeDocumentDialog({
  open,
  mode,
  document,
  onOpenChange,
  onSave,
}: KnowledgeDocumentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      documentType: document?.documentType ?? "policy",
      title: document?.title ?? "",
      file: null,
    } as KnowledgeDocumentFormValues,
    onSubmit: ({ value }) => {
      if (mode === "create" && !value.file) {
        setFileError("Upload a document file");
        return;
      }
      onSave(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Update" : "Upload"} Knowledge Document
            </DialogTitle>
            <DialogDescription>
              Add source material that CareSync AI can use for customer
              responses.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <form.Field
              name="documentType"
              validators={{
                onChange: knowledgeDocumentSchema.shape.documentType,
              }}
            >
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Document Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as KnowledgeDocumentType)
                    }
                  >
                    <SelectTrigger id={field.name} className="h-11 w-full">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {knowledgeDocumentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {documentTypeLabel[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field
              name="title"
              validators={{ onChange: knowledgeDocumentSchema.shape.title }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Document Title"
                  placeholder="Enter a descriptive title"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>

            <form.Field name="file">
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="knowledge-document-file">Upload File</Label>
                  <button
                    type="button"
                    className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-background p-8 text-center transition hover:border-primary/50 hover:bg-primary/5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mb-3 size-9 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {field.state.value
                        ? field.state.value.name
                        : document
                          ? `Current file: ${document.fileName}`
                          : "Drag and drop your file here, or click to browse"}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground/70">
                      Supports PDF, DOCX, TXT, CSV (Max 10MB)
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    id="knowledge-document-file"
                    type="file"
                    accept=".pdf,.docx,.txt,.csv"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setFileError(undefined);
                      field.handleChange(file);
                    }}
                  />
                  {fileError ? (
                    <p className="text-sm text-destructive">{fileError}</p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <ActionButton type="button" variant="outline">
                Cancel
              </ActionButton>
            </DialogClose>
            <ActionButton type="submit" fullWidth className="sm:w-auto">
              {mode === "edit" ? "Update Document" : "Upload Document"}
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
