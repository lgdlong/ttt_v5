package service

import (
	"context"
	"errors"
	"testing"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
)

// MockTagRepository for testing
type mockTagRepo struct {
	tags     map[int64]*entity.Tag
	byName   map[string]*entity.Tag
	createErr error
	getErr    error
}

func newMockTagRepo() *mockTagRepo {
	return &mockTagRepo{
		tags:   make(map[int64]*entity.Tag),
		byName: make(map[string]*entity.Tag),
	}
}

func (m *mockTagRepo) List(ctx context.Context) ([]entity.Tag, error) {
	var result []entity.Tag
	for _, t := range m.tags {
		result = append(result, *t)
	}
	return result, nil
}

func (m *mockTagRepo) GetByID(ctx context.Context, id uint) (*entity.Tag, error) {
	if m.getErr != nil {
		return nil, m.getErr
	}
	t, ok := m.tags[int64(id)]
	if !ok {
		return nil, errors.New("not found")
	}
	return t, nil
}

func (m *mockTagRepo) GetByName(ctx context.Context, name string) (*entity.Tag, error) {
	t, ok := m.byName[name]
	if !ok {
		return nil, errors.New("not found")
	}
	return t, nil
}

func (m *mockTagRepo) Create(ctx context.Context, tag *entity.Tag) error {
	if m.createErr != nil {
		return m.createErr
	}
	tag.ID = int64(len(m.tags) + 1)
	m.tags[tag.ID] = tag
	m.byName[tag.Name] = tag
	return nil
}

func (m *mockTagRepo) Update(ctx context.Context, tag *entity.Tag) error {
	m.tags[tag.ID] = tag
	m.byName[tag.Name] = tag
	return nil
}

func (m *mockTagRepo) Delete(ctx context.Context, id uint) error {
	if t, ok := m.tags[int64(id)]; ok {
		delete(m.byName, t.Name)
	}
	delete(m.tags, int64(id))
	return nil
}

func TestTagService_List(t *testing.T) {
	repo := newMockTagRepo()
	repo.tags[1] = &entity.Tag{ID: 1, Name: "Music"}
	repo.tags[2] = &entity.Tag{ID: 2, Name: "Tech"}
	svc := NewTagService(repo)

	tags, err := svc.List(context.Background())

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(tags) != 2 {
		t.Errorf("expected 2 tags, got %d", len(tags))
	}
}

func TestTagService_GetByID_Success(t *testing.T) {
	repo := newMockTagRepo()
	repo.tags[1] = &entity.Tag{ID: 1, Name: "Test"}
	svc := NewTagService(repo)

	tag, err := svc.GetByID(context.Background(), 1)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tag.Name != "Test" {
		t.Errorf("expected name 'Test', got '%s'", tag.Name)
	}
}

func TestTagService_GetByID_NotFound(t *testing.T) {
	repo := newMockTagRepo()
	svc := NewTagService(repo)

	_, err := svc.GetByID(context.Background(), 999)

	if err == nil {
		t.Fatal("expected error for not found")
	}
}

func TestTagService_Create_Success(t *testing.T) {
	repo := newMockTagRepo()
	svc := NewTagService(repo)

	req := dto.CreateTagRequest{Name: "New Tag"}
	tag, err := svc.Create(context.Background(), req)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tag.Name != "New Tag" {
		t.Errorf("expected name 'New Tag', got '%s'", tag.Name)
	}
}

func TestTagService_Create_AlreadyExists(t *testing.T) {
	repo := newMockTagRepo()
	repo.tags[1] = &entity.Tag{ID: 1, Name: "Existing"}
	repo.byName["Existing"] = repo.tags[1]
	svc := NewTagService(repo)

	req := dto.CreateTagRequest{Name: "Existing"}
	_, err := svc.Create(context.Background(), req)

	if err == nil {
		t.Fatal("expected error for existing tag")
	}
}

func TestTagService_Update(t *testing.T) {
	repo := newMockTagRepo()
	repo.tags[1] = &entity.Tag{ID: 1, Name: "Old Name"}
	repo.byName["Old Name"] = repo.tags[1]
	svc := NewTagService(repo)

	newName := "New Name"
	req := dto.UpdateTagRequest{Name: &newName}
	tag, err := svc.Update(context.Background(), 1, req)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if tag.Name != "New Name" {
		t.Errorf("expected name 'New Name', got '%s'", tag.Name)
	}
}

func TestTagService_Delete(t *testing.T) {
	repo := newMockTagRepo()
	repo.tags[1] = &entity.Tag{ID: 1, Name: "ToDelete"}
	repo.byName["ToDelete"] = repo.tags[1]
	svc := NewTagService(repo)

	err := svc.Delete(context.Background(), 1)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if _, exists := repo.tags[1]; exists {
		t.Error("expected tag to be deleted")
	}
}