import { useForm } from "@tanstack/react-form";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFieldError } from "@/lib/get-field-error";

import {
  userInfoSchema,
  type UserInfoValues,
} from "../../schemas/userInfo.schema";
import { toast } from "sonner";

export function AccountDetailsForm() {
  const form = useForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@acme-ecommerce.com",
    } satisfies UserInfoValues,
    onSubmit: async ({ value }) => {
      console.log("Saving account details:", value);
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

          <TextInput
            name="role"
            label="Role"
            value="Administrator"
            disabled
            className="cursor-not-allowed opacity-60"
          />

          <div className="flex justify-end gap-2 pt-2">
            <ActionButton type="button" variant="outline">
              Cancel
            </ActionButton>
            <ActionButton type="submit" onClick={() => toast.success("Account details saved")}>Save</ActionButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
