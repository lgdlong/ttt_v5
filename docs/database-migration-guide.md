# Database Migration Guide

## Identity Service Auth Schema Migration

**Date:** 2026-05-08

### Migration Applied

**File:** `database/migrations/20260508_000000_better_auth_schema.sql`

**Status:** Applied successfully

```
2026/05/08 00:00:36 OK   20260508_000000_better_auth_schema.sql (48.1ms)
2026/05/08 00:00:36 goose: successfully migrated database to version: 20260508
```

### Tables Created

| Table | Purpose |
|-------|---------|
| `users` | User accounts with email verification |
| `sessions` | Session management |
| `accounts` | OAuth provider accounts (Google, etc.) |
| `verification` | Email verification tokens |

### Command to Run Migrations

```bash
cd backend
export DATABASE_URL="postgresql://admin:<password>@localhost:5432/ttt_v5?sslmode=disable"
go run ./cmd/migrate -dsn "$DATABASE_URL" -dir ../database/migrations
```

Or with Make:

```bash
make db-migrate-up
# Note: May need to add ?sslmode=disable to DATABASE_URL
```

### Environment Variables

From `.env`:
```
POSTGRES_USER=admin
POSTGRES_PASSWORD=R2LJbpQACen4CdAr1NNj7pcfKpMnTn
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ttt_v5
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

### Rollback (if needed)

```bash
go run ./cmd/migrate -dsn "$DATABASE_URL" -dir ../database/migrations down
```