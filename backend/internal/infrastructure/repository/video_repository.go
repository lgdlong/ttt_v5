package repository

import (
	"context"
	"sync"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"ttt-project/ttt_v5/backend/internal/domain/port"
)

// InMemoryVideoRepository is a simple in-memory implementation for testing
type InMemoryVideoRepository struct {
	videos map[string]*entity.Video
	mu     sync.RWMutex
}

// NewInMemoryVideoRepository creates a new in-memory video repository
func NewInMemoryVideoRepository() *InMemoryVideoRepository {
	return &InMemoryVideoRepository{videos: make(map[string]*entity.Video)}
}

func (r *InMemoryVideoRepository) Create(ctx context.Context, video *entity.Video) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.videos[video.YoutubeID] = video
	return nil
}

func (r *InMemoryVideoRepository) GetByID(ctx context.Context, youtubeID string) (*entity.Video, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.videos[youtubeID], nil
}

func (r *InMemoryVideoRepository) List(ctx context.Context, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	result := make([]entity.Video, 0, len(r.videos))
	for _, v := range r.videos {
		result = append(result, *v)
	}
	return result, int64(len(result)), nil
}

func (r *InMemoryVideoRepository) GetByTagID(ctx context.Context, tagID uint, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	return nil, 0, nil
}

func (r *InMemoryVideoRepository) Update(ctx context.Context, video *entity.Video) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.videos[video.YoutubeID] = video
	return nil
}

func (r *InMemoryVideoRepository) Delete(ctx context.Context, youtubeID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.videos, youtubeID)
	return nil
}

func (r *InMemoryVideoRepository) AttachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return nil
}

func (r *InMemoryVideoRepository) DetachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return nil
}

func (r *InMemoryVideoRepository) GetTagsByVideoID(ctx context.Context, youtubeID string) ([]entity.Tag, error) {
	return nil, nil
}

// Ensure interface satisfaction
var _ port.VideoRepository = (*InMemoryVideoRepository)(nil)