import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useSession } from "@/lib/auth-client"
import { AdminLayout } from "./admin-layout"
import { Center, Loader } from "@mantine/core"

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()

  const user = session?.user

  useEffect(() => {
    if (isPending) return

    if (!user) {
      // Not logged in — redirect to login
      navigate("/login", { replace: true })
      return
    }

    // Logged in but not admin — redirect to home
    if (user.role !== "admin") {
      navigate("/", { replace: true })
    }
  }, [isPending, user, navigate])

  // While session is loading
  if (isPending) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  // Not authenticated or not admin — render nothing (redirect happens via useEffect)
  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminLayout>{children}</AdminLayout>
}
