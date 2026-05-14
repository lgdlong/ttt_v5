import { useState, useEffect } from "react"
import { AdminLayout } from "./admin-layout"

const ADMIN_USER = "admin"
const ADMIN_PASS = "admin"

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return sessionStorage.getItem("admin_auth") === "true"
  })
  const [isLoading, setIsLoading] = useState(!isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) return

    // Show login prompt
    const user = window.prompt("Username:")
    if (!user) {
      window.location.href = "/"
      return
    }

    const pass = window.prompt("Password:")
    if (!pass) {
      window.location.href = "/"
      return
    }

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("admin_auth", "true")
      setTimeout(() => {
        setIsAuthenticated(true)
        setIsLoading(false)
      }, 0)
    } else {
      window.alert("Sai tài khoản hoặc mật khẩu")
      window.location.href = "/"
    }
  }, [isAuthenticated])

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
