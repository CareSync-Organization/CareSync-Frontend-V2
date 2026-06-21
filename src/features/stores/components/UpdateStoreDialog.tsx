import { useEffect, useState } from "react";
import type { Store } from "../types/stores.types";
import { useUpdateStore } from "../api/stores.queries";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/shared/ActionButton";

type UpdateStoreDialogProps = {
    store:  Store | null;
    open: boolean;
    onOpenChange: (open: boolean) => void
}


export function UpdateStoreDialog({store, open, onOpenChange}: UpdateStoreDialogProps) {
    const [name, setName] = useState("")
    const updateStoreMutation = useUpdateStore()
      useEffect(() => {
    if (store && open) {
      setName(store.name);
    }
  }, [store, open]);

    if (!store) return null;
    const targetStore = store

    const trimmedName = name.trim()
    const isUnchanged = trimmedName === targetStore.name
    const isSubmitDisabled = !trimmedName || isUnchanged || updateStoreMutation.isPending
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (isSubmitDisabled) return;

  updateStoreMutation.mutate({
    storeId: targetStore.id,
    name: trimmedName,
  });

  onOpenChange(false);
}
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Rename Store</DialogTitle>
                        <DialogDescription>
                            Update the display name of this store
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                    autoFocus
                    disabled={updateStoreMutation.isPending}
                    placeholder="eg. Nike Clothing Store"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-10 rounded-xl"
                    />
                    <DialogFooter>
                        <Button
                        type="button"
                        variant="outline"
                        disabled={updateStoreMutation.isPending}
                        onClick={() => onOpenChange(false)}
                        className="h-10 rounded-xl"
                        >Cancel</Button>
                        <ActionButton
                        type="submit"
                        disabled={isSubmitDisabled}
                        isLoading={updateStoreMutation.isPending}
                        loadingText="Updating Store Name..."
                        className="h-10 rounded-xl"
                        >Save</ActionButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}