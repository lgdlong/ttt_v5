package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// VideoFromJSON represents the video structure in the JSON file
type VideoFromJSON struct {
	ID           string  `json:"id"`
	Title        string  `json:"title"`
	ThumbnailURL string  `json:"thumbnail_url"`
	DurationSecs int     `json:"duration_seconds"`
	Author       string  `json:"author"`
	UploadDate   string  `json:"upload_date"`
	Status       string  `json:"status"`
	ErrorMessage *string `json:"error_message"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
}

var dsn  = flag.String("dsn", "", "database connection string")
var jsonFile = flag.String("json", "data/full-videos-20260304-015941.json", "path to JSON file")

func main() {
	flag.Parse()
	if *dsn == "" {
		log.Fatal("dsn flag is required")
	}

	// Read JSON file
	jsonData, err := os.ReadFile(*jsonFile)
	if err != nil {
		log.Fatalf("failed to read JSON file: %v", err)
	}

	var videos []VideoFromJSON
	if err := json.Unmarshal(jsonData, &videos); err != nil {
		log.Fatalf("failed to parse JSON: %v", err)
	}

	log.Printf("Found %d videos in JSON file", len(videos))

	// Connect to database
	db, err := sql.Open("postgres", *dsn)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping db: %v", err)
	}

	// Upsert videos
	inserted := 0
	skipped := 0
	for _, v := range videos {
		uploadDate, err := time.Parse("2006-01-02", v.UploadDate)
		if err != nil {
			log.Printf("warning: failed to parse upload_date for %s: %v", v.ID, err)
			continue
		}

		createdAt, err := time.Parse(time.RFC3339Nano, v.CreatedAt)
		if err != nil {
			log.Printf("warning: failed to parse created_at for %s: %v", v.ID, err)
			continue
		}

		updatedAt, err := time.Parse(time.RFC3339Nano, v.UpdatedAt)
		if err != nil {
			log.Printf("warning: failed to parse updated_at for %s: %v", v.ID, err)
			continue
		}

		query := `
			INSERT INTO youtube_videos (youtube_id, title, thumbnail_url, duration_seconds, author, upload_date, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			ON CONFLICT (youtube_id) DO UPDATE SET
				title = EXCLUDED.title,
				thumbnail_url = EXCLUDED.thumbnail_url,
				duration_seconds = EXCLUDED.duration_seconds,
				author = EXCLUDED.author,
				upload_date = EXCLUDED.upload_date,
				updated_at = EXCLUDED.updated_at
			WHERE youtube_videos.updated_at < EXCLUDED.updated_at
		`

		result, err := db.Exec(query, v.ID, v.Title, v.ThumbnailURL, v.DurationSecs, v.Author, uploadDate, createdAt, updatedAt)
		if err != nil {
			log.Printf("error inserting %s: %v", v.ID, err)
			continue
		}

		rowsAffected, _ := result.RowsAffected()
		if rowsAffected > 0 {
			inserted++
		} else {
			skipped++
		}
	}

	log.Printf("Seeding complete: %d inserted, %d skipped (already exist or older)", inserted, skipped)
	fmt.Printf("Seeding complete: %d inserted, %d skipped (already exist or older)\n", inserted, skipped)
}
