import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches)
    }

    query.addEventListener("change", handleChange)

    return () => {
      query.removeEventListener("change", handleChange)
    }
  }, [])

  return prefersDark
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const prefersDark = usePrefersDark()
  const isDark = theme === "dark" || (theme === "system" && prefersDark)
  const nextTheme = isDark ? "light" : "dark"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(nextTheme)}
          aria-label={`Switch to ${nextTheme} theme`}
        >
          {isDark ? (
            <SunIcon aria-hidden="true" />
          ) : (
            <MoonIcon aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Switch to {nextTheme} theme</TooltipContent>
    </Tooltip>
  )
}
