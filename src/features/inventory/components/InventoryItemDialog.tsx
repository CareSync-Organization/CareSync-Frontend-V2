import { useForm } from "@tanstack/react-form";
import { Wand2 } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { TextareaField } from "@/components/shared/forms/TextareaField";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFieldError } from "@/lib/get-field-error";

import { inventoryItemSchema } from "../schemas/inventory-item.schema";
import type { InventoryItem, InventoryItemFormValues } from "../types/inventory.types";

function generateSku(name: string, category: string): string {
  const cleanName = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const cleanCategory = category.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const first = cleanName[0] ?? "X";
  const last = cleanName[cleanName.length - 1] ?? "X";
  const catFirst = cleanCategory[0] ?? "X";
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `${first}${catFirst}${last}${num}`;
}

export type InventoryItemDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  item: InventoryItem | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: InventoryItemFormValues) => void;
  isSaving?: boolean;
};

export function InventoryItemDialog({
  open,
  mode,
  item,
  onOpenChange,
  onSave,
  isSaving = false,
}: InventoryItemDialogProps) {
  const form = useForm({
    defaultValues: {
      name: item?.name ?? "",
      sku: item?.sku ?? "",
      category: item?.category ?? "",
      price: item?.price ?? 0,
      quantity: item?.quantity ?? 0,
      description: item?.description ?? "",
    } satisfies InventoryItemFormValues,
    onSubmit: ({ value }) => onSave(value),
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
              {mode === "edit" ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              Manual inventory items are used for channels without native stock
              sync.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="name"
              validators={{ onChange: inventoryItemSchema.shape.name }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Product Name"
                  placeholder="e.g., Classic White T-Shirt"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>

            <form.Field
              name="category"
              validators={{ onChange: inventoryItemSchema.shape.category }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Category"
                  placeholder="e.g., Clothing"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>

            <form.Field
              name="sku"
              validators={{ onChange: inventoryItemSchema.shape.sku }}
            >
              {(field) => (
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2">
                  <TextInput
                    name={field.name}
                    label="Product Code / SKU"
                    placeholder="e.g., CCT347"
                    value={field.state.value}
                    error={getFieldError(field.state.meta.errors)}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <ActionButton
                    type="button"
                    variant="outline"
                    startIcon={<Wand2 className="size-4" />}
                    onClick={() => {
                      const name = form.getFieldValue("name");
                      const category = form.getFieldValue("category");
                      if (!name.trim() || !category.trim()) return;
                      form.setFieldValue("sku", generateSku(name, category));
                    }}
                  >
                    Generate
                  </ActionButton>
                </div>
              )}
            </form.Field>

            <form.Field
              name="price"
              validators={{ onChange: inventoryItemSchema.shape.price }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Price ($)"
                  type="number"
                  min={0}
                  step="0.01"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="quantity"
              validators={{ onChange: inventoryItemSchema.shape.quantity }}
            >
              {(field) => (
                <div className="sm:col-span-2">
                  <TextInput
                    name={field.name}
                    label="Quantity"
                    type="number"
                    min={0}
                    step={1}
                    value={field.state.value}
                    error={getFieldError(field.state.meta.errors)}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <div className="sm:col-span-2">
                  <TextareaField
                    name={field.name}
                    label="Description (Optional)"
                    placeholder="Enter product description..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    className="min-h-28"
                  />
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
            <ActionButton type="submit" isLoading={isSaving} loadingText="Saving...">
              {mode === "edit" ? "Save Changes" : "Add Product"}
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
