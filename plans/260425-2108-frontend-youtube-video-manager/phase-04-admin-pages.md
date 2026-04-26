# Phase 4: Admin Pages

**Status:** Completed
**Priority:** P0

## Context
- Based on: `docs/design/frontend-design-contracts.md` section 5
- Plan: Phase 2 must complete first

## Implementation Steps

### 4.1 Admin Dashboard (`/admin`)
1. Create `pages/admin/dashboard.tsx`:
   - Stats cards (total videos, tags, week, month)
   - Top tags list

### 4.2 Video Management (`/admin/videos`)
1. Create `pages/admin/video-management.tsx`:
   - Video list with search
   - Tag assignment UI
   - Attach/detach tags via API

### 4.3 Tag Management (`/admin/tags`)
1. Create `pages/admin/tag-management.tsx`:
   - CRUD table
   - Create/Edit modal form
   - Delete with confirmation

## API Endpoints
- GET /api/v1/videos
- GET /api/v1/tags
- POST /api/v1/admin/tags
- PUT /api/v1/admin/tags/:tagId
- DELETE /api/v1/admin/tags/:tagId
- POST /api/v1/admin/videos/:youtubeId/tags/:tagId
- DELETE /api/v1/admin/videos/:youtubeId/tags/:tagId

## Success Criteria
- [ ] `/admin` shows stats
- [ ] `/admin/videos` search + assign works
- [ ] `/admin/tags` CRUD works