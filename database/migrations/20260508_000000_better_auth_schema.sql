-- +goose Up
-- +goose StatementBegin

CREATE TABLE "users" (
    "id" character varying(255) PRIMARY KEY NOT NULL,
    "email" character varying(255) NOT NULL UNIQUE,
    "email_verified" boolean DEFAULT false NOT NULL,
    "name" character varying(255),
    "image" character varying(255),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "sessions" (
    "id" character varying(255) PRIMARY KEY NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "token" character varying(255) NOT NULL UNIQUE,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "ip_address" character varying(255),
    "user_agent" character varying(255),
    "user_id" character varying(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "accounts" (
    "id" character varying(255) PRIMARY KEY NOT NULL,
    "account_id" character varying(255) NOT NULL,
    "provider_id" character varying(255) NOT NULL,
    "user_id" character varying(255) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "access_token" text,
    "refresh_token" text,
    "id_token" text,
    "access_token_expires_at" timestamp with time zone,
    "refresh_token_expires_at" timestamp with time zone,
    "scope" text,
    "password" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE("provider_id", "account_id")
);

CREATE TABLE "verification" (
    "id" character varying(255) PRIMARY KEY NOT NULL,
    "identifier" character varying(255) NOT NULL,
    "value" character varying(255) NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "accounts";
DROP TABLE IF EXISTS "sessions";
DROP TABLE IF EXISTS "users";

-- +goose StatementEnd