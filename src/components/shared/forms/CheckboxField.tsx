import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type CheckboxFieldProps = {
  id?: string;
  name?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onBlur?: () => void;
  label: ReactNode;
  error?: string;
  disabled?: boolean;
};

export function CheckboxField({
  id,
  name,
  checked,
  onCheckedChange,
  onBlur,
  label,
  error,
  disabled,
}: CheckboxFieldProps) {
  const inputId = id ?? name;
  const isInvalid = Boolean(error);

  return (
    <Field data-invalid={isInvalid} data-disabled={disabled}>
      <div className="flex items-start gap-2">
        <Checkbox
          id={inputId}
          name={name}
          checked={checked}
          disabled={disabled}
          aria-invalid={isInvalid}
          onBlur={onBlur}
          onCheckedChange={(value) => {
            onCheckedChange(value === true);
          }}
        />

        <FieldLabel
          htmlFor={inputId}
          className="text-sm font-normal leading-5 text-muted-foreground"
        >
          {label}
        </FieldLabel>
      </div>

      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
