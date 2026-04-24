package entity

import "time"

// Video represents a YouTube video entity
type Video struct {
	ID              int64      `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	YoutubeID       string     `json:"youtube_id" gorm:"column:youtube_id;uniqueIndex"`
	Title           string     `json:"title" gorm:"column:title"`
	Description     string     `json:"description" gorm:"column:description"`
	ThumbnailURL    string     `json:"thumbnail_url" gorm:"column:thumbnail_url"`
	DurationSeconds int        `json:"duration_seconds" gorm:"column:duration_seconds"`
	Author          string     `json:"author" gorm:"column:author"`
	ViewCount       int64      `json:"view_count" gorm:"column:view_count"`
	LikeCount       int        `json:"like_count" gorm:"column:like_count"`
	UploadDate      *time.Time `json:"upload_date,omitempty" gorm:"column:upload_date"`
	CreatedAt       time.Time  `json:"created_at" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt       time.Time  `json:"updated_at" gorm:"column:updated_at;autoUpdateTime"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty" gorm:"column:deleted_at"`
	Tags            []Tag      `json:"tags" gorm:"many2many:video_tags"`
}