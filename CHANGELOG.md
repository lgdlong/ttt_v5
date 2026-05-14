# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-05-14

### Added

#### Frontend & UI
- Professional `User Profile` page with account management and secure deletion flows
- High-fidelity `404 Not Found` page with custom illustrations and responsive design
- Enhanced mobile navigation with dedicated `Drawer` and high-contrast logout actions
- New `useMobile` hook for granular responsive layout control

#### CI/CD & Quality
- Standardized local CI validation workflow via `make ci-test`
- Comprehensive `Manual CI Execution Guide` for developers
- Automatic redirection for unauthorized admin access attempts

### Changed
- Standardized localization strings for error pages and profile management
- Refined mobile navigation hierarchy for better accessibility

### Fixed
- Navigation layout conflicts on mobile devices
- Role-based redirection logic for authenticated admins

## [1.1.0] - 2026-05-14

### Added

#### Frontend & UI
- Integrated Mantine-based `Header` component with responsive navigation
- Dedicated `Login` and `Register` pages for user authentication
- Loading indicators using Mantine `Loader` in video grid and filter sidebar
- Improved `PublicLayout` with standardized header and footer integration

#### Identity Service
- Integrated Better Auth Admin plugin for role-based access control
- Database schema for roles and administrative management
- Support for dynamic trusted origins to resolve CORS issues
- Enhanced auth client initialization and configuration

#### Infrastructure & DevOps
- Service-specific `.dockerignore` files for optimized build contexts
- Multi-stage production Dockerfiles with cache mounts for faster builds
- Optimized `Makefile` for production deployment workflows
- Standardized domain configuration for `the1struleoffightclub.top`
- Improved environment variable structure and validation

#### Documentation
- Factual updates to `README.md` reflecting v1.1.0 capabilities
- New `auth-verification-strategy.md` documenting authentication flows
- Updated `docker-build-push-guide.md` with registry optimization tips
- Standardized `.env.example` for production-ready deployments

### Fixed
- Identity service healthcheck port alignment with Docker
- CORS issues between frontend and identity microservice
- Docker build hangs by optimizing context via `.dockerignore`
- Environment variable syncing across services

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