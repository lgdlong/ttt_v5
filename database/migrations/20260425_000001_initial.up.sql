-- +goose Up
-- +goose StatementBegin

CREATE TABLE IF NOT EXISTS youtube_videos (
    youtube_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER DEFAULT 0,
    author VARCHAR(255),
    upload_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_videos_deleted_at ON youtube_videos(deleted_at) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_name ON tags(name);

CREATE TABLE IF NOT EXISTS video_tags (
    youtube_id VARCHAR(20) NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (youtube_id, tag_id),
    FOREIGN KEY (youtube_id) REFERENCES youtube_videos(youtube_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_video_tags_youtube_id ON video_tags(youtube_id);
CREATE INDEX idx_video_tags_tag_id ON video_tags(tag_id);

-- +goose StatementEnd