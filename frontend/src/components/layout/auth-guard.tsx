import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useSession } from "@/lib/auth-client"
import { Center, Loader } from "@mantine/core"

export function AuthGuard({ children }: { children: React.ReactNode }) {
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
  }, [isPending, user, navigate])

  // While session is loading
  if (isPending) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    )
  }

  // Not authenticated — render nothing (redirect happens via useEffect)
  if (!user) {
    return null
  }

  return <>{children}</>
}
