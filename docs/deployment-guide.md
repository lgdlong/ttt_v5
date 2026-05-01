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

## VPS Production Deployment

This approach pulls pre-built images from Docker Hub - no build needed on VPS.

### Prerequisites on VPS

- Docker 24+
- Docker Compose v2+

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Clone Configuration

```bash
git clone <repository-url> /opt/ttt-v5
cd /opt/ttt-v5
cp .env.example .env
```

### 3. Configure Environment

Edit `.env` with production values:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=ttt_project

# Backend
GIN_MODE=release
ENVIRONMENT=production
```

### 4. Deploy

```bash
# Pull latest images and start (images pulled from Docker Hub)
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 5. Update Deployment

When new images are pushed to Docker Hub, simply:

```bash
cd /opt/ttt-v5
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Image Sources

| Service | Image | Source |
|---------|-------|--------|
| db | postgres:17-alpine | Docker Hub |
| backend | lgdlong/ttt-v5-backend:latest | Docker Hub |
| frontend | lgdlong/ttt-v5-frontend:latest | Docker Hub |

### Troubleshooting

```bash
# Check container health
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# Restart services
docker-compose -f docker-compose.prod.yml restart backend

# Full rebuild from Docker Hub
docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d
```

## Build Images Locally (Alternative)

If you need to build images locally instead of using Docker Hub:

```bash
# Build backend
docker build -t lgdlong/ttt-v5-backend:latest ./backend

# Build frontend
docker build -t lgdlong/ttt-v5-frontend:latest ./frontend

# Push to Docker Hub
docker push lgdlong/ttt-v5-backend:latest
docker push lgdlong/ttt-v5-frontend:latest
```

Then on VPS, deploy with `docker-compose -f docker-compose.prod.yml up -d` (images pulled automatically).

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