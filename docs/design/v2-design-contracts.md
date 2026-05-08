# Design Contracts - YouTube Video Manager Frontend (V2)

**Version:** 2.0 (Mantine Migration)
**Date:** 2026-05-08
**Status:** Active

---

## 1. Product Overview

| Attribute | Value |
|-----------|-------|
| Product | YouTube Video Manager |
| Type | Admin Dashboard + Public Video Browser |
| Users | Internal team (admin), External users (public) |
| Stack | React 19 + Vite + Mantine v9 + Tailwind CSS v4 + @tabler/icons-react |

---

## 1.1 UI Library

**Mantine v9** - Integrated for superior layout management and a rich component library.

**Key Components:**
- **AppShell**: Root layout structure for all pages.
- **Drawer**: Used for mobile sidebars (filters) and bottom detail panels.
- **Modal**: System dialogs and administrative forms.
- **Table**: Clean, sortable data grids for management.
- **Notifications**: Elegant toast-style feedback system.
- **Layout primitives**: Extensive use of `Group`, `Stack`, and `SimpleGrid`.

## 1.2 Localization

**Vietnamese** - Native support for all UI elements.

---

## 2. Design System

### 2.1 Typography

| Role | Font Family | Character |
|------|-------------|-----------|
| **Headings** | Merriweather (serif) | Wisdom, tradition, authority |
| **Body & UI** | Be Vietnam Pro (sans-serif) | Clarity, modern readability |

**Rules:**
1. Use **Merriweather** for all `Title` components (H1-H6).
2. Use **Be Vietnam Pro** for all `Text`, `Button`, `Input`, and general UI elements.
3. **Tags Display**: Maintain original case. Do not force uppercase on tags.

**Google Fonts Integration:**
```css
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
```

### 2.2 Color Palette

- **Primary**: Violet / Grape (Modern, energetic)
- **Accent/CTA**: Orange (Action-oriented)
- **Background**: Neutral grays with deep dark mode support.

---

## 3. Implementation Details

### 3.1 App Layout (AppShell)
- Header: Fixed at top (56px-64px).
- Navbar: Sticky sidebar for admin and optional for public filters.
- Main: Scrollable content area.

### 3.2 Component Specifics
- **Badges (Tags)**: Must have `tt="none"` to preserve original casing.
- **Drawers**: Position "left" for filters, "bottom" for mobile details.
- **Search**: Debounced TextInput with prefix icons.

---

## 4. Anti-Patterns to Avoid
- **Manual Uppercasing**: Especially on Tag names.
- **Legacy Layouts**: Avoid using 60/40 hardcoded splits; use flexbox/grid via Mantine primitives.
- **Font Mismatches**: Ensure the `MantineProvider` theme correctly sets the font families for both general text and headings.
