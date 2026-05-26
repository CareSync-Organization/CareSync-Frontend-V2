import { useForm } from "@tanstack/react-form";

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
import { getFieldError } from "@/lib/get-field-error";

import {
  defaultPermissions,
  permissionConfigs,
} from "../config/user-permissions.config";
import { inviteUserSchema, type InviteUserValues } from "../schemas/invite-user.schema";
import type { TeamMember } from "../types/users.types";
import { PermissionRow } from "./PermissionRow";

export type InviteUserDialogProps = {
  open: boolean;
  mode: "invite" | "edit";
  member: TeamMember | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: InviteUserValues) => void;
};

export function InviteUserDialog({
  open,
  mode,
  member,
  onOpenChange,
  onSave,
}: InviteUserDialogProps) {
  const form = useForm({
    defaultValues: {
      email: member?.email ?? "",
      permissions: member?.permissions ?? defaultPermissions,
    },
    onSubmit: ({ value }) => onSave(value),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {mode === "edit" ? "Edit Permissions" : "Invite Team Member"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Adjust what this agent can access."
                : "Send an invite and set what this agent can access."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
            {mode === "invite" ? (
              <form.Field
                name="email"
                validators={{ onChange: inviteUserSchema.shape.email }}
              >
                {(field) => (
                  <TextInput
                    name={field.name}
                    label="Email Address"
                    placeholder="user@example.com"
                    type="email"
                    value={field.state.value}
                    error={getFieldError(field.state.meta.errors)}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            ) : null}

            <div>
              <p className="mb-1 text-sm font-medium">Permissions</p>
              <p className="text-xs text-muted-foreground">
                Choose what this agent can do in each section.
              </p>
              <div className="mt-2 divide-y rounded-xl border px-4">
                {permissionConfigs.map((config) => (
                  <form.Field
                    key={config.key}
                    name={`permissions.${config.key}`}
                  >
                    {(field) => (
                      <PermissionRow
                        config={config}
                        value={field.state.value}
                        onChange={field.handleChange}
                      />
                    )}
                  </form.Field>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-5 shrink-0">
            <DialogClose asChild>
              <ActionButton type="button" variant="outline">
                Cancel
              </ActionButton>
            </DialogClose>
            <ActionButton type="submit">
              {mode === "edit" ? "Save Changes" : "Send Invite"}
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
