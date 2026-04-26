---
title: "YouTube Video Management Platform"
description: "Build backend for YouTube video catalog with tagging system"
status: completed
priority: P1
effort: 4h
branch: main
tags: [go, gin, gorm, postgresql, youtube-api]
created: 2026-04-25
---

# YouTube Video Management Platform

## Overview

Build a Go/Gin backend for managing YouTube videos with manual tagging system. Videos are added via YouTube URL (backend fetches metadata). Soft delete, rate limiting, rich filter/sort/paginate APIs.

## Dependency Graph

```
[Phase-01: Database Schema]
         │
    ┌────┴────┐
    ▼         ▼
[Phase-02]  [Phase-03]
 Models     API Handlers
    │         │
    └────┬────┘
         ▼
  [Phase-04: Testing]
```

**Execution:** Phase-01 → Phase-02 + Phase-03 (parallel) → Phase-04

## Phase Status

| Phase | Status | File |
|-------|--------|------|
| 01-Database | completed | phase-01-database-schema.md |
| 02-Models | completed | phase-02-backend-models.md |
| 03-API | completed | phase-03-backend-api.md |
| 04-Testing | completed | phase-04-testing.md |

## File Ownership Matrix

| Phase | Files Owned |
|-------|-------------|
| 01 | database/migrations/*.sql, database/atlas.hcl, backend/cmd/migrate/main.go |
| 02 | backend/internal/domain/{entity,dto,port}/*.go, backend/internal/repository/*.go, backend/pkg/youtube/*.go |
| 03 | backend/internal/delivery/handler/*.go, backend/internal/delivery/middleware/*.go, backend/internal/delivery/router/router.go (extend) |
| 04 | backend/**/*_test.go |

## Clean Architecture

```
backend/internal/
├── domain/           # Pure business logic (no framework deps)
│   ├── entity/       # Video, Tag, VideoTag
│   ├── dto/          # Request/Response DTOs
│   └── port/         # Repository interfaces
├── repository/       # GORM implementations
└── delivery/         # HTTP handlers, middleware

## Migration Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Schema definition | Atlas (atlas.hcl) | Declarative, version-controlled schema |
| Migration files | Atlas migrate generate | SQL files for Goose |
| Migration runner | Goose | Execute SQL migrations at runtime |
| ORM | GORM | Runtime data access (NOT schema definition) |

**Key Rule:** GORM models match schema from atlas.hcl but GORM does NOT create tables.