-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS video_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS youtube_videos;

-- +goose StatementEnd