# GEMINI.md

This file provides guidance to Gemini (or any AI assistant using Google's models) when working with code in this repository.

**IMPORTANT:** Always read the local skills available to you in `.agents/skills` or `.claude/rules/` directory for project-specific rules and workflows before starting any task. You MUST ALWAYS follow all rules defined in these directories.

## Key Information

- **Agent Name**: Gemini 3.1 Pro (High) / Antigravity
- **Role**: Powerful AI coding assistant pair-programming with the user.

## Quick Commands

```bash
# Start all services (Docker)
docker-compose up --build

# Local development
make dev                    # Start backend + frontend
npm run dev --prefix identity-service # Start Identity service

# Build & Test
make build                 # Build all
make test                  # Run all tests
```

## Architecture

This is a Go + Node.js + React microservices/full-stack app:

- **Backend (Go)**: Clean Architecture (cmd, delivery, application, domain, repository). Uses Gin and GORM.
- **Identity Service (Node.js)**: Runs on port 8081, built with Hono, Better Auth, and Kysely. Connects to the same PostgreSQL database.
- **Frontend (React)**: React 19 + Vite + Tailwind CSS v4 with shadcn/ui patterns.
- **Database (PostgreSQL)**: Shared across services.

## Available Workflows

- Use `@[/cook]` for smart feature implementation and systematic workflow execution.
- Use `@[/debug]` for structured debugging and root cause analysis.
- Check out other local workflows/skills explicitly attached or in your tools.

## Development Workflow

1. Always run tests after code changes if they are available.
2. Follow Clean Architecture principles for the Go backend.
3. Use Better Auth for any authentication/authorization-related logic instead of implementing it manually.
4. Provide structured updates to documentation (`docs/`, `README.md`, `CLAUDE.md`, etc.) when significant components are implemented.
5. Strictly adhere to all project-specific rules located in `.claude/rules` and `.agents/skills`.
