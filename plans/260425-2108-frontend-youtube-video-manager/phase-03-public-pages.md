# Phase 3: Public Pages

**Status:** Completed
**Priority:** P0

## Context
- Based on: `docs/design/frontend-design-contracts.md` section 4
- Plan: Phase 2 must complete first

## Implementation Steps

### 3.1 Video Browser (`/`)
1. Create `components/video/video-search-bar.tsx`:
   - Icon + input + clear button
   - Debounced (300ms)
   - Uses GET /api/v1/videos

2. Create `components/video/filter-modal.tsx`:
   - Date range, sort, duration, tags
   - Modal with backdrop

3. Create `components/video/tag-filters.tsx`:
   - Horizontal scroll
   - Active/inactive states

4. Create `components/video/video-card.tsx`:
   - Thumbnail, title, date, duration
   - Click selects video

5. Create `components/video/video-grid.tsx`:
   - TanStack Virtual
   - 3 columns grid

6. Create `components/video/video-detail-panel.tsx`:
   - Selected video info
   - "Xem trên YouTube" button
   - Empty state

7. Create `pages/public/video-browser.tsx`:
   - 60/40 split layout
   - Responsive: stacked on mobile

## Success Criteria
- [ ] `/` loads with video list
- [ ] Search works (debounced)
- [ ] Filter modal works
- [ ] Tag filters work
- [ ] Video detail panel works
- [ ] Watch button opens YouTube
- [ ] Responsive layout