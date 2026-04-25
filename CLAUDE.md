# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Start all services (Docker)
docker-compose up --build

# Local development
make dev                    # Start backend + frontend
make backend-run            # Run backend with swagger generation
make frontend-dev          # Run frontend dev server

# Build & Test
make build                 # Build all
make backend-build         # Build backend binary
make frontend-build        # Build frontend
make test                 # Run all tests
make ci-test              # Run CI checks locally (lint + test + build)

# Database
make db-migrate-up        # Run migrations
make db-seed              # Seed database
make db-psql             # Connect to PostgreSQL
```

## Architecture

This is a Go + React full-stack app with Clean Architecture:

```
backend/internal/
├── delivery/     # HTTP handlers, middleware, router
├── application/  # Business logic (services)
├── domain/        # Entities, DTOs, repository interfaces
└── repository/   # GORM implementations
```

Frontend uses React 19 + Vite + Tailwind CSS v4 with shadcn/ui patterns.

## Database

PostgreSQL with three tables:
- `youtube_videos` - main video storage
- `tags` - tag definitions
- `video_tags` - many-to-many junction

Migrations in `database/migrations/`, managed with goose.

## API Endpoints

- Public: `/api/v1/videos`, `/api/v1/tags`, `/api/v1/tags/:tagId/videos`
- Admin: CRUD endpoints for videos and tags under `/admin/`
- System: `/health`, `/swagger/*any`

## Key Files

- `Makefile` - all development commands
- `.env.example` - environment variables template
- `backend/cmd/server/main.go` - HTTP server entry
- `backend/internal/delivery/router/router.go` - route definitions