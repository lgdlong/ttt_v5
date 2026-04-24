# Frontend Infrastructure Research Report

**Date:** 2026-04-25
**Topic:** shadcn/ui + Vite React TypeScript + PostgreSQL/Atlas

---

## 1. shadcn/ui CLI Installation (Vite React)

### Existing Setup Check
- Frontend at `frontend/` has Vite + React 19.2.5 + TypeScript 6.0.2
- No Tailwind CSS currently installed (will need to add)

### Installation Commands
```bash
# 1. Install Tailwind CSS v4 with Vite plugin (PREREQUISITE)
pnpm add tailwindcss @tailwindcss/vite

# 2. Initialize shadcn/ui with Vite template
pnpm dlx shadcn@latest init -t vite

# 3. For monorepo setup
pnpm dlx shadcn@latest init -t vite --monorepo
```

### Required Dependencies (auto-installed by shadcn CLI)
- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/vite` - Vite plugin for Tailwind
- `radix-ui` - Unstyled, accessible UI primitives
- `class-variance-authority` - Component variant management
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `lucide-react` - Icon library

### Post-Installation Add Components
```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
# etc.
```

---

## 2. AtlasGo PostgreSQL Migration Workflow

### Core Concepts
- **Declarative**: Define desired schema in HCL/Go, Atlas generates migrations
- **Versioned**: Migration files tracked in `migrations/` directory
- **Dev URL**: Docker-based local dev database for diff planning

### Basic Workflow
```bash
# 1. Define schema in schema.hcl
# 2. Generate migrations
atlas migrate diff --env dev --to file://schema.hcl

# 3. Apply migrations
atlas migrate apply --url "postgres://user:pass@localhost:5432/db?sslmode=disable"
```

### Go API for Migrations
```go
client, _ := atlasexec.NewClient(workdir.Path(), "atlas")
result, err := client.MigrateApply(context.Background(), &atlasexec.MigrateApplyParams{
    URL: "postgres://user:pass@localhost:5432/mydb?sslmode=disable",
})
```

### Dev Database for Planning
```bash
# Uses Docker to spin up ephemeral Postgres for schema diffing
--dev-url "docker://postgres/15/dev"
```

---

## 3. Docker Setup Requirements

### Frontend (Nginx)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

# Nginx stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Nginx Config (SPA)
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

### Backend (Go/Node)
- Multi-stage build recommended
- Run as non-root user
- Health check endpoint

---

## 4. Docker-Compose Multi-Service Setup

### Recommended Structure
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    health_check:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## 5. Single .env at Root

```env
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/app

# Backend
PORT=8080

# Frontend
VITE_API_URL=http://localhost:8080
```

### Access Pattern
- Root `.env` loaded by docker-compose
- Backend reads directly from environment
- Frontend uses `VITE_` prefix for exposed variables

---

## Summary

| Component | Technology | Key Command |
|-----------|------------|-------------|
| UI Components | shadcn/ui | `pnpm dlx shadcn@latest init -t vite` |
| Styling | Tailwind CSS v4 | `pnpm add tailwindcss @tailwindcss/vite` |
| DB Migration | AtlasGo | `atlas migrate diff` / `atlas migrate apply` |
| Reverse Proxy | Nginx | Multi-stage Dockerfile |
| Orchestration | Docker Compose | `docker-compose up -d` |

---

## Unresolved Questions
1. Backend technology not specified (Go/Node/etc.)
2. Database folder structure for Atlas migrations TBD
3. Auth mechanism not determined