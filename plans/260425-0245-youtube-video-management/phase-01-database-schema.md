# Phase 01: Database Schema

## Context

- Parent: plan.md
- Depends on: None (runs first)
- Research: research/researcher-02-postgres-gorm.md

## Overview

**Date:** 2026-04-25
**Description:** Define PostgreSQL schema with Atlas migrations for youtube_videos, tags, video_tags tables with soft delete support.
**Priority:** P1
**Status:** pending

## Migration Tool Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Schema definition | Atlas (atlas.hcl) | Declarative, version-controlled schema |
| Migration files | Atlas migrate generate | SQL files for Goose |
| Migration runner | Goose | Execute SQL migrations at runtime |

**Important:** GORM does NOT define schema. Schema is defined by Atlas HCL only.

## Migration Commands

```bash
# Generate migration (from atlas.hcl)
atlas migrate generate --dir file://database/migrations 20260425_initial

# Run migrations (in Go code or CLI)
goose postgres "DATABASE_URL" up
```

## Key Insights

- atlas.hcl is the SINGLE SOURCE OF TRUTH for schema
- GORM connects to DB but does NOT create tables
- All schema changes via Atlas → SQL migrations → Goose
- video_tags has composite PK (youtube_id, tag_id) - no auto-increment ID needed

## Requirements

### Tables

**youtube_videos:**
- youtube_id: VARCHAR(20) PRIMARY KEY
- title: VARCHAR(255) NOT NULL
- thumbnail_url: VARCHAR(500)
- duration_seconds: INT DEFAULT 0
- author: VARCHAR(255)
- upload_date: TIMESTAMP
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- deleted_at: TIMESTAMP NULL (soft delete)

**tags:**
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR(50) NOT NULL UNIQUE
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**video_tags:**
- youtube_id: VARCHAR(20) NOT NULL (FK to youtube_videos)
- tag_id: BIGINT NOT NULL (FK to tags)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- PRIMARY KEY (youtube_id, tag_id)

### Indexes

- idx_videos_deleted_at ON youtube_videos(deleted_at) WHERE deleted_at IS NULL
- idx_tags_name ON tags(name)
- idx_video_tags_youtube_id ON video_tags(youtube_id)
- idx_video_tags_tag_id ON video_tags(tag_id)

## Architecture

**Schema Definition:** Atlas (database/atlas.hcl) - declarative schema
**Migration Files:** SQL files in database/migrations/ (Atlas generates, Goose runs)
**ORM:** GORM for data access in backend (NOT for schema definition)

```
database/
├── atlas.hcl                    # Atlas schema (source of truth)
└── migrations/
    ├── 20260425_000001_initial.up.sql   # Goose-compatible SQL
    └── 20260425_000001_initial.down.sql  # Rollback SQL

backend/
└── (GORM used only for runtime queries)
```

## Related Code Files

None (this phase creates new files)

## File Ownership

- database/migrations/20260425_000001_initial.up.sql
- database/migrations/20260425_000001_initial.down.sql
- database/atlas.hcl (update existing)
- backend/cmd/migrate/main.go (new - runs Goose)

## Migration Workflow

1. Edit `database/atlas.hcl` → define schema
2. Run `atlas migrate generate` → creates SQL in `database/migrations/`
3. Goose reads SQL files → applies to database on startup

**Goose runs via dedicated migrate command:**
```go
// backend/cmd/migrate/main.go
import "github.com/pressly/goose/v3"

func main() {
    flag.Parse()
    db, _ := sql.Open("postgres", *dsn)
    defer db.Close()
    goose.Run("up", db, "database/migrations")
}
```

Run with: `go run ./backend/cmd/migrate -dsn "$DATABASE_URL"`

## Todo

- [ ] Update atlas.hcl schema (youtube_videos, tags, video_tags)
- [ ] Generate migrations with Atlas
- [ ] Verify SQL migration files
- [ ] Add Goose to go.mod
- [ ] Wire Goose in main.go
- [ ] Test migration on startup

## Success Criteria

- Atlas can apply migration
- All tables created with correct constraints
- Soft delete index exists

## Conflict Prevention

Phase 01 only touches database/ directory. No overlap with other phases.

## Risk Assessment

- Low risk: Database schema only
- Ensure migration naming uses timestamp prefix for ordering

## Security Considerations

- Foreign key constraints prevent orphaned records
- Soft delete preserves data for recovery

## Next Steps

Phase 02 (Models) depends on this phase completing first.