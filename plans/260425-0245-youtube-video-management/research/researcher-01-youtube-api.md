# YouTube API Integration - Research Report

## YouTube ID Extraction

Regex pattern (from StackOverflow):
```go
var youtubeIDRegex = regexp.MustCompile(`(?:(?:https?://)?(?:www\.)?youtube\.com/(?:watch\?v=|embed/|v/)|(?:https?://)?youtu\.be/)([a-zA-Z0-9_-]{11})`)

func extractYouTubeID(url string) string {
    match := youtubeIDRegex.FindStringSubmatch(url)
    if len(match) > 1 {
        return match[1]
    }
    return ""
}
```
Supported: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/embed/ID`, `youtube.com/v/ID`

## YouTube Data API v3 - Video Endpoint

**Endpoint:** `GET https://www.googleapis.com/youtube/v3/videos`

**Query Params:**
- `part=snippet,contentDetails` (contentDetails has duration)
- `id=VIDEO_ID`
- `key=${YOUTUBE_API_KEY}`

**Response fields (snippet):**
- `title` → Video.title
- `thumbnails.high.url` → Video.thumbnail_url
- `channelTitle` → Video.author
- `publishedAt` → Video.upload_date (ISO 8601)

**Response fields (contentDetails):**
- `duration` → ISO 8601 duration string (e.g., "PT2M30S") - needs parsing

## Go Implementation (Direct HTTP)

```go
func fetchVideoMeta(ctx context.Context, apiKey, videoID string) (*VideoMeta, error) {
    url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=%s&key=%s", videoID, apiKey)
    resp, err := http.Get(url)
    if err != nil { return nil, err }
    defer resp.Body.Close()

    var result struct {
        Items []struct {
            Snippet struct {
                Title         string `json:"title"`
                Thumbnails    struct {
                    High struct {
                        URL string `json:"url"`
                    } `json:"high"`
                } `json:"thumbnails"`
                ChannelTitle string `json:"channelTitle"`
                PublishedAt  string `json:"publishedAt"`
            } `json:"snippet"`
            ContentDetails struct {
                Duration string `json:"duration"`
            } `json:"contentDetails"`
        } `json:"items"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }
    // parse result.Items[0]
}
```

## Environment Variable

```bash
YOUTUBE_API_KEY=AIzaSy...
```
Load via `os.Getenv("YOUTUBE_API_KEY")`

## YouTube API Rate Limits

- Free tier: 10,000 quota units/day
- Video list endpoint: 1 unit per video
- Quota exceeded: HTTP 403

## Duration Parsing

Use `parseDuration` function to convert ISO 8601 to seconds:
```go
func parseDuration(d string) (int, error) {
    duration, err := time.ParseDuration(d)
    if err != nil { return 0, err }
    return int(duration.Seconds()), nil
}
```
Note: YouTube returns "PT2M30S" format, `time.ParseDuration` handles this.