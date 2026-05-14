import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:8081",
    basePath: "/api/v1/auth",
    plugins: [adminClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient;
