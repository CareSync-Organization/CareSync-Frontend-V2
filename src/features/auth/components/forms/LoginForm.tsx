import { useForm } from "@tanstack/react-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, MailEdit01Icon } from "@hugeicons/core-free-icons";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { getFieldError } from "@/lib/get-field-error";
import { GoogleIcon, MicrosoftIcon } from "../SocialIcons";
import { Link } from "@tanstack/react-router";
import { useSignin } from "../../api/auth.queries";
import { useNavigate } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const signinMutation = useSignin()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: { email: "", password: "" } satisfies LoginFormValues,
    onSubmit: async ({ value }) => {
      await signinMutation.mutateAsync(value);
      navigate({ to: "/dashboard"})
    },
  });
  return (
    <form
      className="grid gap-4 w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      {signinMutation.isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {signinMutation.error instanceof Error
              ? signinMutation.error.message
              : "Invalid credentials. Please try again."}
          </AlertDescription>
        </Alert>
      ) : null}
      <form.Field
        name="email"
        validators={{
          onChange: loginSchema.shape.email,
        }}
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
            onChange={(event) => {signinMutation.reset(); field.handleChange(event.target.value)}}
          />
        )}
      </form.Field>
      <form.Field
        name="password"
        validators={{
          onChange: loginSchema.shape.password,
        }}
      >
        {(field) => (
          <TextInput
            name={field.name}
            label="Password"
            isPassword
            type="password"
            placeholder="Enter your password"
            value={field.state.value}
            error={getFieldError(field.state.meta.errors)}
            startIcon={<HugeiconsIcon icon={LockPasswordIcon} />}
            onBlur={field.handleBlur}
            onChange={(event) => {
              signinMutation.reset();
              field.handleChange(event.target.value);
            }}
          />
        )}
      </form.Field>
      <div className="mt-2 flex justify-end">
        <Link to="/forget-password" className="text-sm font-medium hover:underline">
          Forgot password?
        </Link>
      </div>
      <ActionButton type="submit" isLoading={signinMutation.isPending} loadingText="Signing In...">Sign In</ActionButton>

      <AuthDivider>or continue with</AuthDivider>

      <ActionButton
        startIcon={<GoogleIcon className="size-4" />}
        type="button"
        variant={"outline"}
      >
        Continue with Google
      </ActionButton>
      <ActionButton
        startIcon={<MicrosoftIcon className="size-4" />}
        type="button"
        variant={"outline"}
      >
        Continue with Microsoft 365
      </ActionButton>
      <p className="text-center">Don't have an account? <Link to="/signup" className="font-semibold">Sign Up</Link></p>
    </form>
  );
}
