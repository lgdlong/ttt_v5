# Advanced GET APIs - Filter/Sort/Paginate - Research Report

## Query Parameter Parsing

```go
search := c.Query("search")
tags := c.Query("tags")
sortBy := c.DefaultQuery("sort", "created_at")
order := c.DefaultQuery("order", "desc")
limitStr := c.DefaultQuery("limit", "20")
offsetStr := c.DefaultQuery("offset", "0")
```

## GORM WHERE with Multiple Filters

```go
query := db.Model(&Video{}).Where("deleted_at IS NULL")

if search := c.Query("search"); search != "" {
    pattern := "%" + search + "%"
    query = query.Where("title ILIKE ? OR author ILIKE ?", pattern, pattern)
}

if tags := c.Query("tags"); tags != "" {
    query = query.Joins("JOIN video_tags ON youtube_videos.youtube_id = video_tags.youtube_id").
        Where("video_tags.tag_id = ?", tags)
}

if author := c.Query("author"); author != "" {
    query = query.Where("author ILIKE ?", "%"+author+"%")
}
```

## Sort Field Allow-listing

```go
allowedSorts := map[string]bool{
    "upload_date": true, "title": true, "duration_seconds": true, "created_at": true,
}

if !allowedSorts[sortBy] {
    sortBy = "created_at"
}
if order != "asc" {
    order = "desc"
}

query.Order(sortBy + " " + order)
```

## Pagination

```go
limit, _ := strconv.Atoi(limitStr)
offset, _ := strconv.Atoi(offsetStr)
if limit <= 0 || limit > 100 {
    limit = 20
}

var videos []Video
var total int64

query.Count(&total)
query.Limit(limit).Offset(offset).Find(&videos)
```

## Tag Filtering with JOINs

```go
if tagIDs := c.Query("tag_ids"); tagIDs != "" {
    query = query.Joins("JOIN video_tags ON youtube_videos.youtube_id = video_tags.youtube_id").
        Where("video_tags.tag_id IN ?", strings.Split(tagIDs, ","))
}
```

## Response with Meta

```go
c.JSON(http.StatusOK, gin.H{
    "success": true,
    "data":    videos,
    "meta": gin.H{
        "total":  total,
        "limit":  limit,
        "offset": offset,
    },
})
```

## Filter on YouTubeVideos Only

- `search`: title OR author ILIKE
- `author`: exact match or ILIKE
- `tag_ids`: JOIN video_tags
- `upload_date_from`, `upload_date_to`: date range

## Unresolved Questions

1. Should pagination use cursor-based for large datasets? (Offset is simpler but cursor is more performant)
2. Should search be case-insensitive? (Yes, use ILIKE)