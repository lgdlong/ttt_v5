package dto

import "time"

// VideoFilter holds query parameters for filtering videos
type VideoFilter struct {
	Query  string `form:"q"`
	TagIDs []uint `form:"tag_ids"`
	Sort   string `form:"sort"`
	Order  string `form:"order"`
	Page   int    `form:"page"`
	Limit  int    `form:"limit"`
}

// Normalize sets default values for video filter
func (f *VideoFilter) Normalize() {
	if f.Sort == "" {
		f.Sort = "created_at"
	}
	if f.Order == "" {
		f.Order = "desc"
	}
	if f.Limit <= 0 || f.Limit > 100 {
		f.Limit = 20
	}
	if f.Page <= 0 {
		f.Page = 1
	}
}

// CreateVideoRequest represents the request to create a new video
type CreateVideoRequest struct {
	YouTubeURL string `json:"youtube_url" binding:"required,url"`
}

// UpdateVideoRequest represents the request to update a video
type UpdateVideoRequest struct {
	Title        *string `json:"title"`
	ThumbnailURL *string `json:"thumbnail_url"`
}

// PaginationMeta holds pagination metadata
type PaginationMeta struct {
	Page       int   `json:"page"`
	PageSize   int   `json:"page_size"`
	TotalCount int64 `json:"total_count"`
	TotalPages int   `json:"total_pages"`
}

// VideoResponse represents a video in API responses
type VideoResponse struct {
	YouTubeID       string        `json:"youtube_id"`
	Title           string        `json:"title"`
	ThumbnailURL    string        `json:"thumbnail_url"`
	DurationSeconds int           `json:"duration_seconds"`
	Author          string        `json:"author"`
	UploadDate      *time.Time    `json:"upload_date,omitempty"`
	Tags            []TagResponse `json:"tags,omitempty"`
}

// VideoListResponse represents a paginated list of videos
type VideoListResponse struct {
	Data []VideoResponse `json:"data"`
	Meta PaginationMeta   `json:"meta"`
}