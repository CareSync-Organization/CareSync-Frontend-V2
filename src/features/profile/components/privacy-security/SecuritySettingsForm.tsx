import { useForm } from "@tanstack/react-form";
import { Info } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFieldError } from "@/lib/get-field-error";

import {
  securitySchema,
  type SecurityFormValues,
} from "../../schemas/security.schema";
import { toast } from "sonner";

export function SecuritySettingsForm() {
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    } satisfies SecurityFormValues,
    onSubmit: async ({ value }) => {
      console.log("Updating password:", value);
    },
  });

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Update your password and manage security preferences
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="currentPassword"
            validators={{ onChange: securitySchema.shape.currentPassword }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="Current Password"
                isPassword
                placeholder="Enter current password"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{ onChange: securitySchema.shape.newPassword }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="New Password"
                isPassword
                placeholder="Enter new password"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) => {
                const newPassword = fieldApi.form.getFieldValue("newPassword");
                if (value && value !== newPassword) return "Passwords don't match";
                return undefined;
              },
            }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="Confirm New Password"
                isPassword
                placeholder="Confirm new password"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long and include uppercase,
              lowercase, numbers, and special characters.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <ActionButton type="submit" onClick={() => toast.success("Password updated")}>Update Password</ActionButton>
            <ActionButton type="button" variant="outline">
              Cancel
            </ActionButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
