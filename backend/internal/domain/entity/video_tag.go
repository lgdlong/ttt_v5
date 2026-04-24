package entity

// VideoTag represents many-to-many relation between videos and tags
type VideoTag struct {
	VideoID   string `json:"video_id" db:"video_id"`
	TagID     int64  `json:"tag_id" db:"tag_id"`
	CreatedAt int64  `json:"created_at" db:"created_at"`
}