package entity

import "time"

// Tag represents a tag entity
type Tag struct {
	ID        int64     `json:"id" gorm:"column:id"`
	Name      string    `json:"name" gorm:"column:name"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt time.Time `json:"updated_at" gorm:"column:updated_at"`
	Videos    []Video   `json:"videos" gorm:"many2many:video_tags"`
}