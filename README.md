# TTT v5

A Go + React full-stack application with Docker orchestration.

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Go 1.21+ + Gin framework |
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
pnpm install
pnpm dev
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
├── database/        # Database migrations
├── docs/           # Documentation
└── plans/         # Development plans
```

## API Endpoints

- `GET /health` - Health check

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