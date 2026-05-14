# System Architecture

## Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Traefik    │────▶│  Backend   │
│  (Browser)  │     │  (Reverse  │     │   (Go)     │
│             │◀────│   Proxy)   │◀────│            │
└─────────────┘     └─────────────┘     └─────┬───────┘
                           │                  │
                    ┌──────▼──────┐           │
                    │ Identity    │           │
                    │ Service     │           │
                    │ (Node/Hono) │           │
                    └──────┬──────┘           │
                           │                  │
                           └────────┬─────────┘
                                    │
                            ┌───────▼───────┐
                            │  PostgreSQL   │
                            │   (Database)  │
                            └───────────────┘
```

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | latest | Build tool |
| Tailwind CSS | v4 | Styling |
| TypeScript | 5.x | Type safety |
| Mantine | v9 | UI Component Library |
| Tabler Icons | latest | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Go | 1.25.0 | Core Runtime |
| Gin | v1.9.1 | HTTP framework (Go) |
| GORM | v1.25.12 | ORM (Go) |
| Node.js | 22.x | Identity Service runtime |
| Hono | v4.x | HTTP framework (Node) |
| Better Auth | v1.1.0 | Authentication library |
| Kysely | v0.28.x | Query Builder (Node) |
| PostgreSQL | 17 | Database |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | latest | Containerization |
| Traefik | v3.0 | Reverse proxy |
| PostgreSQL | 17-alpine | Database |

## Component Design

### Frontend (React)

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component & Routing
├── components/           # UI Components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── auth/            # Authentication forms
│   └── video/           # Video grid, sidebar, detail
├── pages/                # Page components
│   ├── public/          # Public pages (Login, Register, Home)
│   └── admin/           # Admin protected pages
└── lib/                  # Utilities & Auth client
```

**Key Patterns**:

- Tailwind CSS v4 for utility-first styling
- Mantine v9 for semantic, accessible UI components
- Better Auth client for session management

### Backend (Go)

```
backend/
├── cmd/server/
│   └── main.go           # Entry point
├── config/
│   └── config.go         # Configuration loader
└── internal/
    ├── delivery/        # HTTP handlers & Router
    ├── application/     # Business logic
    ├── domain/          # Models & Interfaces
    └── repository/      # Data access (GORM)
```

**Key Patterns**:

- Clean Architecture (delivery → application → domain ← repository)
- Gin HTTP framework with structured responses
- Atlas for declarative database migrations

### Identity Service (Node.js/Hono)

```
identity-service/
├── src/
│   ├── infrastructure/
│   │   ├── auth/        # Better Auth & Admin plugin
│   │   └── database/    # Kysely connection
│   └── index.ts         # Hono entry point
```

**Key Patterns**:

- Better Auth with Admin and OpenAPI plugins
- Server-side sessions with immediate revocation
- Role-Based Access Control (RBAC) via Admin plugin

### Database

**Schema**:

```sql
-- Core Tables
CREATE TABLE youtube_videos (...);
CREATE TABLE tags (...);
CREATE TABLE video_tags (...);

-- Identity Tables (Managed by Better Auth)
CREATE TABLE user (...);
CREATE TABLE session (...);
CREATE TABLE account (...);
CREATE TABLE verification (...);
```

## API Design

### Current Endpoints

#### Public Endpoints (GET - Rate Limited)

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/v1/videos | List all videos (paginated) |
| GET | /api/v1/videos/:youtubeId | Get video by YouTube ID |
| GET | /api/v1/tags | List all tags |
| GET | /api/v1/auth/* | Authentication endpoints |

#### Admin Endpoints (Protected)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/admin/videos | Create new video |
| PUT | /api/v1/admin/videos/:youtubeId | Update video |
| DELETE | /api/v1/admin/videos/:youtubeId | Delete video |
| POST | /api/v1/admin/tags | Create new tag |

### Response Format

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## Docker Architecture

### Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| traefik | traefik:v3.0 | 80, 8080 | Reverse proxy |
| db | postgres:17-alpine | 5432 | Database |
| backend | lgdlong/ttt-v5-backend | 8080 | API server |
| identity| lgdlong/ttt-v5-identity | 8081 | Auth service |
| frontend| lgdlong/ttt-v5-frontend | 3000 | Static files |

### Routing (via Traefik)

| Path Prefix | Service | Internal Port |
|-------------|---------|----------------|
| `/api/v1/auth` | identity | 8081 |
| `/api/*` | backend | 8080 |
| `/*` | frontend | 3000 |

## Security Considerations

- Passwords stored as hashes (bcrypt via Better Auth)
- Admin plugin for restricted administrative actions
- Traefik handles SSL termination (Let's Encrypt)
- Service-specific `.dockerignore` to prevent secret leakage

## Testing Strategy

- Unit tests for Go Clean Architecture layers
- Integration tests for Authentication flows
- Frontend component testing with Vitest/Playwright
