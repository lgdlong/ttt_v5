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

let _auth: ReturnType<typeof betterAuth> | undefined;

export function createAuthInstance() {
  if (!_auth) {
    const db = createAuthDatabase();
    _auth = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
      database: kyselyAdapter(db, {
        type: "postgres",
        usePlural: true,
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
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
        updateAge: 86400,
        deferSessionRefresh: true,
      },
      user: {
        deleteUser: {
          enabled: true,
        },
      },
    });
  }
  return { auth: _auth };
}

export type Auth = ReturnType<typeof betterAuth>;