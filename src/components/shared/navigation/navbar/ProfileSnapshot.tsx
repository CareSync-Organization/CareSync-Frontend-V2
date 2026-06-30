import { Link } from "@tanstack/react-router";

import { UserAvatar } from "@/components/shared/avatar/UserAvatar";

type ProfileSnapshotProps = {
  name?: string;
  role?: string;
  imageUrl?: string;
};

export function ProfileSnapshot({
  name = "John Doe",
  role = "Admin",
  imageUrl,
}: ProfileSnapshotProps) {
  return (
    <Link
      to="/profile/userinfo"
      className="flex items-center gap-3 no-underline hover:no-underline"
    >
      <UserAvatar name={name} imageUrl={imageUrl} className="size-11" />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{role}</p>
      </div>
    </Link>
  );
}
