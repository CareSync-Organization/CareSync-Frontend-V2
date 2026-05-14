import { useForm } from "@tanstack/react-form";

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
import {
  addStoreSchema,
  type AddStoreFormValues,
} from "@/features/connectors/schemas/add-store.schema";

type AddStoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddStoreDialog({ open, onOpenChange }: AddStoreDialogProps) {
  const form = useForm({
    defaultValues: {
      storeName: "",
      industry: "",
      description: "",
    } satisfies AddStoreFormValues,
    onSubmit: ({ value }) => {
      console.log("create store", value);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Add Store</DialogTitle>
            <DialogDescription>
              Create a separate workspace for another brand, store, or business
              unit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <form.Field
              name="storeName"
              validators={{ onChange: addStoreSchema.shape.storeName }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Store name"
                  placeholder="Clothing Store"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>

            <form.Field
              name="industry"
              validators={{ onChange: addStoreSchema.shape.industry }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Store type / industry"
                  placeholder="Fashion, electronics, home goods..."
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <TextareaField
                  name={field.name}
                  label="Description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Optional notes for your team"
                />
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <ActionButton type="button" variant="outline">
                Cancel
              </ActionButton>
            </DialogClose>

            <ActionButton type="submit">Create Store</ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
