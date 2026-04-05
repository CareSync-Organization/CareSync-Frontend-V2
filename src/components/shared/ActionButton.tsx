import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonProps = React.ComponentProps<typeof Button> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
};

export function ActionButton({
  children,
  className,
  startIcon,
  endIcon,
  isLoading = false,
  loadingText,
  fullWidth = false,
  disabled,
  type="button",
  ...props
}: ActionButtonProps) {
    return (
        <Button
        type={type}
        disabled={disabled || isLoading}
        className={cn("h-11", fullWidth && "w-full", className)}
        {...props}>
            {isLoading ? (
            <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />) : startIcon ? (
                <span data-icon="inline-start" className="flex items-center">{startIcon}
                </span>
            ) : null}
            {isLoading && loadingText ? loadingText : children}
            {!isLoading && endIcon ? (
                <span data-icon="inline-end" className="flex items-center">{endIcon}
                </span>
            ) : null}
        </Button>
    )

}
