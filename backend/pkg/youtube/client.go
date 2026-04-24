package youtube

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"time"
)

// VideoMetadata holds metadata fetched from YouTube API
type VideoMetadata struct {
	Title           string
	ThumbnailURL    string
	DurationSeconds int
	Author          string
	UploadDate      *time.Time
}

// client is the YouTube API client
type client struct {
	httpClient *http.Client
	apiKey     string
}

// Client interface for YouTube operations
type Client interface {
	ExtractVideoID(url string) (string, error)
	FetchVideoMetadata(ctx context.Context, videoID string) (*VideoMetadata, error)
}

// NewClient creates a new YouTube client
func NewClient(apiKey string) Client {
	return &client{
		httpClient: &http.Client{Timeout: 10 * time.Second},
		apiKey:     apiKey,
	}
}

// ExtractVideoID extracts video ID from various YouTube URL formats
func (c *client) ExtractVideoID(url string) (string, error) {
	return ExtractVideoID(url)
}

// ExtractVideoID extracts video ID from various YouTube URL formats
// Supported formats:
// - https://www.youtube.com/watch?v=VIDEO_ID
// - https://youtu.be/VIDEO_ID
// - https://www.youtube.com/embed/VIDEO_ID
// - https://www.youtube.com/v/VIDEO_ID
// - https://www.youtube.com/shorts/VIDEO_ID
func ExtractVideoID(url string) (string, error) {
	patterns := []string{
		`(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/v/|youtube\.com/shorts/)([a-zA-Z0-9_-]{11})`,
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(url)
		if len(matches) >= 2 {
			return matches[1], nil
		}
	}

	return "", fmt.Errorf("invalid YouTube URL: %s", url)
}

// FetchVideoMetadata fetches video metadata from YouTube Data API v3
func (c *client) FetchVideoMetadata(ctx context.Context, videoID string) (*VideoMetadata, error) {
	if c.apiKey == "" {
		return nil, fmt.Errorf("YouTube API key not configured")
	}

	url := fmt.Sprintf(
		"https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=%s&key=%s",
		videoID, c.apiKey,
	)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("YouTube API error: status %d", resp.StatusCode)
	}

	var result struct {
		Items []struct {
			Snippet struct {
				Title       string `json:"title"`
				Thumbnails  struct {
					High struct {
						URL string `json:"url"`
					} `json:"high"`
				} `json:"thumbnails"`
				ChannelTitle string `json:"channelTitle"`
				PublishedAt string `json:"publishedAt"`
			} `json:"snippet"`
			ContentDetails struct {
				Duration string `json:"duration"`
			} `json:"contentDetails"`
		} `json:"items"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Items) == 0 {
		return nil, fmt.Errorf("video not found: %s", videoID)
	}

	item := result.Items[0]
	metadata := &VideoMetadata{
		Title:        item.Snippet.Title,
		ThumbnailURL: item.Snippet.Thumbnails.High.URL,
		Author:       item.Snippet.ChannelTitle,
	}

	// Parse ISO 8601 duration
	if d, err := parseDuration(item.ContentDetails.Duration); err == nil {
		metadata.DurationSeconds = d
	}

	// Parse upload date
	if t, err := time.Parse(time.RFC3339, item.Snippet.PublishedAt); err == nil {
		metadata.UploadDate = &t
	}

	return metadata, nil
}

// parseDuration parses ISO 8601 duration (e.g., PT1H2M3S) to seconds
func parseDuration(s string) (int, error) {
	re := regexp.MustCompile(`PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?`)
	m := re.FindStringSubmatch(s)
	if m == nil {
		return 0, fmt.Errorf("invalid duration format")
	}

	hours := 0
	minutes := 0
	seconds := 0

	if m[1] != "" {
		fmt.Sscanf(m[1], "%d", &hours)
	}
	if m[2] != "" {
		fmt.Sscanf(m[2], "%d", &minutes)
	}
	if m[3] != "" {
		fmt.Sscanf(m[3], "%d", &seconds)
	}

	return hours*3600 + minutes*60 + seconds, nil
}