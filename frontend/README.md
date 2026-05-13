# TTT v5 - Frontend Application

The frontend client for the TTT v5 curated video platform. Built with a modern, high-performance web stack to deliver an exceptional user experience across all devices.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **UI Components:** Mantine v9
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React

## Key Features

- **Dynamic Video Grid:** Responsive video browsing with seamless pagination and high-quality image placeholders.
- **Advanced Filtering Sidebar:** Complex tag-based AND-logic filtering with mobile-friendly slide-out functionality.
- **Multiple Thematic Experiences:** Support for distinct visual themes including "Earth & Stone" and the default dark mode "Midnight & Bronze."
- **Optimized Video Details:** Clean, scroll-free desktop layouts for viewing video metadata with "Watch on YouTube" call-to-actions.

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Environment Configuration
The frontend relies on the root `.env` for Docker, but during local development, ensure you have:
- `VITE_API_URL` (e.g., `https://the1struleoffightclub.top` or `http://localhost:8080/api/v1`)
- `VITE_APP_TITLE` (e.g., `"TTT Project"`)

### Running Locally

To start the Vite development server:
```bash
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Building for Production

```bash
npm run build
```
The build output will be placed in the `dist/` directory, optimized for static hosting or serving via Nginx.

## Development Guidelines

- **UI Standards:** We utilize Mantine v9 for semantic components. Refer to our UI guidelines before adding raw Tailwind classes to standard components.
- **Agent Rules:** Please review the global **[`.agents/rules`](../../.agents/rules)** to understand constraints and standards for AI-assisted development.
- **Changelog:** See the root **[`CHANGELOG.md`](../../CHANGELOG.md)** for a historical record of UI updates and component migrations.
