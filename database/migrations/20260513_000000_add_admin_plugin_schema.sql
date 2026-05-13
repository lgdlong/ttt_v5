-- +goose Up
-- +goose StatementBegin
ALTER TABLE "users" 
ADD COLUMN "role" character varying(255) DEFAULT 'user',
ADD COLUMN "banned" boolean DEFAULT false,
ADD COLUMN "ban_reason" text,
ADD COLUMN "ban_expires" timestamp with time zone;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "users" 
DROP COLUMN IF EXISTS "role",
DROP COLUMN IF EXISTS "banned",
DROP COLUMN IF EXISTS "ban_reason",
DROP COLUMN IF EXISTS "ban_expires";
-- +goose StatementEnd
