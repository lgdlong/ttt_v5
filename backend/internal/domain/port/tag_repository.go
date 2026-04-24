package port

import (
	"context"

	"ttt-project/ttt_v5/backend/internal/domain/entity"
)

// TagRepository defines the contract for tag data access
type TagRepository interface {
	Create(ctx context.Context, tag *entity.Tag) error
	GetByID(ctx context.Context, id uint) (*entity.Tag, error)
	GetByName(ctx context.Context, name string) (*entity.Tag, error)
	List(ctx context.Context) ([]entity.Tag, error)
	Update(ctx context.Context, tag *entity.Tag) error
	Delete(ctx context.Context, id uint) error
}