# Project Roadmap

## Current Phase

**Phase**: Bootstrap / Initial Setup
**Status**: In Progress
**Start Date**: 2026-04-25

## Milestones

### Phase 1: Foundation (Current)

| Milestone | Status | Notes |
|----------|--------|-------|
| Docker orchestration | Complete | 4 services configured |
| Backend skeleton | Complete | 190 LOC, /health only |
| Frontend skeleton | Complete | 68 TSX LOC |
| Database schema | Defined | users table, no migrations |
| **Fix critical issues** | Complete | nginx.conf removed, using serve instead |

### Phase 2: Backend API

| Milestone | Status | Notes |
|----------|--------|-------|
| User registration | Pending | POST /api/auth/register |
| User login | Pending | POST /api/auth/login |
| User logout | Pending | POST /api/auth/logout |
| Get current user | Pending | GET /api/users/me |
| Database migrations | Pending | Run with Atlas |

### Phase 3: Frontend

| Milestone | Status | Notes |
|----------|--------|-------|
| Login page | Pending | Form with validation |
| Register page | Pending | Form with validation |
| Dashboard | Pending | Protected route |
| Auth context | Pending | State management |

### Phase 4: Quality

| Milestone | Status | Notes |
|----------|--------|-------|
| Unit tests | Pending | Backend coverage 70%+ |
| Integration tests | Pending | API tests |
| Frontend tests | Pending | Component tests |
| Linting | Pending | Apply consistent style |

### Phase 5: Production

| Milestone | Status | Notes |
|----------|--------|-------|
| CI/CD | Pending | GitHub Actions |
| SSL/TLS | Pending | Traefik config |
| Monitoring | Pending | Health checks |
| Logging | Pending | Structured logs |

## Timeline

```
April 2026
├── Week 1: Foundation + Fix issues
├── Week 2-3: Backend API
├── Week 4: Frontend
├── Week 5: Quality
└── Week 6: Production
```

## Progress Metrics

| Metric | Current | Target |
|--------|---------|--------|
| API endpoints | 1 | 5+ |
| Frontend pages | 0 | 3+ |
| Database tables | 0 (defined) | 1+ |
| Config LOC | ~237 | Stable |
| Go LOC | 190 | 1000+ |
| TSX LOC | 68 | 500+ |

## Dependencies

### Prerequisites to Start Phase 2
- [x] ~~Fix nginx.conf missing issue~~ - resolved, now using serve
- [ ] Create database migrations
- [ ] Align Go version

### Prerequisites to Start Phase 3
- [ ] Complete backend auth API
- [ ] Decide frontend routing library
- [ ] Setup API client layer

## Notes

- Project started as template/skeleton
- User authentication is the primary feature
- Focus on getting to MVP first, then polish