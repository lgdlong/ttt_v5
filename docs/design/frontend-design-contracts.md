# Design Contracts - YouTube Video Manager Frontend

**Version:** 3.0
**Date:** 2026-04-26
**Status:** Active

---

## 1. Product Overview

| Attribute | Value |
|-----------|-------|
| Product | YouTube Video Manager |
| Type | Admin Dashboard + Public Video Browser |
| Users | Internal team (admin), External users (public) |
| Stack | React 19 + Vite + Tailwind CSS v4 + TanStack Query + TanStack Virtual + shadcn/ui |

---

## 1.1 UI Library

**shadcn/ui** - For simple, accessible components

**Components to use:**
- Button, Input, Dialog, DropdownMenu
- Card, Badge, Avatar
- Table, Checkbox, Switch
- Toast, Skeleton
- Select, Popover, Command

## 1.2 Language

**Vietnamese** - All UI text in Vietnamese

| Element | Text |
|---------|------|
| Search placeholder | "Tìm kiếm video..." |
| Filter button | "Lọc" |
| Reset | "Đặt lại" |
| Apply | "Áp dụng" |
| Create | "Tạo mới" |
| Edit | "Sửa" |
| Delete | "Xóa" |
| Save | "Lưu" |
| Cancel | "Hủy" |
| Confirm | "Xác nhận" |
| Watch on YouTube | "Xem trên YouTube" |
| Total videos | "Tổng số video" |
| Total tags | "Tổng số thẻ" |
| This week | "Tuần này" |
| This month | "Tháng này" |
| No results | "Không có kết quả" |
| Loading | "Đang tải..." |
| Error | "Đã xảy ra lỗi" |
| Success | "Thành công" |

---

## 2. Data Models

### 2.1 Video (from API)

| Field | Type | Display |
|-------|------|---------|
| youtube_id | string | Link to YouTube |
| title | string | Video title |
| author | string | Channel name |
| thumbnail_url | string | Image (16:9) |
| duration_seconds | int | Format: mm:ss |
| upload_date | string | Format: YYYY-MM-DD |
| tags | array | Tag list |

### 2.2 Tag (from API)

| Field | Type |
|-------|------|
| id | int |
| name | string |

---

## 3. Pages

### 3.1 Public Pages

| Page | Path | Features |
|------|------|----------|
| Video Browser | `/` | Split view: list (60%) + detail (40%) |

### 3.2 Admin Pages

| Page | Path | Features |
|------|------|----------|
| Admin Dashboard | `/admin` | Stats KPIs |
| Video Management | `/admin/videos` | Search + assign tags |
| Tag Management | `/admin/tags` | CRUD tags |

---

