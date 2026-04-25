# Design Guidelines

## Overview

This document defines the visual design language for the TTT v5 project.

## Design Principles

1. **Simplicity**: Clean, uncluttered interfaces
2. **Consistency**: Uniform styling across components
3. **Accessibility**: Readable, navigable by all users
4. **Performance**: Fast-loading, responsive

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#0f172a` | Primary buttons, text |
| Primary Hover | `#1e293b` | Button hover states |
| Background | `#ffffff` | Page background |
| Surface | `#f8fafc` | Card backgrounds |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#22c55e` | Success messages |
| Warning | `#f59e0b` | Warning messages |
| Error | `#ef4444` | Error messages |
| Info | `#3b82f6` | Informational |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#0f172a` | Main text |
| Text Secondary | `#64748b` | Secondary text |
| Border | `#e2e8f0` | Borders, dividers |
| Muted | `#f1f5f9` | Disabled, placeholder |

## Typography

### Font Family

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes

| Name | Size | Line Height | Usage |
|------|------|-----------|-------|
| h1 | 2rem (32px) | 1.2 | Page titles |
| h2 | 1.5rem (24px) | 1.3 | Section headers |
| h3 | 1.25rem (20px) | 1.4 | Subsection |
| body | 1rem (16px) | 1.5 | Body text |
| small | 0.875rem (14px) | 1.5 | Captions |

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing

### Spacing Scale

| Name | Value |
|------|-------|
| xs | 0.25rem (4px) |
| sm | 0.5rem (8px) |
| md | 1rem (16px) |
| lg | 1.5rem (24px) |
| xl | 2rem (32px) |
| 2xl | 3rem (48px) |

## Components

### Button

**Variants:**

- `default`: Primary background, white text
- `outline`: Transparent, border
- `ghost`: No background, text only
- `destructive`: Error color

**Sizes:**

- `sm`: 32px height
- `md`: 40px height (default)
- `lg`: 48px height

**States:**

- Default
- Hover: darken 10%
- Active: darken 15%
- Disabled: 50% opacity, no pointer events

### Input

**Specifications:**

- Height: 40px
- Border: 1px solid `#e2e8f0`
- Border radius: 0.375rem (6px)
- Padding: 0 0.75rem

**States:**

- Default: border `#e2e8f0`
- Focus: border primary, ring shadow
- Error: border error color
- Disabled: background muted

### Card

- Background: white
- Border: 1px solid `#e2e8f0`
- Border radius: 0.5rem (8px)
- Padding: 1.5rem
- Shadow: none (flat design)

## Layout

### Container

- Max width: 1200px
- Padding: 1rem (mobile), 2rem (desktop)

### Grid

- Columns: 12
- Gutter: 1rem
- Responsive breakpoints

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |

## Animations

### Transitions

```css
transition: all 0.2s ease-in-out;
```

### Durations

- Fast: 150ms
- Normal: 200ms
- Slow: 300ms

### Easing

- Default: `ease-in-out`
- Enter: `ease-out`
- Exit: `ease-in`

## Accessibility

### Requirements

- Color contrast ratio: 4.5:1 minimum
- Focus indicators visible
- Keyboard navigable
- Screen reader compatible
- Form labels present

### Focus State

```css
:focus-visible {
  outline: 2px solid #0f172a;
  outline-offset: 2px;
}
```

## shadcn/ui Pattern

This project follows the shadcn/ui design pattern:

- Using `cn()` utility for className composition
- Tailwind CSS v4.2.4 with CSS-based configuration
- Radix UI primitives for accessibility
- Component composition over inheritance
- CSS variables for theming (no tailwind.config.js)

## Future Considerations

- Dark mode support
- Custom theme provider
- Design tokens file
- Component storybook