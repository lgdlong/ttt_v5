import { useState, useEffect } from "react"
import { AdminLayout } from "./admin-layout"

const ADMIN_USER = "admin"
const ADMIN_PASS = "admin"

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated in session
    const authed = sessionStorage.getItem("admin_auth")
    if (authed === "true") {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

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
      setIsAuthenticated(true)
    } else {
      window.alert("Sai tài khoản hoặc mật khẩu")
      window.location.href = "/"
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