## 4. Public Page: Video Browser Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Header: Logo + Nav (Videos) + Dark Mode Toggle         │
├──────────────────────────────────┬─────────────────────────────────┤
│ Left Panel (60%)                  │ Right Panel (40%)                │
│ ──────────────────────────────     │ ─────────────────────────────    │
│ Search Bar                       │ Selected Video Detail             │
│ [🔍 Search...          ] [Filter] │ ─────────────────────────────    │
│                                 │ [Video Title]                   │
│ Tag Filters (horizontal scroll)   │ Author: [channel]              │
│ [All] [Tag1] [Tag2] [Tag3] ...   │ Duration: mm:ss | Date          │
│                                 │                                 │
│ Video Grid / Virtual List         │ Tags: [tag1] [tag2]             │
│ ┌────────┐ ┌────────┐ ┌────────  │                                 │
│ │Thumb  │ │Thumb  │ │Thumb  │   │ [▶ Xem trên YouTube] button   │
│ │Title │ │Title │ │Title  │   │ (opens youtube.com/watch?v=...) │
│ │Date  │ │Date  │ │Date  │   │                                 │
│ └──────┘ └──────┘ └──────┘   │                                 │
│ ... (infinite scroll)          │ Description (if available)       │
│                                 │                                 │
└──────────────────────────────────┴─────────────────────────────────┘
```

### 4.1 Components

**Search Bar:**
- Icon + input + clear button
- Debounced (300ms)
- Placeholder: "Tìm kiếm video..."
- Filter button opens modal

**Filter Modal:**
- Trigger: "Filter" button
- Content:
  - Date range (from - to)
  - Sort: Newest / Oldest (upload_date)
  - Duration: Short / Medium / Long
  - Tag multi-select (AND logic)
- Apply / Reset buttons
- Backdrop click to close

**Tag Filters:**
- Horizontal scroll on mobile
- "All" always first (no filter)
- Active: filled primary
- Inactive: outlined

**Video List (TanStack Virtual):**
- 3 columns grid
- Infinite scroll (load more on scroll)
- Card shows: thumbnail, title, date, duration
- Click = select and show detail in right panel

**Video Detail Panel:**
- Selected video info
- List of tags
- "Watch on YouTube" button (opens new tab)
- Empty state when nothing selected

---

## 5. Admin Pages

### 5.1 Admin Dashboard (`/admin`)

**Stats KPIs:**

| KPI | Description |
|----|-------------|
| Total Videos | Count from API |
| Total Tags | Count from API |
| Videos This Week | Calculated from data |
| Videos This Month | Calculated from data |
| Top Tags | Top 5 most used tags with counts |

### 5.2 Video Management (`/admin/videos`)

**Features:**
- Tìm kiếm video theo tiêu đề
- List in table/grid
- Click video to show tag assignment UI
- Search and add tags to video
- Remove tags from video
- **No CRUD for videos** (read-only list)

**Tag Assignment:**
- Search tags input
- Dropdown results
- Click to attach (POST /admin/videos/{youtubeId}/tags/{tagId})
- Click X to detach (DELETE /admin/videos/{youtubeId}/tags/{tagId})

### 5.3 Tag Management (`/admin/tags`)

**CRUD Operations:**

| Operation | API | Method |
|-----------|-----|--------|
| Create | POST /admin/tags | Create new tag |
| Read | GET /tags | List all tags |
| Update | PUT /admin/tags/{tagId} | Edit tag name |
| Delete | DELETE /admin/tags/{tagId} | Remove tag |

**UI:**
- Table: ID, Name, Video Count, Actions
- Actions: Edit, Delete (with confirmation)
- Create button opens modal form

---

## 6. Design System

### 6.1 Colors

| Role | Light | Dark |
|------|-------|------|
| Primary | `#3B82F6` | `#60A5FA` |
| Secondary | `#60A5FA` | `#93C5FD` |
| CTA | `#F97316` | `#FB923C` |
| Background | `#F8FAFC` | `#0F172A` |
| Surface | `#FFFFFF` | `#1E293B` |
| Text | `#1E293B` | `#F1F5F9` |
| Text Muted | `#64748B` | `#94A3B8` |
| Border | `#E2E8F0` | `#334155` |
| Success | `#22C55E` | `#4ADE80` |
| Error | `#EF4444` | `#F87171` |

### 6.2 Typography

**Headings:** Merriweather (serif) - wisdom, tradition, authority
**Body & UI:** Be Vietnam Pro (sans-serif) - clarity, modern readability

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Merriweather | 24px | 700 |
| H2 | Merriweather | 20px | 600 |
| Body | Be Vietnam Pro | 14-16px | 400 |
| Caption | Be Vietnam Pro | 12px | 400 |

**Font Imports:**
```
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
```

**Font Loading:** Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)

### 6.3 Layout

- Public: 60/40 split, responsive
- Admin: Sidebar (240px) + Content

### 6.4 Responsive

| Breakpoint | Public |
|-----------|--------|
| < 768px | Single column, stacked (list above detail) |
| >= 768px | Split view |

---

## 7. UX Features

### 7.1 Interactions
- [ ] Dark mode toggle ( persisted)
- [ ] Toast notifications (success/error/dismiss)
- [ ] Confirmation dialogs (delete actions)
- [ ] Loading skeletons
- [ ] Loading button state (disable + spinner during async)
- [ ] Empty states

### 7.2 Accessibility
- [ ] Color contrast 4.5:1
- [ ] Focus states
- [ ] Keyboard nav
- [ ] Labels on forms

### 7.3 Performance
- [ ] TanStack Virtual for long lists
- [ ] TanStack Query caching
- [ ] Lazy images
- [ ] Font display: swap (prevent FOIT)
- [ ] prefers-reduced-motion support
- [ ] Loading button state (disable + spinner)
- [ ] Z-index scale system

### 7.4 Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| Default | 0 | Normal content |
| Dropdown | 10 | Menus, selects |
| Sticky | 20 | Fixed headers |
| Modal Backdrop | 30 | Dialog backdrop |
| Modal | 40 | Dialogs, modals |
| Toast | 50 | Toast notifications |
| Tooltip | 60 | Tooltips |

---

## 8. TanStack Query Usage

```typescript
// Query keys
const queryKeys = {
  videos: ['videos'],
  video: (youtubeId) => ['video', youtubeId],
  tags: ['tags'],
  tagVideos: (tagId) => ['tagVideos', tagId],
};

// Mutations with invalidate
useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['videos'] })
  },
})
```

---

## 9. TanStack Virtual Usage

```typescript
// Virtual list for infinite scroll
useVirtualizer({
  count: videos.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 280, // card height + gap
  overscan: 5,
})
```

---

## 10. Component List

