import { Link } from "react-router"
import { Sun, Moon } from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/admin", label: "Quản trị" },
]

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold">
            TTT Video
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}