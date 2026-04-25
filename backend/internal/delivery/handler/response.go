package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DataResponse represents the standard data-only API response format
type DataResponse struct {
	Data    interface{} `json:"data"`
	Meta    interface{} `json:"meta,omitempty"`
}

// ErrorResponse represents an API error
type ErrorResponse struct {
	Error *APIError `json:"error"`
}

// APIError represents an API error
type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Success sends a successful JSON response with data
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, DataResponse{
		Data: data,
		Meta: nil,
	})
}

// SuccessWithMeta sends a successful JSON response with data and meta
func SuccessWithMeta(c *gin.Context, data interface{}, meta interface{}) {
	c.JSON(http.StatusOK, DataResponse{
		Data: data,
		Meta: meta,
	})
}

// Created sends a 201 created response
func Created(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, DataResponse{
		Data: data,
		Meta: nil,
	})
}

// NoContent sends a 204 no content response
func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

// Error sends an error response
func ErrorResp(c *gin.Context, status int, code, message string) {
	c.JSON(status, ErrorResponse{
		Error: &APIError{
			Code:    code,
			Message: message,
		},
	})
}

// BadRequest sends a 400 bad request error
func BadRequest(c *gin.Context, message string) {
	ErrorResp(c, http.StatusBadRequest, "BAD_REQUEST", message)
}

// NotFound sends a 404 not found error
func NotFound(c *gin.Context, message string) {
	ErrorResp(c, http.StatusNotFound, "NOT_FOUND", message)
}

// InternalError sends a 500 internal server error
func InternalError(c *gin.Context, message string) {
	ErrorResp(c, http.StatusInternalServerError, "INTERNAL_ERROR", message)
}

// Conflict sends a 409 conflict error
func Conflict(c *gin.Context, message string) {
	ErrorResp(c, http.StatusConflict, "CONFLICT", message)
}

// TooManyRequests sends a 429 rate limit exceeded error
func TooManyRequests(c *gin.Context, message string) {
	ErrorResp(c, http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", message)
}