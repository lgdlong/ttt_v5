# Go Gin Clean Architecture Research Report

## 1. Clean Architecture Layers

### Four-Layer Structure (Enterprise Best Practice)
```
domain/          # Business entities & interfaces (no external dependencies)
application/     # Use cases, business logic, DTOs
infrastructure/  # External services: DB, cache, external APIs
delivery/        # HTTP handlers, Gin routes, middleware
```

### Layer Dependencies
- Domain: Pure Go, no imports from other layers
- Application: Depends only on Domain
- Infrastructure: Implements Domain interfaces
- Delivery: Depends on Application, uses Infrastructure

## 2. Go Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── domain/                  # Business entities
│   │   ├── entity/              # Core business objects
│   │   ├── repository/          # Repository interfaces
│   │   └── service/             # Domain service interfaces
│   ├── application/            # Use cases
│   │   ├── usecase/            # Business use cases
│   │   └── dto/                # Data transfer objects
│   ├── infrastructure/
│   │   ├── database/           # GORM/pgx setup, migrations
│   │   ├── repository/         # Repository implementations
│   │   └── external/          # External API clients
│   └── delivery/
│       ├── handler/            # Gin HTTP handlers
│       ├── middleware/         # Gin middleware
│       ├── router/            # Route definitions
│       └── response/          # Response helpers
├── migrations/                 # Goose SQL migrations
├── docs/                        # Swagger generated docs
├── config/
│   └── config.go               # Configuration loading
├── pkg/
│   └── utils/                   # Shared utilities
└── scripts/
    └── migrate.sh              # Migration scripts
```

## 3. Gin Middleware Best Practices

```go
// Middleware chain order
r := gin.New()
r.Use(gin.Logger())           // Logging first
r.Use(gin.Recovery())         // Panic recovery
r.Use(cors.Middleware())      // CORS
r.Use(ratelimit.Middleware()) // Rate limiting
r.Use(auth.Middleware())      // Auth (if needed)
r.Use(requestid.Middleware()) // Request ID
```

### Custom Middleware Pattern
```go
func RequestLogger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()
        latency := time.Since(start)
        log.Printf("[%d] %s %s - %v", c.Writer.Status(), c.Request.Method, c.Request.URL.Path, latency)
    }
}
```

### Error Handling Middleware
```go
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()
        if len(c.Errors) > 0 {
            // Map errors to HTTP status codes
            c.JSON(mapErrorToStatus(c.Errors.Last()))
        }
    }
}
```

## 4. GORM + PostgreSQL Setup (jackc/pgx/v5)

```go
import (
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

dsn := "host=localhost user=postgres dbname=mydb port=5432 sslmode=disable"
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Info),
    SkipDefaultTransaction: true,
    PrepareStmt: true,
})
if err != nil {
    log.Fatal("failed to connect database")
}

// Connection pool
sqlDB, _ := db.DB()
sqlDB.SetMaxIdleConns(10)
sqlDB.SetMaxOpenConns(100)
sqlDB.SetConnMaxLifetime(time.Hour)
```

### pgx driver: Use `gorm.io/driver/postgres` which wraps jackc/pgx/v5 automatically.

## 5. Goose Migrations Setup

```bash
# Create migration
goose create add_users_table sql

# Run migrations
goose postgres "user=postgres dbname=mydb sslmode=disable" up

# Programmatic usage
db, _ := goose.OpenDBWithDriver("postgres", dsn)
goose.Up(db, "migrations")
```

### Migration file naming: `YYYYMMDDHHMMSS_description.sql`

## 6. Swaggo/Swagger Setup

```bash
# Install swag CLI
go install github.com/swaggo/swag/cmd/swag@latest

# Generate docs
swag init -g cmd/server/main.go -o docs
```

### Route setup
```go
import (
    ginSwagger "github.com/swaggo/gin-swagger"
    swaggerFiles "github.com/swaggo/files"
    _ "./docs" // generated docs
)

// @title My API
// @version 1.0
// @host localhost:8080
// @BasePath /api/v1

r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
```

## Key Dependencies
| Package | Purpose |
|---------|---------|
| github.com/gin-gonic/gin | HTTP framework |
| github.com/jackc/pgx/v5 | PostgreSQL driver |
| gorm.io/gorm | ORM |
| gorm.io/driver/postgres | GORM PostgreSQL driver |
| github.com/pressly/goose/v3 | Database migrations |
| github.com/swaggo/gin-swagger | Swagger UI |
| github.com/swaggo/swag | Swagger generation |
| github.com/google/uuid | UUID generation |
| github.com/joho/godotenv | ENV loading |
| github.com/stretchr/testify | Testing |
| google.golang.org/genai | Google AI |

## Recommended
- Use `internal/` for private packages
- Use `cmd/` for entry points
- Use `pkg/` for public, reusable packages
- Keep files under 200 lines
- Group by feature, not by file type