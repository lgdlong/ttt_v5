# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-09

### Added

#### Core Infrastructure
- Docker Compose orchestration with Traefik v3.0 reverse proxy
- PostgreSQL 17 database with three tables: `youtube_videos`, `tags`, `video_tags`
- Atlas migration management with goose for SQL migrations
- Backend (Go 1.25) with Gin HTTP framework
- Identity Service (Node.js/Hono) with Better Auth v1.6 for authentication
- Frontend (React 19 + Vite + Tailwind CSS v4)

#### Video Management
- Public API endpoints for video listing and retrieval with pagination
- Admin CRUD endpoints for video management (POST/PUT/DELETE)
- YouTube video seeding script with full video JSON data
- Tag attachment/detachment for videos (many-to-many relationship)
- Video detail panel with blur backdrop and responsive design

#### Tag System
- Tag CRUD operations via admin API endpoints
- Tag-based video filtering with AND logic
- Multiple color palettes for tags (configurable per tag)
- Tag search API

#### Frontend Features
- Video grid with pagination component
- Filter sidebar (converted from modal) with tag filtering
- Sort order persistence across mobile/desktop
- Multiple color themes: Earth & Stone (default), Midnight & Bronze
- Mantine v9 UI library (migrated from shadcn/ui)
- Mobile-responsive design with optimized video detail UX
- Lucide React icons throughout (no Unicode symbols)

#### Authentication
- Simple admin authentication with login prompt
- Better Auth integration in identity-service
- User registration and login/logout flows
- Session-based auth (no JWTs)

#### API Documentation
- Swagger/OpenAPI documentation via gin-swagger
- REST best-practice response format with success/error structure
- OpenAPI plugin integration for identity-service

#### Developer Experience
- Makefile with development commands (dev, build, test, lint)
- Docker setup for local development and production
- VS Code dev configuration with Copilot instructions
- CLAUDE.md project guidance for Claude Code
- Comprehensive documentation (README, setup guides, migration guides)
- Development rules for code standards and workflows

### Changed

- Frontend migrated from shadcn/ui to Mantine v9
- Dark mode set as default visual identity
- API response format updated to REST best practices (`success/data/error` structure)
- Config fields and environment variables renamed for consistency
- Production Dockerfile updated for repo-root build context
- Tag filter implementation updated to use sidebar instead of modal
- GORM AutoMigrate removed (Atlas controls schema)

### Fixed

- nginx.conf missing issue (switched to `serve` for frontend)
- Better Auth TypeScript configuration error
- DATABASE_URL environment variable loading in ESM context
- Mobile search bar UX
- Sort order active state persistence on mobile filter sidebar
- Badge contrast and visibility in dark mode
- Responsive grid stabilization with early observer parent mounting
- GORM many2many relation configuration (primaryKey and joinForeignKey)
- Tag filter selection sync between modal and API query
- Date range filter removed from video filter modal
- API error handling with proper error codes
- Error handling and response consistency in API handlers

### Security

- Database credentials via environment variables (not hardcoded)
- Traefik handles SSL termination
- No secrets stored in Docker images
- bcrypt for password hashing (via Better Auth)

### Documentation

- System architecture documentation
- Database migration guide
- Identity service setup instructions
- Frontend design contracts
- Development roadmap
- Agent skills for Claude Code (shadcn, React best practices, etc.)

[Unreleased]: https://github.com/lgdlong/ttt_v5/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lgdlong/ttt_v5/releases/tag/v1.0.0