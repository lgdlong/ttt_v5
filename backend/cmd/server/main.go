package main

import (
	"log"

	"ttt-project/ttt_v5/backend/config"
	"ttt-project/ttt_v5/backend/internal/delivery/middleware"
	"ttt-project/ttt_v5/backend/internal/delivery/router"
	"ttt-project/ttt_v5/backend/internal/domain/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize GORM database connection
	db, err := gorm.Open(postgres.Open(cfg.GetDSN()), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate entities
	if err := db.AutoMigrate(&entity.Video{}, &entity.Tag{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Set Gin mode based on environment
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin instance
	app := gin.New()

	// Apply middleware
	middleware.Apply(app)

	// Setup routes with GORM DB
	router.Setup(app, cfg, db)

	// Start server
	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := app.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
