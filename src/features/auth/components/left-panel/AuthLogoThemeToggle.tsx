import { ThemeModeToggle } from "@/components/shared/ThemeModeToggle"
import { CareSyncLogoBadge } from "@/components/shared/brand/animated-caresync-logo-icon"

export function AuthLogoThemeToggle() {
  return (
    <div
      className="group flex w-fit items-center gap-3 rounded-2xl text-left outline-none"
    >
      <span className="relative">
        <CareSyncLogoBadge tone="light" motion="subtle" size={56} />
        <ThemeModeToggle className="absolute -right-2 -top-2 border-white/20 bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur hover:bg-white/25" />
      </span>

      <span className="min-w-0 text-white">
        <span className="block text-lg font-semibold leading-none tracking-tight">
          CareSync
        </span>
        <span className="mt-1 block text-xs leading-none text-white/72">
          Centralized Support Platform
        </span>
      </span>
    </div>
  )
}
