# Database Schema & Migration Rules

**IMPORTANT:** Always use Atlas for schema and migration management. GORM is only for querying.

## Migration Strategy
- **Atlas** controls all schema and migrations
- Use goose for migration files (managed by Atlas)
- **NO automigrate** - never use GORM AutoMigrate
- All migration files must follow goose format: **one file contains both UP and DOWN**

## Migration File Format
Follow `database/migrations/20260425_000001_initial.sql` as template:

```sql
-- +goose Up
-- +goose StatementBegin

[CREATE TABLE, ALTER TABLE, etc.]

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

[DROP TABLE, etc.]

-- +goose StatementEnd
```

- File naming: `YYYYMMDD_NNNNNN_name.sql`
- Both UP and DOWN in same file
- Create migration files in `database/migrations/`
- Run migrations via `make db-migrate-up`

## Schema Changes
- Always generate migration SQL via Atlas when schema changes

## GORM Usage
- Use GORM **only for querying** database (Read operations)
- Never use GORM for schema creation/modification
- Define models in `backend/internal/domain/` for query support only