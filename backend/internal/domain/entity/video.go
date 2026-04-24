package entity

import "time"

// Video represents a YouTube video entity
type Video struct {
	ID              int64     `json:"id" db:"id"`
	YoutubeID       string    `json:"youtube_id" db:"youtube_id"`
	Title           string    `json:"title" db:"title"`
	Description     string    `json:"description" db:"description"`
	ThumbnailURL    string    `json:"thumbnail_url" db:"thumbnail_url"`
	DurationSeconds int       `json:"duration_seconds" db:"duration_seconds"`
	Author          string    `json:"author" db:"author"`
	ViewCount       int64     `json:"view_count" db:"view_count"`
	LikeCount       int       `json:"like_count" db:"like_count"`
	UploadDate      *time.Time `json:"upload_date,omitempty" db:"upload_date"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
}