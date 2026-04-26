# Phase 02: Backend Models & Repository

## Context

- Parent: plan.md
- Depends on: Phase-01 (database schema)
- Research: research/researcher-02-postgres-gorm.md, research/researcher-03-gin-crud.md

## Overview

**Date:** 2026-04-25
**Description:** Create Go models and repository layer for videos, tags, video_tags with GORM soft delete support.
**Priority:** P1
**Status:** pending

## Key Insights

- Video model uses youtube_id as primary key (string)
- GORM soft delete plugin handles deleted_at filtering automatically
- Repository pattern separates data access from handlers
- YouTube API client in pkg/youtube/ fetches video metadata

## Requirements

### Entities (domain/entity/)

**video.go:** - No GORM tags, pure struct
```go
type Video struct {
    YouTubeID      string
    Title          string
    ThumbnailURL   string
    DurationSeconds int
    Author         string
    UploadDate     *time.Time
    CreatedAt      time.Time
    UpdatedAt      time.Time
}
```

**tag.go:**
```go
type Tag struct {
    ID        uint
    Name      string
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

**video_tag.go:**
```go
type VideoTag struct {
    YouTubeID string
    TagID     uint
    CreatedAt time.Time
}
```

### DTOs (domain/dto/)

**video_dto.go:**
```go
type CreateVideoRequest struct {
    YouTubeURL string `json:"youtube_url" binding:"required,url"`
}

type UpdateVideoRequest struct {
    Title        *string `json:"title"`
    ThumbnailURL *string `json:"thumbnail_url"`
    // ...
}

type VideoResponse struct {
    YouTubeID      string    `json:"youtube_id"`
    Title          string    `json:"title"`
    ThumbnailURL   string    `json:"thumbnail_url"`
    DurationSeconds int      `json:"duration_seconds"`
    Author         string    `json:"author"`
    UploadDate     *time.Time `json:"upload_date,omitempty"`
    Tags           []TagResponse `json:"tags,omitempty"`
}

type VideoListResponse struct {
    Videos []VideoResponse `json:"videos"`
    Meta   PaginationMeta  `json:"meta"`
}
```

**tag_dto.go:**
```go
type CreateTagRequest struct {
    Name string `json:"name" binding:"required,min=1,max=50"`
}

type TagResponse struct {
    ID   uint   `json:"id"`
    Name string `json:"name"`
}
```

### Repository Ports (domain/port/)

**video_repository.go:**
```go
type VideoRepository interface {
    Create(ctx context.Context, video *entity.Video) error
    GetByID(ctx context.Context, youtubeID string) (*entity.Video, error)
    List(ctx context.Context, filter VideoFilter) ([]entity.Video, int64, error)
    GetByTagID(ctx context.Context, tagID uint, filter VideoFilter) ([]entity.Video, int64, error)
    Update(ctx context.Context, video *entity.Video) error
    Delete(ctx context.Context, youtubeID string) error
    AttachTag(ctx context.Context, youtubeID string, tagID uint) error
    DetachTag(ctx context.Context, youtubeID string, tagID uint) error
}
```

**tag_repository.go:**
```go
type TagRepository interface {
    Create(ctx context.Context, tag *entity.Tag) error
    GetByID(ctx context.Context, id uint) (*entity.Tag, error)
    List(ctx context.Context) ([]entity.Tag, error)
    Update(ctx context.Context, tag *entity.Tag) error
    Delete(ctx context.Context, id uint) error
}
```

### GORM Repository Implementation (repository/)

**video_repo.go:** implements port.VideoRepository using gorm.DB

### YouTube Client (pkg/youtube/)

**client.go:**
- ExtractVideoID(url string) (string, error)
- FetchVideoMetadata(ctx context.Context, videoID string) (*VideoMetadata, error)

## Architecture

**Clean Architecture with domain/ folder:**
```
backend/internal/
├── domain/
│   ├── entity/          # Video, Tag (pure structs, no framework)
│   ├── dto/             # Request/Response DTOs
│   └── port/            # Repository interfaces (Ports)
├── application/
│   └── service/         # Business logic (uses domain ports)
├── repository/          # GORM implementations (Adapters)
│   ├── video_repo.go
│   └── tag_repo.go
└── delivery/
    └── handler/         # HTTP handlers (calls app service)
```

**Key Point:** domain/ has NO GORM imports. Repository interfaces in port/ define contracts. GORM implementations in repository/. Application service contains business logic.

## Related Code Files

All files in this phase are NEW. No existing files modified.

## File Ownership

- backend/internal/domain/entity/video.go
- backend/internal/domain/entity/tag.go
- backend/internal/domain/entity/video_tag.go
- backend/internal/domain/dto/video_dto.go
- backend/internal/domain/dto/tag_dto.go
- backend/internal/domain/port/video_repository.go
- backend/internal/domain/port/tag_repository.go
- backend/internal/repository/video_repo.go (implements port.VideoRepository)
- backend/internal/repository/tag_repo.go (implements port.TagRepository)
- backend/pkg/youtube/client.go

## Implementation Steps

1. Create domain/entity/ - Video, Tag, VideoTag structs (no GORM)
2. Create domain/dto/ - Request/Response DTOs
3. Create domain/port/ - Repository interfaces
4. Create pkg/youtube/client.go - ExtractVideoID, FetchVideoMetadata
5. Create repository/ - GORM implementations of port interfaces
6. Wire all in main.go

## Todo

- [ ] Create domain/entity/video.go
- [ ] Create domain/entity/tag.go
- [ ] Create domain/entity/video_tag.go
- [ ] Create domain/dto/video_dto.go
- [ ] Create domain/dto/tag_dto.go
- [ ] Create domain/port/video_repository.go
- [ ] Create domain/port/tag_repository.go
- [ ] Create pkg/youtube/client.go
- [ ] Create repository/video_repo.go (GORM impl)
- [ ] Create repository/tag_repo.go (GORM impl)

## Success Criteria

- All models compile without errors
- Repository functions handle soft delete automatically
- YouTube ID extraction works for all URL formats

## Conflict Prevention

Phase 02 owns: internal/domain/, pkg/youtube/, internal/repository/
Phase 03 owns: internal/delivery/
Phase 01 owns: database/

No file overlap.

## Risk Assessment

- Low risk: Pure Go code, no external dependencies beyond existing go.mod

## Security Considerations

- Validate youtube_id format (11 chars alphanumeric)
- Sanitize search inputs to prevent SQL injection (GORM handles parameterized queries)

## Next Steps

Phase 03 (API Handlers) depends on these models and repositories being defined.