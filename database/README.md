# TTT v5 - Database Infrastructure

This directory contains the database migration scripts and configuration for the TTT v5 platform. We utilize **PostgreSQL 17** for robust, relational data storage.

## Architecture & Migrations

To maintain a strict and predictable database schema, we use **[Atlas](https://atlasgo.io/)** for declarative schema migrations instead of relying on application-level auto-migration (e.g., GORM's `AutoMigrate`). 

This ensures:
- Full visibility into schema changes before they are applied.
- Deterministic deployments.
- Safe rollback procedures.

## Core Tables

The database is shared across our microservices (Backend and Identity Service) and includes the following primary entities:

- **`youtube_videos`**: Stores curated video metadata.
- **`tags`**: Defines customizable tags with thematic colors.
- **`video_tags`**: A join table mapping the many-to-many relationship between videos and tags.
- **`user`**, **`session`**, **`account`**: Identity and authentication tables managed by the Better Auth ecosystem.

## Migration Workflow

When modifying the database schema, follow these steps:

1. **Update Schema Definitions:** Modify the Go structs or Kysely schemas to reflect the desired state.
2. **Generate Migrations:** Use the Atlas CLI to inspect the database against the desired state and generate SQL migration files.
3. **Apply Migrations:** Run the generated SQL files against your target database using Atlas or Goose.

*For detailed migration commands, refer to the Makefile at the project root.*

## Standards & Documentation

- **Development Rules:** Any changes to the schema or migration strategy must adhere to the policies outlined in the global **[`.agents/rules`](../../.agents/rules)** directory. 
- **Version History:** Major schema alterations and their justifications are documented in the root **[`CHANGELOG.md`](../../CHANGELOG.md)**.
