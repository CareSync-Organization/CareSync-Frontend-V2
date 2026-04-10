import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

type ThemeMode = "light" | "dark" | "system"

const themeOrder = ["system", "light", "dark"] satisfies ThemeMode[]

function getNextTheme(theme: string | undefined): ThemeMode {
  const currentTheme = themeOrder.includes(theme as ThemeMode)
    ? (theme as ThemeMode)
    : "system"

  const currentIndex = themeOrder.indexOf(currentTheme)

  return themeOrder[(currentIndex + 1) % themeOrder.length]
}

function ThemeModeIcon({ theme }: { theme: string | undefined }) {
  if (theme === "light") return <Sun className="size-3.5" />
  if (theme === "dark") return <Moon className="size-3.5" />

  return <Monitor className="size-3.5" />
}

type ThemeModeToggleProps = {
  className?: string
}

export function ThemeModeToggle({ className }: ThemeModeToggleProps) {
  const { theme, setTheme } = useTheme()

  function handleThemeChange() {
    setTheme(getNextTheme(theme))
  }

  return (
    <button
      type="button"
      className={cn(
        "grid size-6 cursor-pointer place-items-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/35",
        className,
      )}
      aria-label={`Change theme. Current theme: ${theme ?? "system"}`}
      title={`Theme: ${theme ?? "system"}`}
      onClick={handleThemeChange}
    >
      <ThemeModeIcon theme={theme} />
    </button>
  )
}
