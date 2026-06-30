import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, MailEdit01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";
import { getFieldError } from "@/lib/get-field-error";
import { GoogleIcon } from "../SocialIcons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSignin } from "../../api/auth.queries";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/social/login/google-oauth2/`;

type LoginFormProps = {
  redirectTo?: string;
  socialAuthFailed?: boolean;
};

export function LoginForm({ redirectTo, socialAuthFailed }: LoginFormProps) {
  const signinMutation = useSignin();
  const navigate = useNavigate();

  useEffect(() => {
    if (socialAuthFailed) {
      toast.error("Google sign-in failed. Please try again or use email and password.");
    }
  }, [socialAuthFailed]);

  const form = useForm({
    defaultValues: { email: "", password: "" } satisfies LoginFormValues,
    onSubmit: async ({ value }) => {
      await signinMutation.mutateAsync(value);
      if (redirectTo) {
        window.location.assign(redirectTo);
      } else {
        navigate({ to: "/dashboard" });
      }
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
      <form.Field name="email" validators={{ onChange: loginSchema.shape.email }}>
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
            onChange={(event) => { signinMutation.reset(); field.handleChange(event.target.value); }}
          />
        )}
      </form.Field>
      <form.Field name="password" validators={{ onChange: loginSchema.shape.password }}>
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
      <ActionButton type="submit" isLoading={signinMutation.isPending} loadingText="Signing In...">
        Sign In
      </ActionButton>

      <AuthDivider>or continue with</AuthDivider>

      <ActionButton
        startIcon={<GoogleIcon className="size-4" />}
        type="button"
        variant="outline"
        onClick={() => { window.location.href = GOOGLE_AUTH_URL; }}
      >
        Continue with Google
      </ActionButton>
      <p className="text-center">
        Don't have an account?{" "}
        <Link
          to="/signup"
          search={redirectTo ? { redirect: redirectTo } : {}}
          className="font-semibold"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
