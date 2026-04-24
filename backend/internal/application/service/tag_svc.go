package service

import (
	"context"
	"errors"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"ttt-project/ttt_v5/backend/internal/domain/port"
)

// TagService handles tag business logic
type TagService struct {
	repo port.TagRepository
}

// NewTagService creates a new tag service
func NewTagService(repo port.TagRepository) *TagService {
	return &TagService{repo: repo}
}

// List returns all tags
func (s *TagService) List(ctx context.Context) ([]entity.Tag, error) {
	return s.repo.List(ctx)
}

// GetByID returns a tag by ID
func (s *TagService) GetByID(ctx context.Context, id uint) (*entity.Tag, error) {
	return s.repo.GetByID(ctx, id)
}

// GetByName returns a tag by name
func (s *TagService) GetByName(ctx context.Context, name string) (*entity.Tag, error) {
	return s.repo.GetByName(ctx, name)
}

// Create creates a new tag
func (s *TagService) Create(ctx context.Context, req dto.CreateTagRequest) (*entity.Tag, error) {
	// Check if tag already exists
	if existing, _ := s.repo.GetByName(ctx, req.Name); existing != nil {
		return nil, errors.New("tag already exists")
	}

	tag := &entity.Tag{
		Name: req.Name,
	}

	if err := s.repo.Create(ctx, tag); err != nil {
		return nil, err
	}

	return tag, nil
}

// Update updates an existing tag
func (s *TagService) Update(ctx context.Context, id uint, req dto.UpdateTagRequest) (*entity.Tag, error) {
	tag, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		tag.Name = *req.Name
	}

	if err := s.repo.Update(ctx, tag); err != nil {
		return nil, err
	}

	return tag, nil
}

// Delete deletes a tag
func (s *TagService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}