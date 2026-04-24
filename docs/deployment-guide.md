# Deployment Guide

## Prerequisites

- Docker 24+
- Docker Compose v2+
- Git

## Environment Setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ttt_v5
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your values:

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@db:5432/ttt_project?sslmode=disable
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=ttt_project

# Backend
BACKEND_PORT=8080
GIN_MODE=release

# Frontend
VITE_API_URL=http://localhost:8080
```

## Local Development

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Service Ports

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Traefik dashboard | http://localhost:8080 |
| Backend API | http://localhost/api |

### Individual Service Development

**Backend:**
```bash
cd backend
go run ./cmd/server
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

## Production Deployment

### 1. Build Images

```bash
docker-compose build
```

### 2. Run Services

```bash
docker-compose up -d
```

### 3. Verify Health

```bash
# Check backend health
curl http://localhost/api/health

# Check containers
docker-compose ps
```

### 4. View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Troubleshooting

### Common Issues

**1. Frontend Docker build fails**
- Cause: Missing static assets
- Fix: Ensure `pnpm run build` completes successfully before Docker build

**2. Database connection refused**
- Cause: PostgreSQL not ready
- Fix: Wait for db health check, then retry

**3. Port already in use**
- Cause: Port 80 or 8080 occupied
- Fix: Stop conflicting service or change port in docker-compose.yml

### Debug Commands

```bash
# Check container status
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Restart a specific service
docker-compose restart backend

# Rebuild without cache
docker-compose build --no-cache
```

## Docker Services

| Service | Image | Port | Health Check |
|---------|-------|------|--------------|
| traefik | traefik:v3.0 | 80, 8080 | - |
| db | postgres:16-alpine | 5432 | pg_isready |
| backend | golang:1.26-alpine | 8080 | GET /health |
| frontend | node:24.15.0-alpine | 3000 | GET / |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgres://postgres:postgres@localhost:5432/ttt_project?sslmode=disable |
| POSTGRES_USER | Database username | postgres |
| POSTGRES_PASSWORD | Database password | postgres |
| POSTGRES_DB | Database name | ttt_project |
| GIN_MODE | Gin mode (debug/release) | debug |
| BACKEND_PORT | Backend HTTP port | 8080 |

## Volume Mounts

| Service | Volume | Purpose |
|---------|--------|---------|
| db | postgres_data | Persistent database storage |

## Security Notes

- Change default database password in production
- Use environment-specific configuration
- Enable SSL in production (Traefik Let's Encrypt)
- Never commit secrets to repository