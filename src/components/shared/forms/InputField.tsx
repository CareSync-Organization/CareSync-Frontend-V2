import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashFreeIcons } from "@hugeicons/core-free-icons";

type TextInputProps = React.ComponentProps<typeof InputGroupInput> & {
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
};

export function TextInput({
  id,
  label,
  startIcon,
  endIcon,
  error,
  isPassword,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isInvalid = Boolean(error);
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : props.type;
  const resolvedEndIcon = isPassword ? null : endIcon

  return (
    
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
      <InputGroup className="h-11">
        <InputGroupInput
          id={inputId}
          aria-invalid={isInvalid}
          {...props}
          type={inputType}
        />
        {startIcon ? <InputGroupAddon>{startIcon}</InputGroupAddon> : null}
        {resolvedEndIcon ? (
          <InputGroupAddon align="inline-end">{resolvedEndIcon}</InputGroupAddon>
        ) : null}
        {isPassword ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <HugeiconsIcon icon={ViewIcon} />
              ) : (
                <HugeiconsIcon icon={ViewOffSlashFreeIcons} />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
