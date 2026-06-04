import { AccountDetailsForm } from "./AccountDetailsForm";
import { ProfilePicCard } from "./ProfilePicCard";

export function UserInfoPage() {
  return (
    <div className="space-y-6">
      <ProfilePicCard />
      <AccountDetailsForm />
    </div>
  );
}
