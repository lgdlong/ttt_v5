# System Architecture

## Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Traefik    │────▶│  Backend   │
│  (Browser)  │     │  (Reverse  │     │   (Go)     │
│             │◀────│   Proxy)   │◀────│            │
└─────────────┘     └─────────────┘     └─────┬───────┘
                                            │
                                    ┌───────▼───────┐
                                    │  PostgreSQL   │
                                    │   (Database)  │
                                    └──────────────┘
```

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.5 | UI framework |
| Vite | latest | Build tool |
| Tailwind CSS | v4 | Styling |
| TypeScript | 5.x | Type safety |
| shadcn/ui | pattern | Component pattern |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Go | 1.21+ | Runtime |
| Gin | v1.9.1 | HTTP framework |
| GORM | latest | ORM |
| PostgreSQL | 16 | Database |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | latest | Containerization |
| Traefik | v3.0 | Reverse proxy |
| PostgreSQL | 16-alpine | Database |

## Component Design

### Frontend (React)

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component
├── App.css               # Global styles
├── index.css             # Tailwind import
├── components/ui/        # shadcn/ui components
│   └── button.tsx
└── lib/                  # Utilities
    └── utils.ts          # cn() utility
```

**Key Patterns**:
- Tailwind CSS v4 with CSS-based config
- `cn()` utility: `clsx` + `tailwind-merge`
- Path alias: `@/*` → `./src/*`

### Backend (Go)

```
backend/
├── cmd/server/
│   └── main.go           # Entry point
├── config/
│   └── config.go         # Configuration loader
└── internal/
    └── delivery/
        ├── middleware/  # HTTP middleware
        └── router/      # Route definitions
```

**Key Patterns**:
- Layered architecture (cmd → config → internal)
- Gin HTTP framework
- Environment-based config via godotenv

### Database

**Schema** (from atlas.hcl):
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Design

### Current Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |

### Planned Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/users/me | Get current user |

### Response Format

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### Error Format

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

## Docker Architecture

### Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| traefik | traefik:v3.0 | 80, 8080 | Reverse proxy |
| db | postgres:16-alpine | 5432 | Database |
| backend | go:1.26-alpine | 8080 | API server |
| frontend | node:24.15.0-alpine (serve) | 3000 | Static files |

### Routing

| Path Prefix | Service | Internal Port |
|-------------|---------|----------------|
| `/api/*` | backend | 8080 |
| `/*` | frontend | 3000 |

## Known Issues

1. **RESOLVED**: Frontend now uses `serve` instead of nginx (Traefik handles routing)
2. Empty `database/migrations/` directory
3. Go version mismatch: go.mod (1.25.0) vs Dockerfile (1.21-alpine)
4. Duplicate `atlas.hcl` files in backend/ and database/

## Security Considerations

- Passwords stored as hashes (bcrypt)
- Database credentials via environment variables
- Traefik handles SSL termination
- No secrets in Docker images

## Testing Strategy

- Unit tests for Go packages
- Integration tests for API endpoints
- Frontend component tests
- E2E tests with Playwright (future)