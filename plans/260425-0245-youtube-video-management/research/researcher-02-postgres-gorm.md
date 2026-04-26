# PostgreSQL Soft Delete + GORM Patterns - Research Report

## Soft Delete Pattern

**SQL column:**
```sql
deleted_at TIMESTAMP NULL
```

**Query filter (exclude deleted):**
```sql
WHERE deleted_at IS NULL
```

**GORM Model:**
```go
import "gorm.io/plugin/softdelete"

type Video struct {
    ID          string         `gorm:"primaryKey;size:20"`
    Title       string        `gorm:"size:255"`
    ThumbnailURL string       `gorm:"size:500"`
    Duration    int           `gorm:"default:0"`
    Author      string        `gorm:"size:255"`
    UploadDate  time.Time     `gorm:"autoCreateTime"`
    CreatedAt   time.Time     `gorm:"autoCreateTime"`
    UpdatedAt   time.Time     `gorm:"autoUpdateTime"`
    DeletedAt   softdelete.DeletedAt `gorm:"index"`
}
```

**Global scope for soft delete:**
```go
func ActiveVideos(db *gorm.DB) *gorm.DB {
    return db.Where("deleted_at IS NULL")
}
```

## Many-to-Many: Video Tags Junction Table

**video_tags table (no PK - composite key):**
```sql
CREATE TABLE video_tags (
    youtube_id VARCHAR(20) NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (youtube_id, tag_id),
    FOREIGN KEY (youtube_id) REFERENCES youtube_videos(youtube_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

**GORM models:**
```go
type Tag struct {
    ID    uint      `gorm:"primaryKey"`
    Name  string    `gorm:"size:50;uniqueIndex"`
    Videos []Video  `gorm:"many2many:video_tags;"`
}

type Video struct {
    YouTubeID string `gorm:"primaryKey;size:20"`
    // ... other fields
    Tags     []Tag   `gorm:"many2many:video_tags;"`
}
```

## Gin Rate Limiting Middleware

```go
import "golang.org/x/time/rate"

func RateLimiter(rps int) gin.HandlerFunc {
    limiter := rate.NewLimiter(rate.Limit(rps), rps)
    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.AbortWithStatusJSON(429, gin.H{
                "success": false,
                "error": gin.H{"code": "RATE_LIMIT", "message": "Too many requests"},
            })
            return
        }
        c.Next()
    }
}
```
Usage: `app.Use(middleware.RateLimiter(100))` for 100 req/min

## Atlas Migration Syntax

```sql
-- database/migrations/20260425_initial.up.sql

CREATE TABLE youtube_videos (
    youtube_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INT DEFAULT 0,
    author VARCHAR(255),
    upload_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_videos_deleted_at ON youtube_videos(deleted_at)
    WHERE deleted_at IS NULL;

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE video_tags (
    youtube_id VARCHAR(20) NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (youtube_id, tag_id),
    FOREIGN KEY (youtube_id) REFERENCES youtube_videos(youtube_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## GORM Indexes

```go
type Video struct {
    YouTubeID string `gorm:"primaryKey;size:20"`
    // ...
    DeletedAt softdelete.DeletedAt `gorm:"index"`
}
```

## Unresolved Questions

1. Should video_tags have its own auto-generated ID column for easier tracking? (User said "no PK" but composite key is fine)