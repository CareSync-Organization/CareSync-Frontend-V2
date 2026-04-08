import { Search } from "lucide-react";

import { TextInput } from "@/components/shared/forms/InputField";
import { cn } from "@/lib/utils";

type SearchInputProps = React.ComponentProps<typeof TextInput> & {
  containerClassName?: string;
};

export function SearchInput({
  className,
  containerClassName,
  startIcon,
  type = "search",
  ...props
}: SearchInputProps) {
  return (
    <div className={containerClassName}>
      <TextInput
        type={type}
        className={cn(className)}
        startIcon={
          startIcon ?? <Search className="size-4 text-muted-foreground" />
        }
        {...props}
      />
    </div>
  );
}
