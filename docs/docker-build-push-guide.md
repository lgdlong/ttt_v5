# Build and Push Docker Images

This guide explains how to build and push Docker images to Docker Hub.

## Prerequisites

- Docker installed locally
- Docker Hub account
- Docker Hub username: `lgdlong`

## Image Naming Convention

| Service | Image Name |
|---------|------------|
| Backend | `lgdlong/ttt-v5-backend:latest` |
| Frontend | `lgdlong/ttt-v5-frontend:latest` |

## Build and Push Commands

### 1. Build Backend Image

```bash
cd backend
docker build -t lgdlong/ttt-v5-backend:latest .
```

### 2. Push Backend Image

```bash
docker push lgdlong/ttt-v5-backend:latest
```

### 3. Build Frontend Image

```bash
cd frontend
docker build -t lgdlong/ttt-v5-frontend:latest .
```

### 4. Push Frontend Image

```bash
docker push lgdlong/ttt-v5-frontend:latest
```

## One-Liner (Build + Push Both)

```bash
# Backend
docker build -t lgdlong/ttt-v5-backend:latest ./backend && docker push lgdlong/ttt-v5-backend:latest

# Frontend
docker build -t lgdlong/ttt-v5-frontend:latest ./frontend && docker push lgdlong/ttt-v5-frontend:latest
```

## On VPS (Production Deployment)

Once images are pushed, on the VPS simply run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

The `pull_policy: always` in docker-compose.prod.yml ensures the latest image is pulled from Docker Hub.

## CI/CD Integration

For automated builds, add to your CI pipeline:

```yaml
- name: Build and push backend
  run: |
    docker build -t lgdlong/ttt-v5-backend:latest ./backend
    docker push lgdlong/ttt-v5-backend:latest

- name: Build and push frontend
  run: |
    docker build -t lgdlong/ttt-v5-frontend:latest ./frontend
    docker push lgdlong/ttt-v5-frontend:latest
```