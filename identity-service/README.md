# Identity Service

The authentication microservice for TTT v5, built with **Hono**, **Better Auth**, **Kysely**, and **PostgreSQL**.

This service provides a robust, session-based authentication layer separate from the core Go backend, enabling scalable and secure user identity management.

## Key Features

- **Session-based Authentication:** Utilizes secure server-side sessions over stateless JWTs, providing immediate revocation and enhanced security.
- **Interactive Documentation:** Automatically generates an OpenAPI reference for all auth routes using Better Auth's OpenAPI Plugin.
- **Type-safe Database Queries:** Leverages Kysely for robust, strictly-typed SQL execution against PostgreSQL.

## Quick Start

### Prerequisites
- Node.js 20+

### Configuration
The service requires environment variables (loaded automatically from the project root `../../.env` file):

- `DATABASE_URL` - PostgreSQL connection string
- `IDENTITY_PORT` - Port to run the service on (default: `8081`)
- `BETTER_AUTH_URL` - Public URL of this service (e.g., `http://localhost:3001` or `8081`)
- `BETTER_AUTH_SECRET` - Secret string for auth sessions
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Optional OAuth credentials

### Running Locally

```bash
npm install
npm run dev
```

The service runs on `http://localhost:8081` by default.

## API Reference (OpenAPI)

We use the Better Auth **OpenAPI Plugin** to automatically generate documentation for all authentication endpoints.

You can view the interactive Scalar UI by navigating to:
👉 **[http://localhost:8081/api/v1/auth/reference](http://localhost:8081/api/v1/auth/reference)**

This interface allows you to view all available endpoints, their required payloads, schemas, and test them directly from your browser.

## Test Users (`src/infrastructure/database/seeds/users.seed.json`)

The `users.seed.json` file contains pre-defined seed accounts for testing and development purposes.

**Available Accounts:**
- `admin@example.com` / `AdminUser123!` (Admin)
- `john@example.com` / `User1Password!` (User)
- `jane@example.com` / `JaneSecret456!` (User)

*Note: Use these credentials to test sign-in workflows via the OpenAPI UI or the frontend application.*

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST/GET | `/api/v1/auth/*` | All Better Auth endpoints (sign-in, sign-up, session, sign-out, reference) |

## Authentication Mechanism

This service uses **Server-Side Sessions**:
- **Sign In:** Creates a record in the `sessions` database table and sets a secure `session_token` cookie.
- **Validation:** Every request checks the `session_token` cookie against the database.
- **Sign Out:** Deletes the session row from the database, instantly invalidating the cookie.

## Development Guidelines

- **AI Guidelines:** Before modifying this service, review the Better Auth and Identity rules located in the global **[`.agents/rules`](../../.agents/rules)** directory to ensure compliance with our security and implementation standards.
- **Changelog:** Track the evolution of our authentication strategies in the root **[`CHANGELOG.md`](../../CHANGELOG.md)**.
