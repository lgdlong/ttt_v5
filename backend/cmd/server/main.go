package main

import (
	"log"

	"ttt-project/ttt_v5/backend/config"
	"ttt-project/ttt_v5/backend/internal/delivery/middleware"
	"ttt-project/ttt_v5/backend/internal/delivery/router"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Set Gin mode based on environment
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin instance
	app := gin.New()

	// Apply middleware
	middleware.Apply(app)

	// Setup routes
	router.Setup(app, cfg)

	// Start server
	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := app.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
