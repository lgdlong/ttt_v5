import { Link, useLocation } from "react-router"
import { LayoutDashboard, Video, Tags, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { VI } from "@/lib/constants"
import { useDarkMode } from "@/hooks/use-dark-mode"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Video", icon: Video },
  { href: "/admin/tags", label: VI.totalTags, icon: Tags },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [isDark, setIsDark] = useDarkMode()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="fixed left-0 top-0 z-40 h-screen w-[var(--sidebar-width)] border-r bg-card">
          <div className="flex h-16 items-center border-b px-4">
            <h1 className="text-lg font-semibold">TTT Video</h1>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>
        <div className="flex-1 ml-[var(--sidebar-width)]">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b bg-card px-6">
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
