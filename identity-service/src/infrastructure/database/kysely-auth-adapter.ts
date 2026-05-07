import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export interface AuthTables {
  user: {
    id: string;
    email: string;
    email_verified: boolean;
    name: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
  };
  session: {
    id: string;
    expires_at: string;
    token: string;
    created_at: string;
    updated_at: string;
    ip_address: string | null;
    user_agent: string | null;
    user_id: string;
  };
  account: {
    id: string;
    account_id: string;
    provider_id: string;
    user_id: string;
    access_token: string | null;
    refresh_token: string | null;
    id_token: string | null;
    access_token_expires_at: string | null;
    refresh_token_expires_at: string | null;
    scope: string | null;
    password: string | null;
    created_at: string;
    updated_at: string;
  };
  verification: {
    id: string;
    identifier: string;
    value: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
  };
}

export type AuthDatabase = Kysely<AuthTables>;

export function createAuthDatabase(): AuthDatabase {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  return new Kysely<AuthTables>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
      }),
    }),
  });
}
