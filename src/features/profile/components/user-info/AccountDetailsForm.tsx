import { useForm } from "@tanstack/react-form";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFieldError } from "@/lib/get-field-error";

import {
  userInfoSchema,
  type UserInfoValues,
} from "../../schemas/userInfo.schema";
import type { User } from "@/features/auth/types/auth.types";

import { useUpdateMe } from "@/features/auth/api/auth.queries";

export function AccountDetailsForm({ user }: { user?: User }) {
  const updateMeMutation = useUpdateMe();
  const name = user?.name ?? "";
  const lastSpaceIdx = name.lastIndexOf(" ");
  const initialFirstName = lastSpaceIdx >= 0 ? name.slice(0, lastSpaceIdx) : name;
  const initialLastName = lastSpaceIdx >= 0 ? name.slice(lastSpaceIdx + 1) : "";

  const form = useForm({
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      email: user?.email ?? "",
    } satisfies UserInfoValues,
    onSubmit: async ({ value }) => {
      const fullName = `${value.firstName} ${value.lastName}`.trim();
      try {
        await updateMeMutation.mutateAsync({
          name: fullName,
          email: value.email,
        });
      } catch (err) {
        // Error toast is handled in mutation
      }
    },
  });

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your personal account information
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
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="firstName"
              validators={{ onChange: userInfoSchema.shape.firstName }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="First Name"
                  placeholder="John"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>

            <form.Field
              name="lastName"
              validators={{ onChange: userInfoSchema.shape.lastName }}
            >
              {(field) => (
                <TextInput
                  name={field.name}
                  label="Last Name"
                  placeholder="Doe"
                  value={field.state.value}
                  error={getFieldError(field.state.meta.errors)}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </form.Field>
          </div>

          <form.Field
            name="email"
            validators={{ onChange: userInfoSchema.shape.email }}
          >
            {(field) => (
              <TextInput
                name={field.name}
                label="Email Address"
                type="email"
                placeholder="john.doe@example.com"
                value={field.state.value}
                error={getFieldError(field.state.meta.errors)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <ActionButton
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={updateMeMutation.isPending}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              isLoading={updateMeMutation.isPending}
              loadingText="Saving..."
            >
              Save
            </ActionButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
