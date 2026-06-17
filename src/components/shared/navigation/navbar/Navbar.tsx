import { ThemeModeToggle } from "@/components/shared/ThemeModeToggle"
import { ProfileSnapshot } from "./ProfileSnapshot"
import { StoreSwitcher } from "./StoreSwitcher"
import { NotificationPopover } from "./NotificationsPopover"
import { MobileDrawer } from "@/components/shared/navigation/mobile-drawer/drawer"
import { CareSyncLogoBadge } from "../../brand/animated-caresync-logo-icon"
import { UserAvatar } from "../../avatar/UserAvatar"
import { useMe } from "@/features/auth/api/auth.queries";

export function Navbar() {
  const { data: user } = useMe();
  const userName = user?.name ?? "Guest User";

  return (
<header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
  <MobileDrawer />

  {/* mobile center */}
  <CareSyncLogoBadge size={38} tone="light" interactive={false} className="md:hidden bg-linear-to-b from-[#0F766E] to-[#14B8A6]" />

  {/* desktop left */}
  <div className="hidden md:block">
    <ProfileSnapshot name={userName} role="Merchant" />
  </div>

  {/* desktop right */}
  <div className="items-center gap-3 hidden md:flex">
    <ThemeModeToggle className="size-9 border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 dark:border-primary/30 dark:bg-primary/20" />
    <NotificationPopover />
    <StoreSwitcher />
  </div>

  {/* mobile right */}
  <div className="flex items-center md:hidden">
    <UserAvatar name={userName} className="size-8 cursor-pointer" />
  </div>
</header>

  )
}