### Public
1. `PublicLayout` - Header + content + dark mode toggle
2. `VideoSearchBar` - Search input with debounce
3. `FilterModal` - Date, sort, duration, tags filter
4. `TagFilters` - Horizontal tag pills
5. `VideoGrid` - Virtual grid of video cards
6. `VideoCard` - Thumbnail + title + date + duration
7. `VideoDetailPanel` - Selected video detail + watch button
8. `TagPill` - Reusable tag badge

### Admin
1. `AdminLayout` - Sidebar + content
2. `StatsCards` - KPI cards
3. `VideoTable` - Video list with search
4. `TagAssignment` - Search + add + remove tags
5. `TagTable` - CRUD table
6. `TagForm` - Create/Edit form
7. `ConfirmationDialog` - Reusable dialog
8. `Toast` - Notification toasts

---

## 11. API Endpoints

### Public
- `GET /api/v1/videos?` - List videos (q, tag_ids, sort, order, page, limit)
- `GET /api/v1/videos/{youtubeId}` - Get video
- `GET /api/v1/tags` - List tags (q, page, limit)
- `GET /api/v1/tags/{tagId}/videos` - Videos by tag

### Admin
- `POST /api/v1/admin/tags` - Create tag
- `PUT /api/v1/admin/tags/{tagId}` - Update tag
- `DELETE /api/v1/admin/tags/{tagId}` - Delete tag
- `POST /api/v1/admin/videos/{youtubeId}/tags/{tagId}` - Attach tag
- `DELETE /api/v1/admin/videos/{youtubeId}/tags/{tagId}` - Detach tag

---

## 12. Anti-Patterns to Avoid

| Avoid | Use |
|-------|-----|
| No loading state | Skeleton/spinner |
| Placeholder as label | Actual label |
| Emoji as icons | SVG icons |
| Instant transitions | 150-300ms ease |
| No empty state | Helpful message |

---

## 13. Full-Screen YouTube-Style Layout (v3 - Active)

### Layout Structure

| Element | CSS | Description |
|---------|-----|-------------|
| Page wrapper | `h-screen flex flex-col` | Full viewport, no page overflow |
| Header | `flex-none h-14` | Fixed 56px height |
| Main | `flex-1 overflow-hidden` | Fills remaining space |
| Sidebar | collapsible | Filter panel, ~280px |
| Video Grid | `overflow-y-auto h-full` | CSS auto-fill grid |
| Detail Panel | `w-[420px] flex-none` | Fixed right sidebar |

### Video Grid Responsive Columns

```css
grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7
gap-4 p-4 overflow-y-auto h-full
```

### VideoCard (YouTube-Style)

- Button element (no Card wrapper)
- Play overlay on hover: `bg-black/20` with centered `Play` icon
- Selected: `opacity-100`, unselected: `opacity-80`
- Duration badge: `bg-black/80 text-white text-xs` bottom-right
- Title: `line-clamp-2`, hover shows primary color
- No date on card - clean look

### VideoDetailPanel

- Full height: `h-full flex flex-col`
- Thumbnail: `aspect-video` no rounded corners
- Metadata with Lucide icons: `User`, `Calendar`, `Clock`
- ScrollArea for scrollable content
- "Watch on YouTube" button at bottom
- Empty state: centered icon + text (no emoji)

### Key Differences from v2

| Before (v2) | After (v3) |
|-------------|------------|
| `min-h-screen` with overflow | `h-screen overflow-hidden` |
| `container mx-auto` margins | Full width |
| 60/40 sticky split | Fixed 420px right panel |
| TanStack Virtual grid | CSS auto-fill grid |
| Card wrapper on VideoCard | Button element |
| Badge for duration | Dark overlay badge |
| Emoji placeholder | Lucide `Play` icon |

### FilterSidebar (v3 Redesign)

**Structure:**
- Custom div wrapper with `w-64 flex-none border-r h-full flex flex-col`
- No shadcn Sidebar - standalone component
- Expand/collapse toggle ("Thu gọn" / "Mở rộng")

**Sort Section:**
- Icon: `ArrowUpDown` (Lucide)
- Full-width button row per option
- Unicode icons for sort direction: `↓` `↑` `↕`
- Check icon on selected option

**Tags Section:**
- Badge count for selected tags
- Search input with `Search` icon
- Selected tags shown in pill group with "Xóa tất cả" link
- Tag list as buttons with custom checkbox (not shadcn checkbox)

**Styling:**
- `text-xs uppercase tracking-wide text-muted-foreground` for labels
- `px-3 py-2` for buttons, `rounded-md`
- Selected: `bg-primary/10 text-primary`
- Hover: `hover:bg-accent`

---

## 14. Next Steps

1. Review contracts
2. Confirm with Google Stitch
3. Implementation phase