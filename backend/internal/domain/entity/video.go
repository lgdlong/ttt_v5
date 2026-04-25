package entity

import "time"

// Video represents a YouTube video entity
type Video struct {
	YoutubeID       string     `json:"youtube_id" gorm:"column:youtube_id;primaryKey"`
	Title           string     `json:"title" gorm:"column:title"`
	ThumbnailURL    string     `json:"thumbnail_url" gorm:"column:thumbnail_url"`
	DurationSeconds int        `json:"duration_seconds" gorm:"column:duration_seconds"`
	Author          string     `json:"author" gorm:"column:author"`
	UploadDate      *time.Time `json:"upload_date,omitempty" gorm:"column:upload_date"`
	CreatedAt       time.Time  `json:"created_at" gorm:"column:created_at"`
	UpdatedAt       time.Time  `json:"updated_at" gorm:"column:updated_at"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty" gorm:"column:deleted_at"`
	Tags            []Tag      `json:"tags" gorm:"many2many:video_tags;foreignKey:YoutubeID;joinForeignKey:youtube_id;joinReferences:tag_id"`
}

// TableName returns the table name for GORM
func (Video) TableName() string {
	return "youtube_videos"
}
