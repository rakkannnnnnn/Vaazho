import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("vazho-theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = !isDark

    setIsDark(nextTheme)

    if (nextTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("vazho-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("vazho-theme", "light")
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  )
}

export default ThemeToggle