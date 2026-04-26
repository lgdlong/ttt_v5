# Phase 04: Testing

## Context

- Parent: plan.md
- Depends on: Phases 01, 02, 03 (all code implemented)
- Research: None (testing is validated by execution)

## Overview

**Date:** 2026-04-25
**Description:** Write and run unit tests for core functionality.
**Priority:** P1
**Status:** pending

## Key Insights

- Test YouTube ID extraction with various URL formats
- Test repository functions with mock DB
- Test API handlers with httptest
- Focus on edge cases: empty results, invalid IDs, soft delete filtering

## Requirements

### Unit Tests

**pkg/youtube/client_test.go:**
- TestExtractVideoID various URLs (valid/invalid)
- TestFetchVideoMetadata (mock HTTP if needed)

**internal/repository/video_repository_test.go:**
- TestCreateVideo
- TestGetVideoByID (active and deleted)
- TestListVideos with filters
- TestUpdateVideo
- TestDeleteVideo (soft delete)
- TestAttachTag / DetachTag

**internal/repository/tag_repository_test.go:**
- TestCreateTag (unique constraint)
- TestGetTagByID
- TestListTags
- TestUpdateTag
- TestDeleteTag

**internal/delivery/handler/video_handler_test.go:**
- TestListVideos
- TestGetVideo
- TestCreateVideo (valid/invalid URL)
- TestUpdateVideo
- TestDeleteVideo

### Test Coverage Goals

- Models: 80%+
- Repository: 70%+
- Handlers: 60%+

## Architecture

Test files alongside implementation:
- video_test.go next to video.go
- *_test.go pattern

## Related Code Files

All *_test.go files in backend/

## File Ownership

- backend/internal/models/video_test.go
- backend/internal/repository/video_repository_test.go
- backend/internal/repository/tag_repository_test.go
- backend/internal/delivery/handler/video_handler_test.go
- backend/internal/delivery/handler/tag_handler_test.go
- backend/pkg/youtube/client_test.go

## Implementation Steps

1. Create test files for each component
2. Run tests with `go test ./...`
3. Fix any failures
4. Verify test coverage

## Todo

- [ ] Write YouTube client tests
- [ ] Write repository tests
- [ ] Write handler tests
- [ ] Run full test suite
- [ ] Fix failures
- [ ] Verify coverage

## Success Criteria

- All tests pass
- No flaky tests
- Coverage meets targets

## Conflict Prevention

Test files are owned by Phase 04 only. No overlap with implementation phases.

## Risk Assessment

- Tests may fail if models/repos have bugs → fix the bugs
- Do NOT mock passing tests with fake data

## Security Considerations

- Tests use in-memory DB or mock
- No secrets in test code

## Next Steps

After tests pass → code review → docs update → commit.