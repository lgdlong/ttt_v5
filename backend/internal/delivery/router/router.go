package router

import (
	"net/http"

	"ttt-project/ttt_v5/backend/config"

	"github.com/gin-gonic/gin"
)

// Setup configures all routes for the application
func Setup(app *gin.Engine, cfg *config.Config) {
	// Health check endpoint
	app.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"env":    cfg.Environment,
		})
	})

	// API v1 routes
	app.Group("/api/v1")
}
