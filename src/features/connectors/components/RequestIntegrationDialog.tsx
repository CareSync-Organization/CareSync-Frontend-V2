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
  requestIntegrationSchema,
  type RequestIntegrationFormValues,
} from "@/features/connectors/schemas/request-integration.schema";

type RequestIntegrationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RequestIntegrationDialog({
  open,
  onOpenChange,
}: RequestIntegrationDialogProps) {
  const form = useForm({
    defaultValues: {
      platformName: "",
      useCase: "",
      contactEmail: "",
    } satisfies RequestIntegrationFormValues,
    onSubmit: ({ value }) => {
      const subject = encodeURIComponent(`Integration Request: ${value.platformName}`);
      const body = encodeURIComponent(
        `Platform: ${value.platformName}\n\nUse case:\n${value.useCase}\n\nContact email: ${value.contactEmail}`,
      );
      window.location.href = `mailto:junaidjaffery1@gmail.com?subject=${subject}&body=${body}`;
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
            <DialogTitle>Request Integration</DialogTitle>
            <DialogDescription>
              Tell us which platform your team needs next. This demo submit will
              later become a backend ticket or email workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <form.Field
              name="platformName"
              validators={{
                onChange: requestIntegrationSchema.shape.platformName,
              }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Platform name"
                  placeholder="Amazon, TikTok Shop, WooCommerce..."
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>

            <form.Field
              name="useCase"
              validators={{
                onChange: requestIntegrationSchema.shape.useCase,
              }}
            >
              {(field) => (
                <TextareaField
                  name={field.name}
                  label="Use case"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="What should CareSync sync, automate, or monitor?"
                />
              )}
            </form.Field>

            <form.Field
              name="contactEmail"
              validators={{
                onChange: requestIntegrationSchema.shape.contactEmail,
              }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Contact email"
                  type="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
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
            <ActionButton type="submit">Submit Request</ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
