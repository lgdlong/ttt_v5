package router

import (
	"net/http"
	"time"

	"ttt-project/ttt_v5/backend/config"
	"ttt-project/ttt_v5/backend/internal/application/service"
	"ttt-project/ttt_v5/backend/internal/delivery/handler"
	"ttt-project/ttt_v5/backend/internal/delivery/middleware"
	"ttt-project/ttt_v5/backend/internal/repository"
	"ttt-project/ttt_v5/backend/pkg/youtube"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"

	_ "ttt-project/ttt_v5/backend/api"
)

// Setup configures all routes for the application
func Setup(app *gin.Engine, cfg *config.Config, db *gorm.DB) {
	// Initialize GORM repositories
	videoRepo := repository.NewVideoRepo(db)
	tagRepo := repository.NewTagRepo(db)

	// Initialize YouTube client
	ytClient := youtube.NewClient("") // API key should come from config

	// Initialize services
	videoSvc := service.NewVideoService(videoRepo, ytClient)
	tagSvc := service.NewTagService(tagRepo)

	// Initialize handlers
	videoHandler := handler.NewVideoHandler(videoSvc)
	tagHandler := handler.NewTagHandler(tagSvc)

	// Health check endpoint
	app.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"env":    cfg.Environment,
		})
	})

	// Swagger documentation
	app.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// API v1 routes
	v1 := app.Group("/api/v1")

	// Apply rate limiter to GET endpoints (100 req/min)
	v1.Use(middleware.RateLimit(100, time.Minute))

	// Public endpoints (GET - rate limited)
	v1.GET("/videos", videoHandler.List)
	v1.GET("/videos/:youtubeId", videoHandler.GetByID)
	v1.GET("/tags", tagHandler.List)
	v1.GET("/tags/:tagId/videos", videoHandler.GetByTagID)

	// Admin endpoints (no rate limiting)
	admin := v1.Group("/admin")
	{
		// Video admin endpoints
		admin.POST("/videos", videoHandler.Create)
		admin.PUT("/videos/:youtubeId", videoHandler.Update)
		admin.DELETE("/videos/:youtubeId", videoHandler.Delete)

		// Tag admin endpoints
		admin.POST("/tags", tagHandler.Create)
		admin.PUT("/tags/:tagId", tagHandler.Update)
		admin.DELETE("/tags/:tagId", tagHandler.Delete)

		// Video-Tag relationship endpoints
		admin.POST("/videos/:youtubeId/tags/:tagId", videoHandler.AttachTag)
		admin.DELETE("/videos/:youtubeId/tags/:tagId", videoHandler.DetachTag)
	}
}