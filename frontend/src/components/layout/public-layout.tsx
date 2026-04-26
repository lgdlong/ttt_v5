import { Link } from "react-router"
import { Sun, Moon, Play } from "lucide-react"
import { useDarkMode } from "@/hooks/use-dark-mode"

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/admin", label: "Quản trị" },
]

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex-none border-b bg-card/95 backdrop-blurSupports">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Play className="h-6 w-6 text-primary" />
              <span>TTT Video</span>
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
            </nav>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-md p-2 hover:bg-accent cursor-pointer transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}