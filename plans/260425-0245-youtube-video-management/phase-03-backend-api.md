# Phase 03: API Handlers & Routes

## Context

- Parent: plan.md
- Depends on: Phase-02 (models, repository)
- Research: research/researcher-03-gin-crud.md, research/researcher-04-api-queries.md

## Overview

**Date:** 2026-04-25
**Description:** Implement Gin HTTP handlers for all CRUD operations, filter/sort/paginate, rate limiting, and YouTube URL validation.
**Priority:** P1
**Status:** completed

## Key Insights

- Admin endpoints under /api/v1/admin/ prefix
- Public endpoints: GET videos, GET tags, GET tags/{tagId}/videos
- POST /videos accepts youtube_url, extracts ID, fetches metadata from YouTube API
- All GET endpoints have rate limit (100 req/min)
- Common query params: q, tag_ids, sort, order, limit, offset
- Soft delete handled in repository layer

## Requirements

### Endpoints

**Public APIs:**
```
GET /api/v1/videos                         # list with filter/sort/paginate
  Query: q, tag_ids, sort (upload_date|title|created_at), order (asc|desc), limit (1-100, default 20), offset

GET /api/v1/videos/{youtubeId}             # get single video

GET /api/v1/tags                           # list all tags
GET /api/v1/tags/{tagId}/videos            # get all videos with this tag
  Query: q, sort, order, limit, offset
```

**Admin APIs (all under /api/v1/admin/):**
```
POST   /api/v1/admin/videos                          # create video (body: youtube_url)
PUT    /api/v1/admin/videos/{youtubeId}               # update video
DELETE /api/v1/admin/videos/{youtubeId}               # soft delete

POST   /api/v1/admin/tags                             # create tag (body: name)
PUT    /api/v1/admin/tags/{tagId}                     # update tag
DELETE /api/v1/admin/tags/{tagId}                      # delete tag

POST   /api/v1/admin/videos/{youtubeId}/tags/{tagId}   # attach tag to video
DELETE /api/v1/admin/videos/{youtubeId}/tags/{tagId}   # detach tag from video
```

### Middleware

- Rate limiter: 100 req/min on GET endpoints
- Request logging

### Response Format

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Error:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Video not found"
  }
}
```

## Architecture

```
internal/
├── domain/           # entity, dto, port (interfaces, NO impl)
├── application/
│   └── service/      # business logic (uses domain ports)
├── repository/       # GORM implementations of domain ports
└── delivery/
    └── handler/      # HTTP handlers (call app services, NOT business logic)
```

**Handler:** parses HTTP request, calls service, formats response
**Service:** business logic, validation, orchestrates repos
**Repository:** data access (implements domain ports)

## Related Code Files

- Extend: backend/internal/delivery/router/router.go
- Extend: backend/internal/delivery/middleware/middleware.go

## File Ownership

- backend/internal/delivery/handler/video_handler.go
- backend/internal/delivery/handler/tag_handler.go
- backend/internal/delivery/handler/response.go
- backend/internal/delivery/middleware/rate_limiter.go
- backend/internal/application/service/video_svc.go    # NEW - business logic
- backend/internal/application/service/tag_svc.go     # NEW - business logic

## Implementation Steps

1. Create response.go with JSON helpers
2. Create rate_limiter.go middleware
3. Create application/service/video_svc.go - business logic
4. Create application/service/tag_svc.go - business logic
5. Create delivery/handler/video_handler.go - HTTP handling
6. Create delivery/handler/tag_handler.go - HTTP handling
7. Update router.go to register all routes
8. Update middleware.go to apply rate limiter to GET routes

## Todo

- [x] Create response helpers
- [x] Create rate limiter middleware
- [x] Create video application service
- [x] Create tag application service
- [x] Implement video HTTP handlers
- [x] Implement tag HTTP handlers
- [x] Wire routes in router.go
- [x] Apply rate limiter to GET endpoints

## Success Criteria

- All endpoints return correct HTTP status codes
- Rate limiting returns 429 when exceeded
- YouTube URL validation rejects invalid URLs
- YouTube API metadata fetched correctly on POST

## Conflict Prevention

Phase 03 owns: internal/delivery/, internal/application/service/, internal/delivery/middleware/rate_limiter.go
Phase 02 owns: internal/domain/, internal/repository/, pkg/youtube/
Phase 01 owns: database/

No file overlap.

## Risk Assessment

- Medium risk: YouTube API integration may fail, handle gracefully
- Rate limiter uses in-memory store (OK for single instance)

## Security Considerations

- Validate youtube_id format before API call
- Sanitize search parameters via GORM parameterized queries
- Rate limiting prevents abuse

## Next Steps

Phase 04 (Testing) depends on all code being implemented.