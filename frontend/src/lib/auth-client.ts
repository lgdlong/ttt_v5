import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:8081",
    basePath: "/api/v1/auth"
})

export const { signIn, signUp, signOut, useSession } = authClient;
