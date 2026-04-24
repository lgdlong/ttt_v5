package main

import (
	"database/sql"
	"flag"
	"log"

	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"
)

var (
	dsn = flag.String("dsn", "", "database connection string")
	dir = flag.String("dir", "database/migrations", "migrations directory")
)

func main() {
	flag.Parse()
	if *dsn == "" {
		log.Fatal("dsn flag is required")
	}

	db, err := sql.Open("postgres", *dsn)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer db.Close()

	if err := goose.Run("up", db, *dir); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}
}