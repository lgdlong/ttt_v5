# TTT v5

A Go + React full-stack application with Docker orchestration.

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Go 1.21+ + Gin framework |
| Identity Service | Node.js + Hono + Better Auth |
| Database | PostgreSQL 16 |
| Infrastructure | Docker + Traefik reverse proxy |

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Go 1.21+ (for local backend development)
- Node.js 20+ (for local frontend development)

### Run with Docker

```bash
# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build

# Access the application
open http://localhost
```

### Local Development

```bash
# Backend
cd backend
go run ./cmd/server

# Frontend
cd frontend
npm install
npm run dev

# Identity Service
cd identity-service
npm install
npm run dev
```

## Project Structure

```
ttt_v5/
├── backend/          # Go application
│   ├── cmd/         # Entry points
│   ├── config/     # Configuration
│   └── internal/    # Private packages
├── frontend/        # React application
│   └── src/        # Source code
├── identity-service/  # Node.js auth service (Hono + Better Auth)
│   └── src/        # Source code
├── database/        # Database migrations
├── docs/           # Documentation
└── plans/         # Development plans
```

## Services

### Identity Service (Port 8081)

Authentication microservice fully implemented with Hono + Better Auth + Kysely.

```bash
cd identity-service
npm install
npm run dev        # http://localhost:8081
```

Routes:

- `POST/GET /api/v1/auth/*` - All Better Auth endpoints (sign-in, sign-up, session, sign-out, reference)
- `GET /` - Health check

Requires `.env` at project root with `DATABASE_URL` and `BETTER_AUTH_URL`.

## API Endpoints

- `GET /health` - Backend health check
- `/api/v1/auth/*` - Identity service auth routes (via proxy)

## Known Issues

- `nginx.conf` missing (frontend Docker build will fail)
- No database migrations in `database/migrations/`
- Go version mismatch between `go.mod` and Dockerfiles

## Documentation

- [Architecture](./docs/system-architecture.md)
- [Code Standards](./docs/code-standards.md)
- [Project Roadmap](./docs/project-roadmap.md)

## License

MIT
