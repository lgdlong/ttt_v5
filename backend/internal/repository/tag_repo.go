package repository

import (
	"context"

	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"gorm.io/gorm"
)

// GormTagRepo implements port.TagRepository using GORM
type GormTagRepo struct {
	db *gorm.DB
}

// NewTagRepo creates a new GORM tag repository
func NewTagRepo(db *gorm.DB) *GormTagRepo {
	return &GormTagRepo{db: db}
}

// Create inserts a new tag record
func (r *GormTagRepo) Create(ctx context.Context, tag *entity.Tag) error {
	return r.db.WithContext(ctx).Create(tag).Error
}

// GetByID retrieves a tag by id
func (r *GormTagRepo) GetByID(ctx context.Context, id uint) (*entity.Tag, error) {
	var tag entity.Tag
	err := r.db.WithContext(ctx).First(&tag, id).Error
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

// GetByName retrieves a tag by name
func (r *GormTagRepo) GetByName(ctx context.Context, name string) (*entity.Tag, error) {
	var tag entity.Tag
	err := r.db.WithContext(ctx).Where("name = ?", name).First(&tag).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &tag, nil
}

// List retrieves all tags
func (r *GormTagRepo) List(ctx context.Context) ([]entity.Tag, error) {
	var tags []entity.Tag
	err := r.db.WithContext(ctx).Order("name ASC").Find(&tags).Error
	return tags, err
}

// Search retrieves tags matching a name query with pagination
func (r *GormTagRepo) Search(ctx context.Context, query string, page, limit int) ([]entity.Tag, int64, error) {
	var tags []entity.Tag
	var total int64

	q := r.db.WithContext(ctx).Model(&entity.Tag{}).Order("name ASC")
	if query != "" {
		q = q.Where("name ILIKE ?", "%"+query+"%")
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := q.Offset(offset).Limit(limit).Find(&tags).Error; err != nil {
		return nil, 0, err
	}

	return tags, total, nil
}

// Update modifies an existing tag
func (r *GormTagRepo) Update(ctx context.Context, tag *entity.Tag) error {
	return r.db.WithContext(ctx).Save(tag).Error
}

// Delete removes a tag
func (r *GormTagRepo) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&entity.Tag{}, id).Error
}