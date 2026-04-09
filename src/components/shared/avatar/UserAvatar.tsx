import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  imageUrl?: string;
  className?: string;
  fallbackClassName?: string;
};

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserAvatar({
  name,
  imageUrl,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("bg-primary text-primary-foreground", className)}>
      <AvatarImage src={imageUrl} alt={name} />
      <AvatarFallback
        className={cn(
          "bg-linear-to-b from-[#0F766E] to-[#14B8A6] font-semibold text-primary-foreground",
          fallbackClassName,
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
