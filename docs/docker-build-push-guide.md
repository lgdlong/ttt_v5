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
| Identity Service | `lgdlong/ttt-v5-identity-service:latest` |

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
# Build with VITE_API_URL from .env.prod (Vite bakes env vars at build time)
docker build -f frontend/Dockerfile \
  --build-arg VITE_API_URL=$(grep VITE_API_URL .env.prod | cut -d '=' -f2) \
  -t lgdlong/ttt-v5-frontend:latest .
```

**Important:** `VITE_API_URL` is baked into the JS bundle at build time via `--build-arg`. The value comes from `.env.prod` in repo root. Do not hardcode — use the command above or set the arg manually.

### 4. Build Identity Service Image

```bash
docker build -f identity-service/Dockerfile -t lgdlong/ttt-v5-identity-service:latest .
```

### 5. Push Identity Service Image

```bash
docker push lgdlong/ttt-v5-identity-service:latest
```

### 6. Push Frontend Image

```bash
docker push lgdlong/ttt-v5-frontend:latest
```

## One-Liner (Build + Push All)

```bash
# Backend
docker build -f backend/Dockerfile -t lgdlong/ttt-v5-backend:latest . && docker push lgdlong/ttt-v5-backend:latest

# Identity Service
docker build -f identity-service/Dockerfile -t lgdlong/ttt-v5-identity-service:latest . && docker push lgdlong/ttt-v5-identity-service:latest

# Frontend (reads VITE_API_URL from .env.prod via --build-arg)
docker build -f frontend/Dockerfile \
  --build-arg VITE_API_URL=$(grep VITE_API_URL .env.prod | cut -d '=' -f2) \
  -t lgdlong/ttt-v5-frontend:latest . && docker push lgdlong/ttt-v5-frontend:latest
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
    # Extract VITE_API_URL from .env.prod
    API_URL=$(grep VITE_API_URL .env.prod | cut -d '=' -f2)
    docker build -f frontend/Dockerfile --build-arg VITE_API_URL=$API_URL -t lgdlong/ttt-v5-frontend:latest .
    docker push lgdlong/ttt-v5-frontend:latest
```

## Why VITE_API_URL Uses --build-arg

Vite (and other bundlers) bake `import.meta.env.VITE_*` variables into the JS bundle at **build time**, not runtime. This means:

- `.env.prod` docker `env_file` (runtime) does NOT work for `VITE_API_URL`
- The API URL must be passed via `--build-arg` during `docker build`
- If you change `.env.prod` on VPS, you must rebuild the frontend image
