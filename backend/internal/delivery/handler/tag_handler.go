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
// @Summary List or search tags
// @Description Get paginated list of tags, optionally filtered by search query
// @Tags tags
// @Accept json
// @Produce json
// @Param q query string false "Search query"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Page size" default(20)
// @Success 200 {object} dto.TagListResponse
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /tags [get]
func (h *TagHandler) List(c *gin.Context) {
	query := c.Query("q")
	page := 1
	limit := 20

	if p := c.Query("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	var response []dto.TagResponse
	var total int64

	if query != "" {
		tags, tot, err := h.svc.Search(c.Request.Context(), query, page, limit)
		if err != nil {
			InternalError(c, "Failed to search tags")
			return
		}
		total = tot
		response = make([]dto.TagResponse, len(tags))
		for i, t := range tags {
			response[i] = toTagResponse(&t)
		}
	} else {
		tags, err := h.svc.List(c.Request.Context())
		if err != nil {
			InternalError(c, "Failed to list tags")
			return
		}
		total = int64(len(tags))
		response = toTagResponses(tags)
	}

	SuccessWithMeta(c, response, dto.PaginationMeta{
		Page:       page,
		PageSize:   limit,
		TotalCount: total,
		TotalPages: int((total + int64(limit) - 1) / int64(limit)),
	})
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