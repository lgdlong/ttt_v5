# Project Overview - PDR

## Problem Statement

Build a full-stack web application with Go backend and React frontend, containerized with Docker. The project serves as a modern web application template with authentication and data persistence.

## Goals

1. **Functional Application**: Deliver a working web application with user authentication
2. **Modern Stack**: Use Go 1.26, React 19, PostgreSQL 16
3. **Containerized**: Full Docker orchestration with Traefik reverse proxy
4. **Maintainable**: Clean codebase with clear architecture and documentation

## Target Users

- Developers seeking a Go + React template
- Teams building modern full-stack applications
- Production deployments requiring containerized infrastructure

## MVP Scope

### Must Have
- User authentication (register, login, logout)
- Database persistence with PostgreSQL
- RESTful API design
- Responsive React frontend
- Docker Compose orchestration

### Nice to Have (Post-MVP)
- User profile management
- API documentation (Swagger)
- Unit and integration tests
- CI/CD pipeline

## Success Metrics

| Metric | Target |
|--------|--------|
| API endpoints | 5+ |
| Frontend pages | 3+ (login, register, dashboard) |
| Database tables | 1+ (users) |
| Docker services | 4 (Traefik, PostgreSQL, Backend, Frontend) |
| Code coverage | 70%+ |
| Documentation | Complete |

## Current Status

- **Phase**: Bootstrap / Initial Setup
- **Backend**: Minimal skeleton (190 LOC, only /health endpoint)
- **Frontend**: Minimal skeleton (68 TSX LOC, single Button component)
- **Database**: Schema defined (users table), no migrations run
- **Docker**: 4 services configured, build issues exist

## Next Steps

1. Fix Docker build issues (nginx.conf removed, using serve; migrations pending)
2. Implement user authentication API
3. Create React frontend pages
4. Write database migrations
5. Add tests