import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ActionButton } from "@/components/shared/ActionButton";

type CreateStoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (name: string) => Promise<void>;
}

export function CreateStoreDialog({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: CreateStoreDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await onSubmit(name);
      setName("");
    } catch (err) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create Store</DialogTitle>
            <DialogDescription>
              Provide a name for your sales channel store.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              required
              disabled={isPending}
              placeholder="e.g. Acme Clothing Store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-xl h-10"
            >
              Cancel
            </Button>
            <ActionButton
              type="submit"
              isLoading={isPending}
              loadingText="Creating..."
              className="rounded-xl h-10"
            >
              Create
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}