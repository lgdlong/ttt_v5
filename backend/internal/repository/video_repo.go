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

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Offset(offset).Limit(filter.Limit).Find(&videos).Error; err != nil {
		return nil, 0, err
	}

	return videos, total, nil
}

// GetByTagID retrieves videos filtered by tag
func (r *GormVideoRepo) GetByTagID(ctx context.Context, tagID uint, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	var videos []entity.Video
	var total int64

	query := r.db.WithContext(ctx).Model(&entity.Video{}).Where("? IN (SELECT youtube_id FROM video_tags WHERE tag_id = ?)", tagID, tagID)

	if filter.Query != "" {
		query = query.Where("title ILIKE ?", "%"+filter.Query+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Preload("Tags").Offset(offset).Limit(filter.Limit).Find(&videos).Error; err != nil {
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

// AttachTag links a tag to a video using GORM many2many
func (r *GormVideoRepo) AttachTag(ctx context.Context, youtubeID string, tagID uint) error {
	video, err := r.GetByID(ctx, youtubeID)
	if err != nil || video == nil {
		return err
	}
	var tag entity.Tag
	if err := r.db.WithContext(ctx).First(&tag, tagID).Error; err != nil {
		return err
	}
	return r.db.Model(video).Association("Tags").Append(&tag)
}

// DetachTag removes the link between a tag and a video
func (r *GormVideoRepo) DetachTag(ctx context.Context, youtubeID string, tagID uint) error {
	video, err := r.GetByID(ctx, youtubeID)
	if err != nil || video == nil {
		return err
	}
	var tag entity.Tag
	if err := r.db.WithContext(ctx).First(&tag, tagID).Error; err != nil {
		return err
	}
	return r.db.Model(video).Association("Tags").Delete(&tag)
}

// GetTagsByVideoID retrieves all tags for a video
func (r *GormVideoRepo) GetTagsByVideoID(ctx context.Context, youtubeID string) ([]entity.Tag, error) {
	video, err := r.GetByID(ctx, youtubeID)
	if err != nil || video == nil {
		return nil, err
	}
	if err := r.db.WithContext(ctx).Preload("Tags").First(video, "youtube_id = ?", youtubeID).Error; err != nil {
		return nil, err
	}
	return video.Tags, nil
}