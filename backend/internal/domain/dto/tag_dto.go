package dto

// TagFilter holds query parameters for filtering tags
type TagFilter struct {
	Query string `form:"q"`
	Sort  string `form:"sort"`
	Order string `form:"order"`
	Page  int    `form:"page"`
	Limit int    `form:"limit"`
}

// Normalize sets default values for tag filter
func (f *TagFilter) Normalize() {
	if f.Limit <= 0 || f.Limit > 100 {
		f.Limit = 20
	}
	if f.Order == "" {
		f.Order = "asc"
	}
	if f.Page <= 0 {
		f.Page = 1
	}
}

// CreateTagRequest represents the request to create a new tag
type CreateTagRequest struct {
	Name string `json:"name" binding:"required,min=1,max=50"`
}

// UpdateTagRequest represents the request to update a tag
type UpdateTagRequest struct {
	Name *string `json:"name" binding:"omitempty,min=1,max=50"`
}

// TagResponse represents a tag in API responses
type TagResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// TagListResponse represents a list of tags
type TagListResponse struct {
	Data []TagResponse `json:"data"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}