# Codebase Summary

## Directory Structure

```
ttt_v5/
├── .claude/                    # Claude configuration
├── backend/                    # Go application (190 LOC)
│   ├── cmd/server/            # Entry point
│   ├── config/              # Configuration loader
│   └── internal/            # Private packages
├── database/                 # Database migrations (empty)
├── docs/                    # Documentation
├── frontend/                # React application (~68 TSX LOC)
│   └── src/
│       ├── components/ui/   # shadcn/ui pattern components
│       └── lib/            # Utilities
├── plans/                  # Development plans & reports
└── docker-compose.yml     # 4-service orchestration
```

## File Counts

| Category | Count |
|----------|-------|
| Go files | 5 |
| TSX/TS files | 4 |
| CSS files | 2 |
| Dockerfiles | 4 |
| Configuration files | 10+ |

## Lines of Code (LOC)

| Component | LOC |
|-----------|-----|
| **Backend (Go)** | |
| `cmd/server/main.go` | 40 |
| `config/config.go` | 56 |
| `internal/delivery/middleware/middleware.go` | 70 |
| `internal/delivery/router/router.go` | 24 |
| **Subtotal** | **190** |
| **Frontend (React)** | |
| `src/main.tsx` | 11 |
| `src/App.tsx` | 13 |
| `src/App.css` | 185 |
| `src/components/ui/button.tsx` | 37 |
| `src/lib/utils.ts` | 7 |
| **Subtotal TSX/TS** | **~68** |
| **Config/Docker** | ~237 LOC |

## Component Details

### Backend Architecture

```
main.go → config.Load() → middleware.Apply() → router.Setup() → app.Run()
```

- **Framework**: Gin v1.9.1
- **Pattern**: Layered (cmd → config → internal → pkg)
- **Dependencies**: GORM, PostgreSQL driver, godotenv, swaggo, goose

### Frontend Architecture

```
main.tsx → App.tsx → Button component
```

- **Framework**: React 19.2.5 + Vite
- **Styling**: Tailwind CSS v4 (CSS-based config)
- **Pattern**: shadcn/ui (cn() utility)
- **Dependencies**: lucide-react, clsx, tailwind-merge

### Infrastructure

- **Traefik**: Reverse proxy (ports 80, 8080)
- **PostgreSQL**: Database (port 5432)
- **Backend**: Go service (port 8080)
- **Frontend**: React/Node (port 3000) via serve

### Routing (via Traefik)

- `/api/*` → Backend (port 8080)
- `/*` → Frontend (port 3000)

## Known Issues

1. **RESOLVED**: nginx.conf removed - frontend now uses `serve` (Traefik routes directly)
2. Empty `database/migrations/` directory
3. Go version mismatch (go.mod: 1.25.0, Dockerfile: 1.21-alpine)
4. Only skeleton code exists
5. Duplicate `atlas.hcl` files in backend/ and database/

## Next Steps

1. ~~Create missing `nginx.conf` for frontend~~ - resolved, using serve instead
2. Write database migration files
3. Align Go version across configs
4. Implement user authentication