# Gin CRUD Handler Patterns - Research Report

## Handler Signature

```go
func CreateVideo(c *gin.Context) {
    // logic
}
```

## Request Binding

Use `ShouldBindJSON` (doesn't auto-abort on error):
```go
type CreateVideoRequest struct {
    YouTubeURL string `json:"youtube_url" binding:"required,url"`
}

func CreateVideo(c *gin.Context) {
    var req CreateVideoRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"code": "BAD_REQUEST", "message": err.Error()}})
        return
    }
}
```

## Response Format

```go
c.JSON(http.StatusOK, gin.H{
    "success": true,
    "data":    video,
    "error":   nil,
})

c.JSON(http.StatusBadRequest, gin.H{
    "success": false,
    "data":    nil,
    "error":   gin.H{"code": "INVALID_INPUT", "message": "..."},
})
```

## Error Handling

Custom error type:
```go
type AppError struct {
    Status  int    `json:"-"`
    Code    string `json:"code"`
    Message string `json:"message"`
}

func (e *AppError) Error() string {
    return e.Message
}

// Usage
return &AppError{Status: 404, Code: "NOT_FOUND", Message: "Video not found"}
```

Wrap errors with context:
```go
return fmt.Errorf("create video: %w", err)
```

## GORM CRUD

```go
// Create
video := Video{YouTubeID: id, Title: title}
if err := db.Create(&video).Error; err != nil {
    return nil, fmt.Errorf("create: %w", err)
}

// Find one
var video Video
if err := db.First(&video, "youtube_id = ?", id).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, &AppError{Status: 404, Code: "NOT_FOUND", Message: "Video not found"}
    }
    return nil, err
}

// Update
if err := db.Model(&video).Updates(map[string]interface{}{"title": title}).Error; err != nil {
    return nil, fmt.Errorf("update: %w", err)
}

// Soft Delete
if err := db.Delete(&video).Error; err != nil {  // GORM uses DeletedAt
    return nil, fmt.Errorf("delete: %w", err)
}
```

## Context for YouTube Video

POST body only needs `youtube_url`. Backend extracts ID and fetches metadata from YouTube API. PUT/PATCH can update title etc.

## Key Go Standards

- PascalCase for exported functions
- Error wrapping: `fmt.Errorf("operation: %w", err)`
- Struct tags for validation
- Consistent JSON response structure