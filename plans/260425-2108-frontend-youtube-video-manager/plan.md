# Plan: Frontend Implementation - YouTube Video Manager

**Status:** Completed
**Created:** 2026-04-25
**Based on:** docs/design/frontend-design-contracts.md
**Naming:** 260425-2108-frontend-youtube-video-manager

---

## Overview

Implement YouTube Video Manager frontend with React 19 + Vite + Tailwind CSS v4 + shadcn/ui.

### Pages to Build

| Page | Path | Status |
|------|------|--------|
| Video Browser | `/` | Done |
| Admin Dashboard | `/admin` | Done |
| Video Management | `/admin/videos` | Done |
| Tag Management | `/admin/tags` | Done |

---

## Phase 1: Foundation

### 1.1 Install Dependencies

- [ ] `react-router` (v7 from RR7)
- [ ] `@tanstack/react-virtual`
- [ ] `clsx`, `tailwind-merge` (already installed)
- [ ] shadcn/ui components

### 1.2 Setup Structure

```
frontend/src/
├── App.tsx                    # Route config
├── main.tsx                  # Entry with QueryProvider
├── lib/
│   ├── api.ts               # API client
│   ├── query-client.ts     # TanStack Query
│   └── constants.ts       # Vietnamese strings
├── components/
│   ├── layout/
│   │   ├── public-layout.tsx
│   │   └── admin-layout.tsx
│   ├── ui/                 # shadcn components
│   └── video/
│       ├── video-card.tsx
│       ├── video-grid.tsx
│       └── video-detail-panel.tsx
├── pages/
│   ├── public/
│   │   └── video-browser.tsx
│   └── admin/
│       ├── dashboard.tsx
│       ├── video-management.tsx
│       └── tag-management.tsx
└── styles/
    └── globals.css          # Fonts + shadcn theme
```

---

## Phase 2: Shared Components

### 2.1 Styles & Theme

- [ ] Add Merriweather + Be Vietnam Pro fonts
- [ ] Setup CSS variables (colors, z-index)
- [ ] shadcn Button, Card, Badge, Input
- [ ] Dark mode toggle with localStorage

### 2.2 Layouts

- [ ] `PublicLayout` - Header + slot + dark mode
- [ ] `AdminLayout` - Sidebar (240px) + content

---

## Phase 3: Public Pages

### 3.1 Video Browser (`/`)

- [ ] Split view (60% left / 40% right)
- [ ] Video search bar (debounced 300ms)
- [ ] Filter modal (date, sort, tags)
- [ ] Tag filters (horizontal scroll)
- [ ] Video grid (TanStack Virtual, 3 cols)
- [ ] Video detail panel
- [ ] "Xem trên YouTube" button
- [ ] Responsive: stacked on mobile

---

## Phase 4: Admin Pages

### 4.1 Admin Dashboard (`/admin`)

- [ ] Stats cards (total videos, tags, week, month)
- [ ] Top tags list

### 4.2 Video Management (`/admin/videos`)

- [ ] Video list with search
- [ ] Tag assignment UI
- [ ] Attach/detach tags

### 4.3 Tag Management (`/admin/tags`)

- [ ] Tag CRUD table
- [ ] Create/Edit modal form
- [ ] Delete with confirmation

---

## Phase 5: Polish

- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Error states
- [ ] Empty states
- [ ] Build verification

---

## Dependencies Needed

```bash
pnpm add react-router @tanstack/react-virtual
```

---

## Vietnamese UI Strings

Use from design contracts section 1.2.

---

## API Endpoints

All from section 11 in design contracts.

---

## Success Criteria

- [ ] `/` shows video list + detail panel
- [ ] `/admin` shows stats
- [ ] `/admin/tags` allows CRUD
- [ ] Dark mode works
- [ ] All UI in Vietnamese