# Build and Push Docker Images

This guide explains how to build and push Docker images to Docker Hub.

## Prerequisites

- Docker installed and running
- Docker Hub account
- Docker Hub username: `lgdlong`

## Image Naming Convention

| Service | Image Name |
|---------|------------|
| Backend | `lgdlong/ttt-v5-backend:latest` |
| Frontend | `lgdlong/ttt-v5-frontend:latest` |

## Build and Push Commands

All builds run from **repo root** using `-f` flag to specify Dockerfile location.

### 1. Build Backend Image

```bash
# From repo root (not from backend/ directory)
docker build -f backend/Dockerfile -t lgdlong/ttt-v5-backend:latest .
```

**Why `-f`?** Backend Dockerfile copies from both `backend/` and `database/` directories, so build context must be repo root.

### 2. Push Backend Image

```bash
docker push lgdlong/ttt-v5-backend:latest
```

### 3. Build Frontend Image

```bash
docker build -f frontend/Dockerfile -t lgdlong/ttt-v5-frontend:latest .
```

### 4. Push Frontend Image

```bash
docker push lgdlong/ttt-v5-frontend:latest
```

## One-Liner (Build + Push Both)

```bash
# Backend
docker build -f backend/Dockerfile -t lgdlong/ttt-v5-backend:latest . && docker push lgdlong/ttt-v5-backend:latest

# Frontend
docker build -f frontend/Dockerfile -t lgdlong/ttt-v5-frontend:latest . && docker push lgdlong/ttt-v5-frontend:latest
```

## On VPS (Production Deployment)

Once images are pushed, on the VPS simply run:

```bash
# Pull latest images and start containers
docker-compose -f docker-compose.prod.yml up -d

# Run migrations (if needed)
make -f Makefile.prod db-migrate

# Check migration status
make -f Makefile.prod db-migrate-status
```

The `pull_policy: always` in docker-compose.prod.yml ensures the latest image is pulled from Docker Hub.

## Troubleshooting

### Build context issues

If you see "file not found" errors during build, ensure:
- Running from **repo root** (not from `backend/` or `frontend/`)
- All referenced paths exist relative to repo root

### Legacy builder fallback

If BuildKit causes issues, disable it:

```bash
DOCKER_BUILDKIT=0 docker build -f backend/Dockerfile -t lgdlong/ttt-v5-backend:latest .
```

## CI/CD Integration

For automated builds, add to your CI pipeline:

```yaml
- name: Build and push backend
  run: |
    docker build -f backend/Dockerfile -t lgdlong/ttt-v5-backend:latest .
    docker push lgdlong/ttt-v5-backend:latest

- name: Build and push frontend
  run: |
    docker build -f frontend/Dockerfile -t lgdlong/ttt-v5-frontend:latest .
    docker push lgdlong/ttt-v5-frontend:latest
```
