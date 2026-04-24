package service

import (
	"context"
	"errors"
	"fmt"

	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"
	"ttt-project/ttt_v5/backend/internal/domain/port"
	"ttt-project/ttt_v5/backend/pkg/youtube"
)

// VideoService handles video business logic
type VideoService struct {
	repo     port.VideoRepository
 ytClient youtube.Client
}

// NewVideoService creates a new video service
func NewVideoService(repo port.VideoRepository, ytClient youtube.Client) *VideoService {
	return &VideoService{repo: repo, ytClient: ytClient}
}

// List returns videos with filtering, sorting, and pagination
func (s *VideoService) List(ctx context.Context, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	filter.Normalize()
	return s.repo.List(ctx, filter)
}

// GetByID returns a single video by youtube ID
func (s *VideoService) GetByID(ctx context.Context, youtubeID string) (*entity.Video, error) {
	return s.repo.GetByID(ctx, youtubeID)
}

// GetByTagID returns videos for a specific tag with pagination
func (s *VideoService) GetByTagID(ctx context.Context, tagID uint, filter dto.VideoFilter) ([]entity.Video, int64, error) {
	filter.Normalize()
	return s.repo.GetByTagID(ctx, tagID, filter)
}

// Create creates a new video from YouTube URL
func (s *VideoService) Create(ctx context.Context, req dto.CreateVideoRequest) (*entity.Video, error) {
	videoID, err := youtube.ExtractVideoID(req.YouTubeURL)
	if err != nil {
		return nil, fmt.Errorf("invalid YouTube URL: %w", err)
	}

	// Check if video already exists
	if existing, _ := s.repo.GetByID(ctx, videoID); existing != nil {
		return nil, errors.New("video already exists")
	}

	// Fetch metadata from YouTube
	metadata, err := s.ytClient.FetchVideoMetadata(ctx, videoID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch video metadata: %w", err)
	}

	video := &entity.Video{
		YoutubeID:       videoID,
		Title:           metadata.Title,
		ThumbnailURL:    metadata.ThumbnailURL,
		DurationSeconds: metadata.DurationSeconds,
		Author:          metadata.Author,
		UploadDate:      metadata.UploadDate,
	}

	if err := s.repo.Create(ctx, video); err != nil {
		return nil, err
	}

	return video, nil
}

// Update updates an existing video
func (s *VideoService) Update(ctx context.Context, youtubeID string, req dto.UpdateVideoRequest) (*entity.Video, error) {
	video, err := s.repo.GetByID(ctx, youtubeID)
	if err != nil {
		return nil, err
	}

	if req.Title != nil {
		video.Title = *req.Title
	}
	if req.ThumbnailURL != nil {
		video.ThumbnailURL = *req.ThumbnailURL
	}

	if err := s.repo.Update(ctx, video); err != nil {
		return nil, err
	}

	return video, nil
}

// Delete soft deletes a video
func (s *VideoService) Delete(ctx context.Context, youtubeID string) error {
	return s.repo.Delete(ctx, youtubeID)
}

// AttachTag attaches a tag to a video
func (s *VideoService) AttachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return s.repo.AttachTag(ctx, youtubeID, tagID)
}

// DetachTag detaches a tag from a video
func (s *VideoService) DetachTag(ctx context.Context, youtubeID string, tagID uint) error {
	return s.repo.DetachTag(ctx, youtubeID, tagID)
}

// GetTagsByVideoID returns all tags for a video
func (s *VideoService) GetTagsByVideoID(ctx context.Context, youtubeID string) ([]entity.Tag, error) {
	return s.repo.GetTagsByVideoID(ctx, youtubeID)
}