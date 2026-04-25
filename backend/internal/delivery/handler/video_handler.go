package handler

import (
	"strconv"

	"ttt-project/ttt_v5/backend/internal/application/service"
	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"

	"github.com/gin-gonic/gin"
)

// VideoHandler handles HTTP requests for videos
type VideoHandler struct {
	svc *service.VideoService
}

// NewVideoHandler creates a new video handler
func NewVideoHandler(svc *service.VideoService) *VideoHandler {
	return &VideoHandler{svc: svc}
}

// List godoc
// @Summary List all videos
// @Description Get paginated list of videos with optional filters
// @Tags videos
// @Accept json
// @Produce json
// @Param q query string false "Search by title"
// @Param tag_ids query string false "Filter by tag IDs (comma-separated)"
// @Param sort query string false "Sort field" default(created_at)
// @Param order query string false "Sort order (asc/desc)" default(desc)
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Page size" default(20)
// @Success 200 {object} dto.VideoResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /videos [get]
func (h *VideoHandler) List(c *gin.Context) {
	var filter dto.VideoFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		BadRequest(c, "Invalid query parameters")
		return
	}
	filter.Normalize()

	videos, total, err := h.svc.List(c.Request.Context(), filter)
	if err != nil {
		InternalError(c, "Failed to list videos")
		return
	}

	response := make([]dto.VideoResponse, len(videos))
	for i, v := range videos {
		response[i] = toVideoResponse(&v)
	}

	// List response with pagination meta
	SuccessWithMeta(c, response, dto.PaginationMeta{
		Page:       filter.Page,
		PageSize:   filter.Limit,
		TotalCount: total,
		TotalPages: int((total + int64(filter.Limit) - 1) / int64(filter.Limit)),
	})
}

// GetByID godoc
// @Summary Get video by YouTube ID
// @Description Get a single video by its YouTube ID
// @Tags videos
// @Accept json
// @Produce json
// @Param youtubeId path string true "YouTube ID"
// @Success 200 {object} dto.VideoResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /videos/{youtubeId} [get]
func (h *VideoHandler) GetByID(c *gin.Context) {
	youtubeID := c.Param("youtubeId")

	video, err := h.svc.GetByID(c.Request.Context(), youtubeID)
	if err != nil {
		InternalError(c, "Failed to retrieve video")
		return
	}
	if video == nil {
		NotFound(c, "Video not found")
		return
	}

	tags, err := h.svc.GetTagsByVideoID(c.Request.Context(), youtubeID)
	if err != nil {
		InternalError(c, "Failed to retrieve video tags")
		return
	}
	videoResp := toVideoResponse(video)
	videoResp.Tags = toTagResponses(tags)

	Success(c, videoResp)
}

// GetByTagID godoc
// @Summary Get videos by tag ID
// @Description Get paginated list of videos filtered by tag ID
// @Tags videos
// @Accept json
// @Produce json
// @Param tagId path int true "Tag ID"
// @Param limit query int false "Limit" default(20)
// @Param offset query int false "Offset" default(0)
// @Success 200 {object} dto.VideoResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /tags/{tagId}/videos [get]
func (h *VideoHandler) GetByTagID(c *gin.Context) {
	tagIDStr := c.Param("tagId")
	tagID, err := strconv.ParseUint(tagIDStr, 10, 64)
	if err != nil {
		BadRequest(c, "Invalid tag ID")
		return
	}

	var filter dto.VideoFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		BadRequest(c, "Invalid query parameters")
		return
	}
	filter.Normalize()

	videos, total, err := h.svc.GetByTagID(c.Request.Context(), uint(tagID), filter)
	if err != nil {
		InternalError(c, "Failed to list videos by tag")
		return
	}

	response := make([]dto.VideoResponse, len(videos))
	for i, v := range videos {
		response[i] = toVideoResponse(&v)
	}

	// List response with pagination meta
	SuccessWithMeta(c, response, dto.PaginationMeta{
		Page:       filter.Page,
		PageSize:   filter.Limit,
		TotalCount: total,
		TotalPages: int((total + int64(filter.Limit) - 1) / int64(filter.Limit)),
	})
}

