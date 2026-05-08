# Identity Service

Authentication microservice built with **Hono**, **Better Auth**, **Kysely**, and **PostgreSQL**.

## Quick Start

```bash
npm install
npm run dev
```

The service runs on `http://localhost:8081` by default (configurable via `IDENTITY_PORT`).

## Configuration

Requires environment variables (loaded automatically from the project root `../../.env` file):
- `DATABASE_URL` - PostgreSQL connection string
- `IDENTITY_PORT` - Port to run the service on (default: `8081`)
- `BETTER_AUTH_URL` - Public URL of this service (e.g., `http://localhost:8081`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Optional OAuth credentials

## API Reference (OpenAPI)

We use the Better Auth **OpenAPI Plugin** to automatically generate documentation for all authentication endpoints. 

You can view the interactive Scalar UI by navigating to:
👉 **[http://localhost:8081/api/v1/auth/reference](http://localhost:8081/api/v1/auth/reference)**

This interface allows you to view all available endpoints, their required payloads, schemas, and even test them directly from your browser.

## Test Users (`src/infrastructure/database/seeds/users.seed.json`)

File `users.seed.json` chứa danh sách các tài khoản (seeds) được định nghĩa sẵn phục vụ cho mục đích test và phát triển. Có nhiều role khác nhau (`admin`, `user`).

**Available Accounts:**
- `admin@example.com` / `AdminUser123!` (Admin)
- `john@example.com` / `User1Password!` (User)
- `jane@example.com` / `JaneSecret456!` (User)
- `dev@example.com` / `DevPassword789!` (Admin)
- `tester@example.com` / `TesterPass321!` (User)

*Note: You can use these credentials to test sign-in workflows via the OpenAPI UI or your frontend application.*

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check (returns "Identity Service") |
| POST/GET | `/api/v1/auth/*` | All Better Auth endpoints (sign-in, sign-up, session, sign-out, reference) |

## Authentication Mechanism

This service uses **Server-Side Sessions** instead of JWTs.
- **Sign In:** Creates a record in the `sessions` database table and sets a secure `session_token` cookie on the client.
- **Validation:** Every request checks the `session_token` cookie against the database to ensure it exists and hasn't expired.
- **Sign Out:** Deletes the session row from the database, instantly invalidating the cookie without needing a blacklist.
- **Expiration:** Managed by the database record (`expiresAt`). The session is automatically extended if the user is active (sliding expiry).

## Tech Stack

- **[Hono](https://hono.dev/)** - Fast, lightweight web framework
- **[Better Auth](https://better-auth.com/)** - Comprehensive authentication library
- **[Kysely](https://kysely.dev/)** - Type-safe SQL query builder
- **PostgreSQL (`pg`)** - Relational database