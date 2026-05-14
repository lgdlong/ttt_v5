# Codebase Summary

## Directory Structure

```
ttt_v5/
├── backend/            # Go REST API (2,810 LOC)
├── frontend/           # React SPA (2,520 LOC)
├── identity-service/   # Node.js Auth Service (218 LOC)
├── database/           # Atlas migrations
├── docs/               # System documentation
└── docker-compose.yml  # Orchestration
```

## File Counts

| Category | Count |
|----------|-------|
| Go files | ~35 |
| TSX/TS files | ~45 |
| SQL files | ~5 |
| Dockerfiles | 3 |
| Config files | ~15 |

## Lines of Code (LOC)

| Component | LOC |
|-----------|-----|
| **Backend (Go)** | **2,810** |
| **Frontend (React)** | **2,520** |
| **Identity Service** | **218** |
| **Total Code** | **~5,548** |

## Component Details

### Backend Architecture

- **Pattern**: Clean Architecture (Delivery, Application, Domain, Repository)
- **Framework**: Gin v1.9.1
- **ORM**: GORM (PostgreSQL)
- **Migrations**: Atlas / goose

### Frontend Architecture

- **Pattern**: Component-based with Mantine v9
- **Styling**: Tailwind CSS v4
- **Auth**: Better Auth Client integration
- **Icons**: Tabler Icons

### Infrastructure

- **Reverse Proxy**: Traefik v3.0
- **Database**: PostgreSQL 17
- **Containerization**: Docker with multi-stage builds and context optimization

## Recent Milestone: v1.1.0

1. **Optimized Deployment**: Implemented service-specific `.dockerignore` files and multi-stage Dockerfiles.
2. **Enhanced UI**: Integrated professional Header component and dedicated Auth pages.
3. **Advanced Auth**: Integrated Better Auth Admin plugin and RBAC schema.
4. **Domain Migration**: Successfully migrated to `the1struleoffightclub.top`.
