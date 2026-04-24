package port

import (
	"context"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
)

// VideoRepository defines the contract for video data access
type VideoRepository interface {
	Create(ctx context.Context, video *entity.Video) error
	GetByID(ctx context.Context, youtubeID string) (*entity.Video, error)
	List(ctx context.Context, filter dto.VideoFilter) ([]entity.Video, int64, error)
	GetByTagID(ctx context.Context, tagID uint, filter dto.VideoFilter) ([]entity.Video, int64, error)
	Update(ctx context.Context, video *entity.Video) error
	Delete(ctx context.Context, youtubeID string) error
	AttachTag(ctx context.Context, youtubeID string, tagID uint) error
	DetachTag(ctx context.Context, youtubeID string, tagID uint) error
	GetTagsByVideoID(ctx context.Context, youtubeID string) ([]entity.Tag, error)
}