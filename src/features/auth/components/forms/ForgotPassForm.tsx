import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailEdit01Icon } from "@hugeicons/core-free-icons";
import { Link } from "@tanstack/react-router";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import {
  forgotPassSchema,
  type ForgotPassFormValues,
} from "@/features/auth/schemas/forgotpass.schema";
import { getFieldError } from "@/lib/get-field-error";

export function ForgotPassForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: { email: "" } satisfies ForgotPassFormValues,
    onSubmit: async () => {
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <div className="grid gap-4 w-full max-w-sm text-center">
        <div className="grid place-items-center size-14 rounded-full bg-primary/10 mx-auto">
          <HugeiconsIcon icon={MailEdit01Icon} size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Check your inbox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a password reset link to your email. It expires in 15 minutes.
          </p>
        </div>
        <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{ onChange: forgotPassSchema.shape.email }}
      >
        {(field) => (
          <TextInput
            name={field.name}
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={field.state.value}
            error={getFieldError(field.state.meta.errors)}
            startIcon={<HugeiconsIcon icon={MailEdit01Icon} size={16} />}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      <ActionButton type="submit">Send Reset Link</ActionButton>
      <p className="text-center text-sm">
        Remember your password?{" "}
        <Link to="/login" className="font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
