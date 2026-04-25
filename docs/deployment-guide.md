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
DATABASE_URL=postgresql://postgres:postgres@db:5432/ttt_project?sslmode=disable
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=ttt_project

# Backend
BACKEND_PORT=8080
GIN_MODE=release
ENVIRONMENT=production

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

### Using docker-compose.prod.yml

For production deployments, use the production Compose file which includes resource limits, health checks, and Traefik labels:

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop all services
docker-compose -f docker-compose.prod.yml down
```

### Alternative: Using Makefile

```bash
make prod-up        # Start production services
make prod-down      # Stop production services
make prod-logs      # View production logs
```

### Verify Health

```bash
# Check backend health
curl http://localhost/api/v1/health

# Check containers
docker-compose -f docker-compose.prod.yml ps
```

### View Logs

```bash
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
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
| db | postgres:17-alpine | 5432 | pg_isready |
| backend | golang:1.25-alpine | 8080 | GET /health |
| frontend | node:24-alpine | 3000 | GET / |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/ttt_project?sslmode=disable |
| POSTGRES_USER | Database username | postgres |
| POSTGRES_PASSWORD | Database password | postgres |
| POSTGRES_DB | Database name | ttt_project |
| GIN_MODE | Gin mode (debug/release) | debug |
| BACKEND_PORT | Backend HTTP port | 8080 |
| ENVIRONMENT | Environment (development/production) | development |

## Volume Mounts

| Service | Volume | Purpose |
|---------|--------|---------|
| db | postgres_data | Persistent database storage |

## Security Notes

- Change default database password in production
- Use environment-specific configuration
- Enable SSL in production (Traefik Let's Encrypt)
- Never commit secrets to repository