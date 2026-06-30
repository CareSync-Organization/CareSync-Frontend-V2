import { SidebarTile } from "@/components/shared/navigation/sidebar/SidebarTile";
import {
  // Building01Icon,
  UserIcon,
  Robot01Icon,
  LockIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-4 w-54">
      {/* <SidebarTile
        styles="bg-gray-500 text-white"
        inactivePropsStyles="hover:bg-primary"
        activePropsStyles="bg-primary -translate-y-1 shadow-lg"
        tileText="Business Info"
        tileLink="/profile/businessinfo"
        icon={<HugeiconsIcon icon={Building01Icon} size={18} />}
      /> */}
      <SidebarTile
        styles="bg-gray-500 text-white"
        inactivePropsStyles="hover:bg-primary"
        activePropsStyles="bg-primary -translate-y-1 shadow-lg"
        tileText="User Info"
        tileLink="/profile/userinfo"
        icon={<HugeiconsIcon icon={UserIcon} size={18} />}
      />
      <SidebarTile
        styles="bg-gray-500 text-white"
        inactivePropsStyles="hover:bg-primary"
        activePropsStyles="bg-primary -translate-y-1 shadow-lg"
        tileText="AI Configuration"
        tileLink="/profile/aiconfig"
        icon={<HugeiconsIcon icon={Robot01Icon} size={18} />}
      />
      <SidebarTile
        styles="bg-gray-500 text-white "
        inactivePropsStyles="hover:bg-primary"
        activePropsStyles="bg-primary -translate-y-1 shadow-lg"
        tileText="Privacy & Security"
        tileLink="/profile/privacy"
        icon={<HugeiconsIcon icon={LockIcon} size={18} />}
      />
      <SidebarTile
        styles="bg-gray-500 text-white"
        inactivePropsStyles="hover:bg-primary"
        activePropsStyles="bg-primary -translate-y-1 shadow-lg"
        tileText="Billing & Payments"
        tileLink="/profile/billing"
        icon={<HugeiconsIcon icon={CreditCardIcon} size={18} />}
      />
    </div>
  );
}
