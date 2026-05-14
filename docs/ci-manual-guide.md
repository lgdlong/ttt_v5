# Manual CI Execution Guide

This guide explains how to run the CI (Continuous Integration) checks manually on your local machine. It is recommended to run these checks before pushing code to the `main` or `dev` branches.

## Prerequisites

Ensure you have the following installed on your machine:
- **Go 1.25+** (for Backend)
- **Node.js 24+** (for Frontend and Identity Service)
- **golangci-lint** (for Backend linting)
    - Install via: `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`
- **npm** (Package manager)

## Running All Checks

The simplest way to run all CI checks (Backend, Frontend, and Identity) is using the provided `Makefile` command:

```bash
make ci-test
```

This command will sequentially run:
1. **Backend Linting**: Using `golangci-lint`.
2. **Backend Tests**: Using `go test`.
3. **Frontend Linting**: Using `npm run lint`.
4. **Frontend Build**: Using `npm run build`.
5. **Identity Build**: Using `npm run build`.

## Running Individual Checks

If you only want to run checks for a specific service, you can use the following commands:

### Backend
- **Linting**: `make backend-lint`
- **Testing**: `make backend-test`
- **Building**: `make backend-build`

### Frontend
- **Linting**: `make frontend-lint`
- **Building**: `make frontend-build`
- **Type Checking**: `make frontend-typecheck`

### Identity Service
- **Building**: `make identity-build`
- **Testing**: `make identity-test`

## Why Run CI Locally?

- **Faster Feedback**: Catch errors before waiting for GitHub Actions to complete.
- **Clean Git History**: Avoid "fix lint" or "fix build" commits by ensuring everything passes locally first.
- **Consistency**: The local `make ci-test` command is designed to mirror the checks performed in the GitHub Actions workflow.

## Troubleshooting

- **Linting fails**: Run the specific lint command and fix the reported issues.
- **Build fails**: Ensure all dependencies are installed using `make deps`.
- **Node.js Version**: Ensure you are using Node.js 24. You can check your version with `node -v`.
