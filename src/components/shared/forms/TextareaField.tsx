import { useId } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type TextareaFieldProps = React.ComponentProps<typeof Textarea> & {
  label?: string;
  error?: string;
};

export function TextareaField({
  id,
  label,
  error,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isInvalid = Boolean(error);

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
      <Textarea id={inputId} aria-invalid={isInvalid} {...props} />
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
