import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { KnowledgeDocument } from "../types/knowledge-base.types";
import { ActionButton } from "@/components/shared/ActionButton";

type DeleteKnowledgeDocDialogProps = {
    document: KnowledgeDocument | null;
    isDeleting: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export function DeleteKnowledgeDocDialog({
    document,
    isDeleting,
    onOpenChange,
    onConfirm
}: DeleteKnowledgeDocDialogProps) {
  return (
    <Dialog
      open={document !== null}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete document?</DialogTitle>
          <DialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">
              {document?.title}
            </span>{" "}
            from the knowledge base.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <ActionButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </ActionButton>
          <ActionButton
            type="button"
            variant="destructive"
            isLoading={isDeleting}
            loadingText="Deleting..."
            onClick={onConfirm}
          >
            Delete
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
