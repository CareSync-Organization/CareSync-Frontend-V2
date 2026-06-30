import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/shared/ActionButton";
import type { InventoryItem } from "../types/inventory.types";

type UpdateStockDialogProps = {
  item: InventoryItem | null;
  open: boolean;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (available: number) => void;
};

export function UpdateStockDialog({
  item,
  open,
  isSaving,
  onOpenChange,
  onConfirm,
}: UpdateStockDialogProps) {
  const [value, setValue] = useState<string>("");

  function handleOpenChange(open: boolean) {
    if (!isSaving) {
      if (!open) setValue("");
      onOpenChange(open);
    }
  }

  function handleConfirm() {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) return;
    onConfirm(parsed);
  }

  const parsed = parseInt(value, 10);
  const isValid = !Number.isNaN(parsed) && parsed >= 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Shopify Stock</DialogTitle>
          <DialogDescription>
            Set the available quantity for{" "}
            <span className="font-medium text-foreground">{item?.name}</span>.
            This will update Shopify first, the local record updates only after
            Shopify confirms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Current quantity: <span className="font-medium text-foreground">{item?.quantity}</span>
          </p>
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="New quantity"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isSaving}
            className="h-11"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) handleConfirm();
            }}
          />
          {value !== "" && !isValid ? (
            <p className="text-xs text-destructive">
              Enter a whole number of 0 or more.
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <ActionButton
            type="button"
            isLoading={isSaving}
            loadingText="Updating…"
            disabled={!isValid}
            onClick={handleConfirm}
          >
            Update stock
          </ActionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
