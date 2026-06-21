import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteStore } from "../api/stores.queries";
import type { Store } from "../types/stores.types";

type DeleteStoreDialogProps = {
  store: Store | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteStoreDialog({
  store,
  open,
  onOpenChange,
}: DeleteStoreDialogProps) {
  const deleteStoreMutation = useDeleteStore();

  if (!store) return null;

  const targetStore = store;

  function handleDelete() {
      deleteStoreMutation.mutate(targetStore.id);
      onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Store</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{targetStore.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteStoreMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={deleteStoreMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            {deleteStoreMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}