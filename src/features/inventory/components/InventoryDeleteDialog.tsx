import { ActionButton } from "@/components/shared/ActionButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InventoryItem } from "../types/inventory.types";

type InventoryDeleteDialogProps = {
  item: InventoryItem | null;
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function InventoryDeleteDialog({
  item,
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: InventoryDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete inventory item?</DialogTitle>
          <DialogDescription>
            This will permanently remove {item?.name ?? "this item"} from manual
            inventory.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <ActionButton
            type="button"
            variant="outline"
            disabled={isDeleting}
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
