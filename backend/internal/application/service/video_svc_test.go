package service

import (
	"context"
	"errors"
	"testing"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"ttt-project/ttt_v5/backend/pkg/youtube"
)

// MockVideoRepository for testing
type mockVideoRepo struct {
	videos    map[string]*entity.Video
	tags      map[uint][]entity.Tag
	createErr error
	getErr    error
	listErr   error
}

func newMockVideoRepo() *mockVideoRepo {
	return &mockVideoRepo{
		videos: make(map[string]*entity.Video),
		tags:   make(map[uint][]entity.Tag),
	}
}

func (m *mockVideoRepo) Create(ctx context.Context, video *entity.Video) error {
	if m.createErr != nil {
		return m.createErr
	}
	m.videos[video.YoutubeID] = video
	return nil
}

func (m *mockVideoRepo) GetByID(ctx context.Context, youtubeID string) (*entity.Video, error) {
	if m.getErr != nil {
		return nil, m.getErr
	}
	v, ok := m.videos[youtubeID]
	if !ok {
		return nil, errors.New("not found")
	}
	return v, nil
}

func (m *mockVideoRepo) List(ctx context.Context, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	if m.listErr != nil {
		return nil, 0, m.listErr
	}
	var result []entity.Video
	for _, v := range m.videos {
		result = append(result, *v)
	}
	return result, int64(len(result)), nil
}

func (m *mockVideoRepo) GetByTagID(ctx context.Context, tagID uint, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	return m.List(ctx, filter)
}

func (m *mockVideoRepo) Update(ctx context.Context, video *entity.Video) error {
	m.videos[video.YoutubeID] = video
	return nil
}

func (m *mockVideoRepo) Delete(ctx context.Context, youtubeID string) error {
	delete(m.videos, youtubeID)
	return nil
}

func (m *mockVideoRepo) AttachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return nil
}

func (m *mockVideoRepo) DetachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return nil
}

func (m *mockVideoRepo) GetTagsByVideoID(ctx context.Context, youtubeID string) ([]entity.Tag, error) {
	return nil, nil
}

// MockYouTubeClient for testing
type mockYTClient struct {
	metadata *youtube.VideoMetadata
	err      error
}

func (m *mockYTClient) ExtractVideoID(url string) (string, error) {
	return youtube.ExtractVideoID(url)
}

func (m *mockYTClient) FetchVideoMetadata(ctx context.Context, videoID string) (*youtube.VideoMetadata, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.metadata, nil
}

func TestVideoService_Create_Success(t *testing.T) {
	repo := newMockVideoRepo()
	client := &mockYTClient{
		metadata: &youtube.VideoMetadata{
			Title:           "Test Video",
			ThumbnailURL:    "https://example.com/thumb.jpg",
			DurationSeconds: 120,
			Author:          "Test Author",
		},
	}
	svc := NewVideoService(repo, client)

	req := dto.CreateVideoRequest{YouTubeURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
	video, err := svc.Create(context.Background(), req)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if video == nil {
		t.Fatal("expected video, got nil")
	}
	if video.Title != "Test Video" {
		t.Errorf("expected title 'Test Video', got '%s'", video.Title)
	}
	if video.YoutubeID != "dQw4w9WgXcQ" {
		t.Errorf("expected youtube_id 'dQw4w9WgXcQ', got '%s'", video.YoutubeID)
	}
}

func TestVideoService_Create_InvalidURL(t *testing.T) {
	repo := newMockVideoRepo()
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	req := dto.CreateVideoRequest{YouTubeURL: "not-a-youtube-url"}
	_, err := svc.Create(context.Background(), req)

	if err == nil {
		t.Fatal("expected error for invalid URL")
	}
}

func TestVideoService_Create_AlreadyExists(t *testing.T) {
	repo := newMockVideoRepo()
	repo.videos["dQw4w9WgXcQ"] = &entity.Video{YoutubeID: "dQw4w9WgXcQ", Title: "Existing"}
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	req := dto.CreateVideoRequest{YouTubeURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
	_, err := svc.Create(context.Background(), req)

	if err == nil {
		t.Fatal("expected error for existing video")
	}
}

func TestVideoService_GetByID_Success(t *testing.T) {
	repo := newMockVideoRepo()
	repo.videos["abc123"] = &entity.Video{YoutubeID: "abc123", Title: "My Video"}
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	video, err := svc.GetByID(context.Background(), "abc123")

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if video.YoutubeID != "abc123" {
		t.Errorf("expected youtube_id 'abc123', got '%s'", video.YoutubeID)
	}
}

func TestVideoService_GetByID_NotFound(t *testing.T) {
	repo := newMockVideoRepo()
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	_, err := svc.GetByID(context.Background(), "nonexistent")

	if err == nil {
		t.Fatal("expected error for not found")
	}
}

func TestVideoService_List(t *testing.T) {
	repo := newMockVideoRepo()
	repo.videos["vid1"] = &entity.Video{YoutubeID: "vid1", Title: "Video 1"}
	repo.videos["vid2"] = &entity.Video{YoutubeID: "vid2", Title: "Video 2"}
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	videos, total, err := svc.List(context.Background(), dto.VideoFilter{})

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if total != 2 {
		t.Errorf("expected total 2, got %d", total)
	}
	if len(videos) != 2 {
		t.Errorf("expected 2 videos, got %d", len(videos))
	}
}

func TestVideoService_Delete(t *testing.T) {
	repo := newMockVideoRepo()
	repo.videos["vid1"] = &entity.Video{YoutubeID: "vid1", Title: "To Delete"}
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	err := svc.Delete(context.Background(), "vid1")

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if _, exists := repo.videos["vid1"]; exists {
		t.Error("expected video to be deleted")
	}
}

func TestVideoService_AttachTag(t *testing.T) {
	repo := newMockVideoRepo()
	client := &mockYTClient{}
	svc := NewVideoService(repo, client)

	err := svc.AttachTag(context.Background(), "vid1", 1)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}