# TTT v5 - Development Commands
# Run `make` or `make help` to see available commands

.PHONY: help dev build test clean install deps \
	backend-dev backend-build backend-test backend-run backend-lint \
	frontend-dev frontend-build frontend-lint frontend-typecheck \
	db-up db-down db-logs db-reset db-psql \
	db-migrate-up db-migrate-status \
	docker-up docker-down docker-logs docker-build docker-ps \
	ci-test

.DEFAULT_GOAL := help

# =============================================================================
# HELP
# =============================================================================

help: ## Show this help message
	@echo "TTT v5 - Available Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# DEVELOPMENT (All Services)
# =============================================================================

dev: ## Start all services in development mode
	@echo "Starting all services..."
	@make docker-up
	@make backend-run &

build: ## Build all services
	@echo "Building all services..."
	@make backend-build
	@make frontend-build

test: ## Run all tests
	@echo "Running all tests..."
	@make backend-test

ci-test: ## Run CI checks locally before push
	@echo "=========================================="
	@echo "Running CI Test Suite"
	@echo "=========================================="
	@echo ""
	@echo "[1/4] Backend Lint..."
	@make backend-lint
	@echo "✓ Backend Lint passed"
	@echo ""
	@echo "[2/4] Backend Test..."
	@make backend-test
	@echo "✓ Backend Test passed"
	@echo ""
	@echo "[3/4] Frontend Lint..."
	@make frontend-lint
	@echo "✓ Frontend Lint passed"
	@echo ""
	@echo "[4/4] Frontend Build..."
	@make frontend-build
	@echo "✓ Frontend Build passed"
	@echo ""
	@echo "=========================================="
	@echo "All CI checks passed! ✓"
	@echo "=========================================="

clean: ## Clean build artifacts
	@echo "Cleaning..."
	@rm -f ttt-server
	@rm -rf backend/bin
	@rm -rf frontend/dist
	@rm -rf frontend/node_modules/.vite

install: ## Install all dependencies
	@echo "Installing dependencies..."
	@make deps

deps: ## Install all dependencies
	@cd backend && go mod download
	@cd frontend && pnpm install

# =============================================================================
# BACKEND (Go/Gin)
# =============================================================================

backend-dev: ## Start backend in development mode
	@echo "Starting backend (dev)..."
	@cd backend && go run cmd/server/main.go

backend-run: ## Run backend server
	@echo "Generating swagger docs..."
	@cd backend && swag init -g cmd/swag/main.go -o api/docs --parseDependency --parseInternal 2>&1 | grep -v "^2026" || true
	@echo "Starting backend..."
	@cd backend && go run ./cmd/server

backend-build: ## Build backend binary
	@echo "Building backend..."
	@cd backend && go build -o ../ttt-server ./cmd/server

backend-test: ## Run backend tests
	@echo "Running backend tests..."
	@cd backend && go test ./... -v -cover

backend-lint: ## Lint backend code
	@echo "Linting backend..."
	@cd backend && golangci-lint run ./...

swagger: ## Generate swagger docs
	@echo "Generating swagger docs..."
	@cd backend && swag init -g cmd/swag/main.go -o api/docs --parseDependency --parseInternal

# =============================================================================
# FRONTEND (React/TypeScript)
# =============================================================================

frontend-dev: ## Start frontend in development mode
	@echo "Starting frontend (dev)..."
	@cd frontend && pnpm dev

frontend-build: ## Build frontend for production
	@echo "Building frontend..."
	@cd frontend && pnpm build

frontend-preview: ## Preview frontend production build
	@echo "Starting frontend preview..."
	@cd frontend && pnpm preview

frontend-lint: ## Lint frontend code
	@echo "Linting frontend..."
	@cd frontend && pnpm lint

frontend-typecheck: ## Type check frontend
	@echo "Type checking frontend..."
	@cd frontend && pnpm typecheck

# =============================================================================
# DATABASE (PostgreSQL)
# =============================================================================

docker-up: ## Start all docker services
	@echo "Starting docker services..."
	@docker compose up -d

docker-down: ## Stop all docker services
	@echo "Stopping docker services..."
	@docker compose down

docker-logs: ## Show docker logs
	@docker compose logs -f

docker-build: ## Build docker images
	@docker compose build

docker-ps: ## Show running containers
	@docker compose ps

db-up: docker-up ## Start database containers

db-down: docker-down ## Stop database containers

db-logs: ## Show database logs
	@docker compose logs -f db

db-reset: ## Reset database (WARNING: deletes all data)
	@echo "Resetting database..."
	@docker compose down -v
	@docker compose up -d

db-psql: ## Connect to PostgreSQL
	@docker compose exec db psql -U postgres -d ttt_project

db-migrate-up: ## Run all pending migrations
	@echo "Running migrations..."
	@cd backend && go run ./cmd/migrate

db-migrate-status: ## Show migration status
	@echo "Checking migration status..."
	@cd backend && go run ./cmd/migrate -check

db-seed: ## Seed database
	@echo "Seeding database..."
	@cd backend && go run ./cmd/seed
