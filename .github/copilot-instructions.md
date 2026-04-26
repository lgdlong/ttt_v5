# Copilot Instructions for `ttt_v5`

## Build, test, and lint commands

Prefer running commands from the repository root unless noted.

| Goal | Command |
|---|---|
| Install dependencies | `make deps` |
| Build all | `make build` |
| Build backend only | `make backend-build` |
| Build frontend only | `make frontend-build` |
| Lint backend | `make backend-lint` |
| Lint frontend | `make frontend-lint` |
| Type-check frontend | `make frontend-typecheck` |
| Run all tests | `make test` |
| Run backend tests | `make backend-test` |
| Run CI-equivalent checks | `make ci-test` |

Single-test execution (backend Go tests):

- `cd backend && go test ./internal/application/service -run '^TestVideoService_Create_Success$' -v`
- `cd backend && go test ./internal/application/service -run '^TestTagService_Create_AlreadyExists$' -v`

Frontend currently has no `test` script in `frontend/package.json`, so there is no project-standard frontend unit test command yet.

## High-level architecture

This repository is a full-stack app with Go backend + React frontend + PostgreSQL, usually orchestrated via Docker Compose + Traefik.

End-to-end request flow:

1. Frontend pages/components call API methods in `frontend/src/lib/api.ts` (through React Query hooks).
2. Requests hit Gin routes in `backend/internal/delivery/router/router.go`.
3. Handlers (`internal/delivery/handler`) bind/validate request data and format JSON responses.
4. Services (`internal/application/service`) contain business logic.
5. Repository implementations (`internal/repository`) perform DB access through GORM.
6. Data persists in PostgreSQL tables `youtube_videos`, `tags`, and `video_tags`.

Important cross-cutting path: creating a video triggers URL parsing and metadata fetch via `backend/pkg/youtube/client.go` before persistence.

Backend layering follows Clean Architecture-style boundaries:

- `internal/domain/entity`: DB/domain entities
- `internal/domain/dto`: request/response/filter DTOs
- `internal/domain/port`: repository interfaces
- `internal/application/service`: use cases/business logic
- `internal/repository`: GORM adapters
- `internal/delivery`: HTTP router/handlers/middleware

## Key repository conventions

### API contract and routing

- Success responses are wrapped as `{ "data": ..., "meta": ... }` (see `backend/internal/delivery/handler/response.go`).
- Error responses are wrapped as `{ "error": { "code": "...", "message": "..." } }`.
- Public read endpoints are under `/api/v1/*` and rate-limited (`RateLimit(100, time.Minute)`).
- Admin mutating endpoints are under `/api/v1/admin/*`.

### Query/filter conventions

- Video filters are normalized in backend DTOs (`page=1`, `limit=20`, default sort by `upload_date desc`).
- `tag_ids` are hyphen-delimited (`1-2-3`), not comma-delimited, matching `VideoFilter.GetTagIDs()`.

### Database and migrations

- Schema source of truth is `database/atlas.hcl`.
- SQL migrations live in `database/migrations/` and follow Goose `Up/Down` format in a single file.
- Keep using GORM for data access, not schema auto-migration.

### Frontend conventions

- Centralize HTTP calls in `frontend/src/lib/api.ts`; avoid scattering raw `fetch` logic across components.
- Keep server-state in React Query (provider wired in `frontend/src/components/query-provider.tsx` and `src/lib/query-client.ts`).
- Reuse Vietnamese UI copy from `frontend/src/lib/constants.ts` (`VI`) instead of hardcoding duplicate strings.
- Use Lucide icons (`lucide-react`) rather than emoji or ad-hoc icon sources.
- Use frontend import alias `@/` for `src/*` modules.

### MCP configuration

- Playwright MCP is configured at `.claude/.mcp.json` using `@playwright/mcp` (`npx -y @playwright/mcp@latest --headless --isolated`).

### Naming and structure conventions

- Backend Go file naming uses snake_case (e.g., `video_svc.go`, `video_repo.go`).
- Frontend files use kebab-case (especially components/hooks/pages in `frontend/src`).
