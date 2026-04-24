# Database schema definition for Atlas
# This file defines the desired state of the database schema

locals {
  name = "ttt_project"
}

# Define the database schema
schema "public" {
}

# YouTube videos table
table "youtube_videos" {
  schema = schema.public
  columns = [
    { name = "youtube_id", type = "varchar(20)", primary = true },
    { name = "title", type = "varchar(255)", not_null = true },
    { name = "thumbnail_url", type = "varchar(500)" },
    { name = "duration_seconds", type = "integer", default = 0 },
    { name = "author", type = "varchar(255)" },
    { name = "upload_date", type = "timestamp" },
    { name = "created_at", type = "timestamp", default = "now()" },
    { name = "updated_at", type = "timestamp", default = "now()" },
    { name = "deleted_at", type = "timestamp", null = true },
  ]
}

# Tags table
table "tags" {
  schema = schema.public
  columns = [
    { name = "id", type = "bigint", primary = true, auto = true },
    { name = "name", type = "varchar(50)", not_null = true, unique = true },
    { name = "created_at", type = "timestamp", default = "now()" },
    { name = "updated_at", type = "timestamp", default = "now()" },
  ]
}

# Video-Tags junction table
table "video_tags" {
  schema = schema.public
  columns = [
    { name = "youtube_id", type = "varchar(20)", not_null = true },
    { name = "tag_id", type = "bigint", not_null = true },
    { name = "created_at", type = "timestamp", default = "now()" },
  ]
  primary_key {
    columns = [column("youtube_id"), column("tag_id")]
  }
}

# Indexes
apply {
  create index "idx_videos_deleted_at" on "youtube_videos" {
    columns = [column("deleted_at")]
    where = "deleted_at IS NULL"
  }
}

apply {
  create index "idx_tags_name" on "tags" {
    columns = [column("name")]
  }
}

apply {
  create index "idx_video_tags_youtube_id" on "video_tags" {
    columns = [column("youtube_id")]
  }
}

apply {
  create index "idx_video_tags_tag_id" on "video_tags" {
    columns = [column("tag_id")]
  }
}

# Foreign keys
apply {
  add foreign key "fk_video_tags_youtube_id" {
    columns = [column("youtube_id")]
    references = table("youtube_videos") {
      columns = [column("youtube_id")]
    }
    on_delete = "CASCADE"
  }
}

apply {
  add foreign key "fk_video_tags_tag_id" {
    columns = [column("tag_id")]
    references = table("tags") {
      columns = [column("id")]
    }
    on_delete = "CASCADE"
  }
}