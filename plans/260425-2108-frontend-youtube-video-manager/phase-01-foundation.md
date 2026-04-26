# Phase 1: Foundation

**Status:** Completed
**Priority:** P0

## Context
- Based on: `docs/design/frontend-design-contracts.md`
- Plan: `plans/260425-2108-frontend-youtube-video-manager/plan.md`

## Dependencies to Install

```bash
cd frontend
pnpm add react-router @tanstack/react-query @tanstack/react-virtual
```

## Structure to Create

```
frontend/src/
├── App.tsx                  # Route config with react-router v7
├── main.tsx                 # Entry with QueryProvider
├── lib/
│   ├── api.ts             # API client (axios base)
│   ├── query-client.ts    # TanStack Query setup
│   └── constants.ts      # Vietnamese strings
├── components/
│   ├── layout/
│   │   ├── public-layout.tsx
│   │   └── admin-layout.tsx
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
    └── globals.css       # Fonts + CSS variables
```

## Implementation Steps

1. Install dependencies
2. Create `lib/api.ts` - API client with base URL from env
3. Create `lib/query-client.ts` - TanStack Query setup
4. Create `lib/constants.ts` - Vietnamese UI strings from design contracts section 1.2
5. Update `App.tsx` - Setup routes with react-router v7
6. Update `main.tsx` - Add QueryProvider

## Success Criteria
- [ ] Dependencies installed
- [ ] Routes working
- [ ] Query client configured