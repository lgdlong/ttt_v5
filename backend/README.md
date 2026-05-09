# TTT v5 - Backend Service

The core backend service for the TTT v5 platform. It is built with **Go 1.25** and utilizes the **Gin Web Framework** to deliver a fast, reliable, and well-structured RESTful API.

## Architecture

The backend follows a Clean Architecture approach to ensure maintainability and testability:
- **`cmd/`**: Application entry points (e.g., the main server).
- **`internal/application/`**: Business logic and use cases.
- **`internal/domain/`**: Core domain models and entities.
- **`internal/delivery/http/`**: HTTP handlers, routing, and Gin configurations.
- **`internal/infrastructure/`**: Database connections, repositories, and external service integrations.

## Key Features

- **Video & Tag Management:** REST APIs with pagination to serve and manage curated videos and their associated tags.
- **Advanced Filtering:** Capabilities to filter videos based on complex tagging logic (AND logic).
- **REST Best Practices:** Standardized JSON responses (`success`, `data`, `error` structure).
- **Interactive Documentation:** Automatically generated OpenAPI/Swagger documentation.

## Getting Started

### Prerequisites
- Go 1.25+
- PostgreSQL 17 (running locally or via Docker)

### Environment Variables
Ensure you have the required `.env` variables configured at the project root. The backend requires:
- `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`
- `BACKEND_PORT` (default: 8080)
- `GIN_MODE`
- `YOUTUBE_API_KEY`

### Running Locally

To start the server locally:
```bash
go run ./cmd/server
```
The server will start on `http://localhost:8080`.

## API Documentation

Once the server is running, you can access the Swagger UI for interactive API documentation at:
👉 **[http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)**

## Testing

Run the test suite:
```bash
go test ./...
```

## Development Guidelines

- Please refer to the global **[`.agents/rules`](../../.agents/rules)** directory for coding standards and agent pair-programming constraints.
- See the root **[`CHANGELOG.md`](../../CHANGELOG.md)** for a historical record of API changes and enhancements.
