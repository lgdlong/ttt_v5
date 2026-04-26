# Phase 2: Shared Components

**Status:** Completed
**Priority:** P0

## Context
- Based on: `docs/design/frontend-design-contracts.md` section 6
- Plan: Phase 1 must complete first

## Dependencies
- Already exist: `clsx`, `tailwind-merge`
- Need: shadcn/ui components

## Implementation Steps

### 2.1 Styles & Theme
1. Create `frontend/src/styles/globals.css`:
   - Import fonts: Merriweather, Be Vietnam Pro
   - CSS variables for colors (section 6.1)
   - Tailwind CSS v4 setup

### 2.2 Layout Components
1. Create `components/layout/public-layout.tsx`:
   - Header with logo, nav, dark mode toggle
   - Content slot
   - Dark mode persisted to localStorage

2. Create `components/layout/admin-layout.tsx`:
   - Sidebar (240px) with nav items
   - Content slot
   - Dark mode toggle

### 2.3 shadcn/ui Components
- Button, Input
- Card, Badge
- Dialog
- Toast

## Success Criteria
- [ ] Fonts loading
- [ ] Dark mode works
- [ ] Layouts render