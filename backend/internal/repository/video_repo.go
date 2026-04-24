package repository

import (
	"context"
	"errors"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"gorm.io/gorm"
)

// GormVideoRepo implements port.VideoRepository using GORM
type GormVideoRepo struct {
	db *gorm.DB
}

// NewVideoRepo creates a new GORM video repository
func NewVideoRepo(db *gorm.DB) *GormVideoRepo {
	return &GormVideoRepo{db: db}
}

// Create inserts a new video record
func (r *GormVideoRepo) Create(ctx context.Context, video *entity.Video) error {
	return r.db.WithContext(ctx).Create(video).Error
}

// GetByID retrieves a video by youtube_id
func (r *GormVideoRepo) GetByID(ctx context.Context, youtubeID string) (*entity.Video, error) {
	var video entity.Video
	err := r.db.WithContext(ctx).Where("youtube_id = ?", youtubeID).First(&video).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &video, nil
}

// List retrieves videos with pagination and search
func (r *GormVideoRepo) List(ctx context.Context, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	var videos []entity.Video
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.Video{})
	if filter.Query != "" {
		query = query.Where("title ILIKE ?", "%"+filter.Query+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(filter.Offset).Limit(filter.Limit).Find(&videos).Error; err != nil {
		return nil, 0, err
	}

	return videos, total, nil
}

// GetByTagID retrieves videos filtered by tag
func (r *GormVideoRepo) GetByTagID(ctx context.Context, tagID uint, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	var videos []entity.Video
	var total int64

	query := r.db.WithContext(ctx).
		Table("youtube_videos").
		Joins("JOIN video_tags ON youtube_videos.youtube_id = video_tags.youtube_id").
		Where("video_tags.tag_id = ?", tagID)

	if filter.Query != "" {
		query = query.Where("title ILIKE ?", "%"+filter.Query+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(filter.Offset).Limit(filter.Limit).Find(&videos).Error; err != nil {
		return nil, 0, err
	}

	return videos, total, nil
}

// Update modifies an existing video
func (r *GormVideoRepo) Update(ctx context.Context, video *entity.Video) error {
	return r.db.WithContext(ctx).Save(video).Error
}

// Delete soft-deletes a video by setting deleted_at
func (r *GormVideoRepo) Delete(ctx context.Context, youtubeID string) error {
	return r.db.WithContext(ctx).Where("youtube_id = ?", youtubeID).Delete(&entity.Video{}).Error
}

// AttachTag links a tag to a video
func (r *GormVideoRepo) AttachTag(ctx context.Context, youtubeID string, tagID uint) error {
	vt := entity.VideoTag{
		VideoID: youtubeID, // Note: VideoTag.VideoID is string based on existing entity
		TagID:   int64(tagID),
	}
	return r.db.WithContext(ctx).Create(&vt).Error
}

// DetachTag removes the link between a tag and a video
func (r *GormVideoRepo) DetachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return r.db.WithContext(ctx).
		Where("youtube_id = ? AND tag_id = ?", youtubeID, tagID).
		Delete(&entity.VideoTag{}).Error
}

// GetTagsByVideoID retrieves all tags for a video
func (r *GormVideoRepo) GetTagsByVideoID(ctx context.Context, youtubeID string) ([]entity.Tag, error) {
	var tags []entity.Tag
	err := r.db.WithContext(ctx).
		Table("tags").
		Joins("JOIN video_tags ON tags.id = video_tags.tag_id").
		Where("video_tags.youtube_id = ?", youtubeID).
		Find(&tags).Error
	return tags, err
}