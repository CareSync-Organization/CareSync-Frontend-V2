import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFieldError } from "@/lib/get-field-error";
import { ApiError } from "@/lib/api";
import { useResetPassword } from "@/features/auth/api/auth.queries";
import {
  resetPassSchema,
  type ResetPassFormValues,
} from "@/features/auth/schemas/resetpass.schema";

export function ResetPassForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" } satisfies ResetPassFormValues,
    onSubmit: async ({ value }) => {
      setApiError(null);
      try {
        await resetPasswordMutation.mutateAsync({
          token,
          new_password: value.newPassword,
          confirm_password: value.confirmPassword,
        });
        toast.success("Password reset. Please sign in.");
        navigate({ to: "/login" });
      } catch (error) {
        if (error instanceof ApiError && error.status === 400) {
          setApiError("This link has expired or is invalid.");
        } else {
          setApiError("Something went wrong. Please try again.");
        }
      }
    },
  });

  return (
    <form
      className="grid gap-4 w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {apiError && (
        <Alert variant="destructive">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form.Field
        name="newPassword"
        validators={{ onChange: resetPassSchema.shape.newPassword }}
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
          onChangeListenTo: ["newPassword"],
        }}
      >
        {(field) => (
          <TextInput
            name={field.name}
            label="Confirm Password"
            isPassword
            placeholder="Confirm new password"
            value={field.state.value}
            error={getFieldError(field.state.meta.errors)}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <ActionButton
        type="submit"
        isLoading={resetPasswordMutation.isPending}
        loadingText="Resetting..."
      >
        Reset Password
      </ActionButton>
    </form>
  );
}
