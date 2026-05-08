import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { createAuthDatabase } from "../database/kysely-auth-adapter.js";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const result = config({
  path: path.resolve(__dirname, "../../.env"),
  override: false,
});
dotenvExpand.expand(result);
if (result.parsed) {
  for (const [key, value] of Object.entries(result.parsed)) {
    process.env[key] = value;
  }
}

let _auth: ReturnType<typeof betterAuth> | undefined;

export function createAuthInstance() {
  if (!_auth) {
    const db = createAuthDatabase();
    _auth = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8081",
      basePath: "/api/v1/auth",
      database: kyselyAdapter(db, {
        type: "postgres",
        usePlural: true,
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        autoSignIn: true,
      },
      emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
          // TODO: Integrate email service (Resend, SendGrid, etc.)
          console.log(`[Email Verification] To: ${user.email}\nURL: ${url}`);
        },
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
      },
      session: {
        fields: {
          expiresAt: "expires_at",
          createdAt: "created_at",
          updatedAt: "updated_at",
          ipAddress: "ip_address",
          userAgent: "user_agent",
          userId: "user_id",
        },
        updateAge: 86400,
        deferSessionRefresh: true,
      },
      user: {
        fields: {
          emailVerified: "email_verified",
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
        deleteUser: {
          enabled: true,
        },
      },
      account: {
        fields: {
          userId: "user_id",
          accountId: "account_id",
          providerId: "provider_id",
          createdAt: "created_at",
          updatedAt: "updated_at",
          accessToken: "access_token",
          refreshToken: "refresh_token",
          idToken: "id_token",
          accessTokenExpiresAt: "access_token_expires_at",
          refreshTokenExpiresAt: "refresh_token_expires_at",
          scope: "scope",
          password: "password",
        },
      },
      verification: {
        fields: {
          identifier: "identifier",
          value: "value",
          expiresAt: "expires_at",
          createdAt: "created_at",
          updatedAt: "updated_at",
        },
      },
    });
  }
  return { auth: _auth };
}

export type Auth = ReturnType<typeof betterAuth>;
