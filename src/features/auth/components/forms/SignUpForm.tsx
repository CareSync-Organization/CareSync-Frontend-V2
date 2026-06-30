import { useForm } from "@tanstack/react-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailEdit01Icon, LockPasswordIcon, UserIcon } from "@hugeicons/core-free-icons";
import { ActionButton } from "@/components/shared/ActionButton";
import { TextInput } from "@/components/shared/forms/InputField";
import { AuthDivider } from "@/features/auth/components/AuthDivider";
import { GoogleIcon } from "@/features/auth/components/SocialIcons";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/social/login/google-oauth2/`;
import { signupSchema, type SignUpFormValues } from "@/features/auth/schemas/signup.schema";
import { getFieldError } from "@/lib/get-field-error";
import { CheckboxField } from "@/components/shared/forms/CheckboxField";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSignup } from "../../api/auth.queries";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getApiFieldError } from "@/lib/api";

type SignUpFormProps = {
  redirectTo?: string;
};

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false as boolean,
    } satisfies SignUpFormValues,
    onSubmit: async ({ value }) => {
      await signupMutation.mutateAsync({
        name: value.fullName,
        email: value.email,
        password: value.password,
        passwordConfirm: value.confirmPassword,
      });
      if (redirectTo) {
        window.location.assign(redirectTo);
      } else {
        navigate({ to: "/dashboard" });
      }
    },
  });

  const nameServerError = getApiFieldError(signupMutation.error, "name");
  const emailServerError = getApiFieldError(signupMutation.error, "email");
  const passwordServerError = getApiFieldError(signupMutation.error, "password");
  const confirmPasswordServerError = getApiFieldError(signupMutation.error, "password_confirm");

  return (
    <form
      className="grid gap-4 w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      {signupMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {signupMutation.error instanceof Error
              ? signupMutation.error.message
              : "Registration failed. Please check your inputs and try again."}
          </AlertDescription>
        </Alert>
      )}
      <form.Field name="fullName" validators={{ onChange: signupSchema.shape.fullName }}>
        {(field) => (
          <TextInput
            name={field.name}
            label="Full Name"
            placeholder="Enter your fullname"
            startIcon={<HugeiconsIcon icon={UserIcon} size={16} />}
            value={field.state.value}
            error={getFieldError(field.state.meta.errors) ?? nameServerError}
            onBlur={field.handleBlur}
            onChange={(event) => { signupMutation.reset(); field.handleChange(event.target.value); }}
          />
        )}
      </form.Field>
      <form.Field name="email" validators={{ onChange: signupSchema.shape.email }}>
        {(field) => (
          <TextInput
            name={field.name}
            label="Email"
            placeholder="you@example.com"
            startIcon={<HugeiconsIcon icon={MailEdit01Icon} size={16} />}
            value={field.state.value}
            error={getFieldError(field.state.meta.errors) ?? emailServerError}
            onBlur={field.handleBlur}
            onChange={(event) => { signupMutation.reset(); field.handleChange(event.target.value); }}
          />
        )}
      </form.Field>
      <form.Field name="password" validators={{ onChange: signupSchema.shape.password }}>
        {(field) => (
          <TextInput
            name={field.name}
            label="Password"
            isPassword
            type="password"
            placeholder="Enter your password"
            value={field.state.value}
            error={getFieldError(field.state.meta.errors) ?? passwordServerError}
            startIcon={<HugeiconsIcon icon={LockPasswordIcon} />}
            onBlur={field.handleBlur}
            onChange={(event) => { signupMutation.reset(); field.handleChange(event.target.value); }}
          />
        )}
      </form.Field>
      <form.Field
        name="confirmPassword"
        validators={{
          onChange: ({ value, fieldApi }) => {
            const password = fieldApi.form.getFieldValue("password");
            if (!value) return "Confirm your password";
            if (value !== password) return "Passwords do not match";
            return undefined;
          },
          onChangeListenTo: ["password"],
        }}
      >
        {(field) => (
          <TextInput
            name={field.name}
            label="Confirm Password"
            isPassword
            type="password"
            placeholder="Enter your password again"
            value={field.state.value}
            error={getFieldError(field.state.meta.errors) ?? confirmPasswordServerError}
            startIcon={<HugeiconsIcon icon={LockPasswordIcon} />}
            onBlur={field.handleBlur}
            onChange={(event) => { signupMutation.reset(); field.handleChange(event.target.value); }}
          />
        )}
      </form.Field>
      <form.Field name="acceptedTerms" validators={{ onChange: signupSchema.shape.acceptedTerms }}>
        {(field) => (
          <CheckboxField
            name={field.name}
            checked={field.state.value}
            onCheckedChange={(checked) => field.handleChange(checked)}
            onBlur={field.handleBlur}
            error={getFieldError(field.state.meta.errors)}
            label={
              <div>
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </div>
            }
          />
        )}
      </form.Field>
      <ActionButton type="submit" isLoading={signupMutation.isPending} loadingText="Creating Account...">
        Create Account
      </ActionButton>

      <AuthDivider>or sign up with</AuthDivider>

      <ActionButton
        startIcon={<GoogleIcon className="size-4" />}
        type="button"
        variant="outline"
        onClick={() => { window.location.href = GOOGLE_AUTH_URL; }}
      >
        Continue with Google
      </ActionButton>
      <p className="text-center">
        Already have an Account?{" "}
        <Link
          to="/login"
          search={redirectTo ? { redirect: redirectTo } : {}}
          className="font-semibold"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