// Create godoc
// @Summary Create a new video
// @Description Create a new video (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param video body dto.CreateVideoRequest true "Video data"
// @Success 201 {object} dto.VideoResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/videos [post]
func (h *VideoHandler) Create(c *gin.Context) {
	var req dto.CreateVideoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, "Invalid request body")
		return
	}

	video, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		BadRequest(c, err.Error())
		return
	}

	Created(c, toVideoResponse(video))
}

// Update godoc
// @Summary Update a video
// @Description Update an existing video (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param youtubeId path string true "YouTube ID"
// @Param video body dto.UpdateVideoRequest true "Video data"
// @Success 200 {object} dto.VideoResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /admin/videos/{youtubeId} [put]
func (h *VideoHandler) Update(c *gin.Context) {
	youtubeID := c.Param("youtubeId")

	var req dto.UpdateVideoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, "Invalid request body")
		return
	}

	video, err := h.svc.Update(c.Request.Context(), youtubeID, req)
	if err != nil {
		InternalError(c, "Failed to update video")
		return
	}
	if video == nil {
		NotFound(c, "Video not found")
		return
	}

	Success(c, toVideoResponse(video))
}

// Delete godoc
// @Summary Delete a video
// @Description Delete a video by YouTube ID (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param youtubeId path string true "YouTube ID"
// @Success 204
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/videos/{youtubeId} [delete]
func (h *VideoHandler) Delete(c *gin.Context) {
	youtubeID := c.Param("youtubeId")

	if err := h.svc.Delete(c.Request.Context(), youtubeID); err != nil {
		InternalError(c, "Failed to delete video")
		return
	}

	NoContent(c)
}

// AttachTag godoc
// @Summary Attach a tag to a video
// @Description Attach a tag to a video (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param youtubeId path string true "YouTube ID"
// @Param tagId path int true "Tag ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/videos/{youtubeId}/tags/{tagId} [post]
func (h *VideoHandler) AttachTag(c *gin.Context) {
	youtubeID := c.Param("youtubeId")
	tagIDStr := c.Param("tagId")

	tagID, err := strconv.ParseUint(tagIDStr, 10, 64)
	if err != nil {
		BadRequest(c, "Invalid tag ID")
		return
	}

	if err := h.svc.AttachTag(c.Request.Context(), youtubeID, uint(tagID)); err != nil {
		InternalError(c, "Failed to attach tag")
		return
	}

	Success(c, gin.H{"message": "Tag attached successfully"})
}

// DetachTag godoc
// @Summary Detach a tag from a video
// @Description Detach a tag from a video (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param youtubeId path string true "YouTube ID"
// @Param tagId path int true "Tag ID"
// @Success 204
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/videos/{youtubeId}/tags/{tagId} [delete]
func (h *VideoHandler) DetachTag(c *gin.Context) {
	youtubeID := c.Param("youtubeId")
	tagIDStr := c.Param("tagId")

	tagID, err := strconv.ParseUint(tagIDStr, 10, 64)
	if err != nil {
		BadRequest(c, "Invalid tag ID")
		return
	}

	if err := h.svc.DetachTag(c.Request.Context(), youtubeID, uint(tagID)); err != nil {
		InternalError(c, "Failed to detach tag")
		return
	}

	NoContent(c)
}

func toVideoResponse(v *entity.Video) dto.VideoResponse {
	resp := dto.VideoResponse{
		YouTubeID:       v.YoutubeID,
		Title:           v.Title,
		ThumbnailURL:    v.ThumbnailURL,
		DurationSeconds: v.DurationSeconds,
		Author:          v.Author,
		UploadDate:      v.UploadDate,
	}
	return resp
}