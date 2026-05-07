# Identity Service

Authentication microservice built with Hono + Better Auth + Kysely + PostgreSQL.

## Quick Start

```bash
npm install
npm run dev
```

Runs on `http://localhost:3001`

## Configuration

Requires environment variables (loaded from project root `.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_URL` - Public URL of this service (default: http://localhost:3001)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Optional OAuth credentials

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST/GET | `/api/auth/*` | All auth endpoints (sign-in, sign-up, session, verification) |

## Tech Stack

- Hono - Lightweight web framework
- Better Auth - Authentication library
- Kysely - Type-safe SQL query builder
- pg - PostgreSQL driver