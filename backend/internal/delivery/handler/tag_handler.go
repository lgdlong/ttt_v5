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

// List godoc
// @Summary List all tags
// @Description Get a list of all available tags
// @Tags tags
// @Accept json
// @Produce json
// @Success 200 {object} dto.TagResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /tags [get]
func (h *TagHandler) List(c *gin.Context) {
	tags, err := h.svc.List(c.Request.Context())
	if err != nil {
		InternalError(c, "Failed to list tags")
		return
	}

	Success(c, gin.H{"tags": toTagResponses(tags)})
}

// GetByID godoc
// @Summary Get tag by ID
// @Description Get a single tag by its ID
// @Tags tags
// @Accept json
// @Produce json
// @Param tagId path int true "Tag ID"
// @Success 200 {object} dto.TagResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /tags/{tagId} [get]
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

// Create godoc
// @Summary Create a new tag
// @Description Create a new tag (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param tag body dto.CreateTagRequest true "Tag data"
// @Success 201 {object} dto.TagResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/tags [post]
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

// Update godoc
// @Summary Update a tag
// @Description Update an existing tag (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param tagId path int true "Tag ID"
// @Param tag body dto.UpdateTagRequest true "Tag data"
// @Success 200 {object} dto.TagResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /admin/tags/{tagId} [put]
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

// Delete godoc
// @Summary Delete a tag
// @Description Delete a tag by ID (admin only)
// @Tags admin
// @Accept json
// @Produce json
// @Param tagId path int true "Tag ID"
// @Success 204
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/tags/{tagId} [delete]
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