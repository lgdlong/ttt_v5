package repository

import (
	"context"
	"sync"

	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"ttt-project/ttt_v5/backend/internal/domain/port"
)

// InMemoryTagRepository is a simple in-memory implementation for testing
type InMemoryTagRepository struct {
	tags map[int64]*entity.Tag
	mu   sync.RWMutex
}

// NewInMemoryTagRepository creates a new in-memory tag repository
func NewInMemoryTagRepository() *InMemoryTagRepository {
	return &InMemoryTagRepository{tags: make(map[int64]*entity.Tag)}
}

func (r *InMemoryTagRepository) Create(ctx context.Context, tag *entity.Tag) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.tags[tag.ID] = tag
	return nil
}

func (r *InMemoryTagRepository) GetByID(ctx context.Context, id uint) (*entity.Tag, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.tags[int64(id)], nil
}

func (r *InMemoryTagRepository) GetByName(ctx context.Context, name string) (*entity.Tag, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, t := range r.tags {
		if t.Name == name {
			return t, nil
		}
	}
	return nil, nil
}

func (r *InMemoryTagRepository) List(ctx context.Context) ([]entity.Tag, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	result := make([]entity.Tag, 0, len(r.tags))
	for _, t := range r.tags {
		result = append(result, *t)
	}
	return result, nil
}

func (r *InMemoryTagRepository) Update(ctx context.Context, tag *entity.Tag) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.tags[tag.ID] = tag
	return nil
}

func (r *InMemoryTagRepository) Delete(ctx context.Context, id uint) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.tags, int64(id))
	return nil
}

// Ensure interface satisfaction
var _ port.TagRepository = (*InMemoryTagRepository)(nil)