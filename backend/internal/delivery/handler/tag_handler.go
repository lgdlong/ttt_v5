package handler

import (
	"strconv"

	"ttt-project/ttt_v5/backend/internal/application/service"
	"ttt-project/ttt_v5/backend/internal/domain/dto"
	"ttt-project/ttt_v5/backend/internal/domain/entity"

	"github.com/gin-gonic/gin"
)

// TagHandler handles HTTP requests for tags
type TagHandler struct {
	svc *service.TagService
}

// NewTagHandler creates a new tag handler
func NewTagHandler(svc *service.TagService) *TagHandler {
	return &TagHandler{svc: svc}
}

// List handles GET /api/v1/tags
func (h *TagHandler) List(c *gin.Context) {
	tags, err := h.svc.List(c.Request.Context())
	if err != nil {
		InternalError(c, "Failed to list tags")
		return
	}

	Success(c, gin.H{"tags": toTagResponses(tags)})
}

// GetByID handles GET /api/v1/tags/:tagId
func (h *TagHandler) GetByID(c *gin.Context) {
	tagIDStr := c.Param("tagId")
	tagID, err := strconv.ParseUint(tagIDStr, 10, 64)
	if err != nil {
		BadRequest(c, "Invalid tag ID")
		return
	}

	tag, err := h.svc.GetByID(c.Request.Context(), uint(tagID))
	if err != nil {
		NotFound(c, "Tag not found")
		return
	}

	Success(c, toTagResponse(tag))
}

// Create handles POST /api/v1/admin/tags
func (h *TagHandler) Create(c *gin.Context) {
	var req dto.CreateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, "Invalid request body")
		return
	}

	tag, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		BadRequest(c, err.Error())
		return
	}

	Created(c, toTagResponse(tag))
}

// Update handles PUT /api/v1/admin/tags/:tagId
func (h *TagHandler) Update(c *gin.Context) {
	tagIDStr := c.Param("tagId")
	tagID, err := strconv.ParseUint(tagIDStr, 10, 64)
	if err != nil {
		BadRequest(c, "Invalid tag ID")
		return
	}

	var req dto.UpdateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequest(c, "Invalid request body")
		return
	}

	tag, err := h.svc.Update(c.Request.Context(), uint(tagID), req)
	if err != nil {
		NotFound(c, "Tag not found")
		return
	}

	Success(c, toTagResponse(tag))
}

// Delete handles DELETE /api/v1/admin/tags/:tagId
func (h *TagHandler) Delete(c *gin.Context) {
	tagIDStr := c.Param("tagId")
	tagID, err := strconv.ParseUint(tagIDStr, 10, 64)
	if err != nil {
		BadRequest(c, "Invalid tag ID")
		return
	}

	if err := h.svc.Delete(c.Request.Context(), uint(tagID)); err != nil {
		InternalError(c, "Failed to delete tag")
		return
	}

	NoContent(c)
}

func toTagResponse(t *entity.Tag) dto.TagResponse {
	return dto.TagResponse{
		ID:   uint(t.ID),
		Name: t.Name,
	}
}

func toTagResponses(tags []entity.Tag) []dto.TagResponse {
	result := make([]dto.TagResponse, len(tags))
	for i, t := range tags {
		result[i] = toTagResponse(&t)
	}
	return result
}