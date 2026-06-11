import { AccountDetailsForm } from "./AccountDetailsForm";
import { ProfilePicCard } from "./ProfilePicCard";
import { useMe } from "@/features/auth/api/auth.queries";

export function UserInfoPage() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading account details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfilePicCard />
      <AccountDetailsForm user={user} />
    </div>
  );
}
