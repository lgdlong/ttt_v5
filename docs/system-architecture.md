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
| React | 19.x | UI framework |
| Vite | latest | Build tool |
| Tailwind CSS | v4 | Styling |
| TypeScript | 5.x | Type safety |
| shadcn/ui | pattern | Component pattern |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Go | 1.25.0 | Runtime |
| Gin | v1.9.1 | HTTP framework |
| GORM | v1.25.12 | ORM |
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

**Schema** (from migrations and entities):
```sql
CREATE TABLE youtube_videos (
    youtube_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500),
    description TEXT,
    channel_id VARCHAR(255),
    channel_title VARCHAR(255),
    published_at TIMESTAMP,
    thumbnail_url VARCHAR(500),
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE video_tags (
    video_id VARCHAR(255) REFERENCES youtube_videos(youtube_id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (video_id, tag_id)
);
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
| GET | /api/v1/tags/:tagId/videos | Get videos by tag |

#### Admin Endpoints (POST/PUT/DELETE - No Rate Limiting)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/admin/videos | Create new video |
| PUT | /api/v1/admin/videos/:youtubeId | Update video |
| DELETE | /api/v1/admin/videos/:youtubeId | Delete video |
| POST | /api/v1/admin/tags | Create new tag |
| PUT | /api/v1/admin/tags/:tagId | Update tag |
| DELETE | /api/v1/admin/tags/:tagId | Delete tag |
| POST | /api/v1/admin/videos/:youtubeId/tags/:tagId | Attach tag to video |
| DELETE | /api/v1/admin/videos/:youtubeId/tags/:tagId | Detach tag from video |

#### System Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /swagger/*any | Swagger documentation |

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
| db | postgres:17-alpine | 5432 | Database |
| backend | go:1.25-alpine | 8080 | API server |
| frontend | node:24-alpine (serve) | 3000 | Static files |

### Routing

| Path Prefix | Service | Internal Port |
|-------------|---------|----------------|
| `/api/*` | backend | 8080 |
| `/*` | frontend | 3000 |

## Known Issues

1. **RESOLVED**: Frontend now uses `serve` instead of nginx (Traefik handles routing)
2. Empty `database/migrations/` directory
3. Duplicate `atlas.hcl` files in backend/ and database/

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