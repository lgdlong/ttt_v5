package entity

import "time"

// Tag represents a tag entity
type Tag struct {
	ID        int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"column:name;uniqueIndex"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"column:updated_at;autoUpdateTime"`
	Videos    []Video   `json:"videos" gorm:"many2many:video_tags"`
}