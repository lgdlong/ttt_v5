# Brainstorm: Moderated Community Contribution System

> **Date:** 2026-05-09
> **Status:** Agreed — Ready for Implementation Planning
> **Participants:** Developer + AI Advisor

---

## 1. Problem Statement

TTT v5 là hệ thống **curated video discovery** — mục tiêu chính là giúp user **tìm kiếm video cần xem chính xác và nhanh nhất**. Hiện tại, toàn bộ nội dung (video, tags, tag-video associations) do admin quản lý hoàn toàn. Hệ thống cần một cơ chế cho phép **user đóng góp vào xây dựng nội dung** (tags, transcript corrections) mà vẫn **bảo vệ chất lượng curation** thông qua admin moderation.

### Business Context

| Yếu tố | Giá trị |
|---|---|
| Target users | ~3000 active (tối đa), ~200 paying core (Patreon $8/month) |
| Product type | Service cho content creator, cộng đồng engaged |
| Quality philosophy | Human-first, anti-AI-slop, chất lượng > tốc độ |
| Auth requirement | Login required, Better Auth (identity-service) sẵn sàng |
| Moderation | 100% admin review, KHÔNG auto-approval |
| Long-term vision | Mở rộng team (môn học "Trải nghiệm khởi nghiệp"), port transcript pipeline từ v4 |

### Current State (ttt_v5)

- **DB:** `youtube_videos`, `tags`, `video_tags` (many-to-many)
- **Backend:** Go + Gin + GORM, Clean Architecture
- **Frontend:** React 19 + Mantine UI, dark mode, Vietnamese
- **Auth:** Better Auth (Node.js identity-service), shared PostgreSQL, chưa kết nối với Go backend
- **Search:** `ILIKE` trên title + tag filter (AND logic)
- **Admin:** CRUD routes dưới `/admin/`, chưa có auth enforcement

### v4 Context (sẽ port sang v5)

ttt_v4 có transcript processing pipeline đầy đủ:

```
Raw Transcript → LLM Spell Check → Complete Transcript (admin review) → Human Spell Check → Chunks → Embeddings → Semantic Search
```

Tables: `raw_transcripts`, `llm_spell_check_transcripts`, `complete_transcripts`, `human_spell_check_transcripts`, `chunk_transcripts`, `pipeline_stages`, `video_pipeline_stages`

User contribution sẽ chỉ sửa **transcript final đã public** (>95% accuracy), không phải raw transcript.

---

## 2. Evaluated Approaches

### Approach A: Free-form User Tagging ❌ REJECTED

User tự do tạo và gắn tag bất kỳ.

| | |
|---|---|
| 👍 | Tối đa sự tự do, nội dung tăng nhanh |
| 👎 | **Tag pollution**, duplicates, spam, phá hủy curation quality |
| 👎 | Cần NLP dedup, anti-spam phức tạp |
| Verdict | **Loại** — Vi phạm triết lý chất lượng của dự án |

### Approach B: Tag Relevance Voting (Crowd Wisdom) ⚠️ DEFERRED

User vote up/down cho tag-video association đã có.

| | |
|---|---|
| 👍 | Không cần moderation, self-correcting, nhẹ |
| 👍 | Tín hiệu tốt cho search ranking |
| 👎 | Cold start — cần đủ user mới hiệu quả |
| 👎 | Chỉ hoạt động trên tag đã gắn, không thêm tag mới |
| Verdict | **Defer** — Có thể thêm sau khi có đủ user base |

### Approach C: Moderated Tag Suggestions ✅ SELECTED

User gợi ý tag (có sẵn hoặc mới) → admin duyệt → gắn vào video.

| | |
|---|---|
| 👍 | Giữ chất lượng curation 100% |
| 👍 | Tận dụng 200 core engaged users |
| 👍 | Tận dụng tag system sẵn có |
| 👍 | Mở rộng tự nhiên sang transcript corrections |
| 👎 | Admin là bottleneck (chấp nhận được với ~200 active contributors) |
| Verdict | **Chọn** — Phù hợp nhất với quy mô và triết lý dự án |

### Approach D: Reputation/Gamification System ⚠️ DEFERRED

Hệ thống điểm, badges, leaderboard cho contributors.

| | |
|---|---|
| 👍 | Khuyến khích đóng góp tích cực |
| 👎 | YAGNI ở giai đoạn hiện tại |
| Verdict | **Defer** — Xây nền tảng contribution trước, gamification sau |

---

## 3. Final Design Decisions

### 3.1 Schema Strategy: Separate Tables (Option B)

**Đã cân nhắc 3 options:**

| Option | Mô tả | Verdict |
|---|---|---|
| A. Single JSONB table | Một bảng `contributions` với payload JSONB | ❌ Mất type safety trong Go, unique constraint phức tạp |
| **B. Separate tables** | Mỗi loại contribution = 1 bảng riêng | ✅ **Selected** |
| C. Base + extension | Bảng base chung + bảng detail riêng | ❌ Over-engineered cho 2 types |

**Lý do chọn B:**

- KISS — chỉ có 2 loại contribution (tag + transcript)
- Go type system cần concrete structs, không phải `interface{}`
- Clean Architecture demands clear domain entities
- Proper database constraints (CHECK, UNIQUE) trên typed columns
- Thêm type mới = thêm bảng + entity + service → overhead chấp nhận được
- Admin dashboard aggregate ở service layer, không cần DB-level unification

### 3.2 Auth Middleware: Shared DB Session Query

Go backend đọc Better Auth session cookie → query trực tiếp bảng `session` trên shared PostgreSQL → validate expiry → extract `user_id`.

**Lý do:** Cùng database, đơn giản, không cần HTTP call cross-service. Phù hợp kiến trúc shared-DB hiện tại.

### 3.3 Moderation: 100% Admin Review

Không auto-approval. Mọi contribution phải qua tay admin. Chấp nhận admin bottleneck vì:

- Community nhỏ (~200 active contributors tối đa)
- Chất lượng là ưu tiên số 1
- Target audience ghét nội dung kém chất lượng

### 3.4 Contribution Types: Chỉ Tag + Transcript

Không mở rộng thêm contribution type khác. Đủ phục vụ mục tiêu "tìm kiếm chính xác":

1. **Tag Suggestions** — cải thiện discoverability
2. **Transcript Corrections** — cải thiện search accuracy (khi port từ v4)

### 3.5 Admin Role: Cần Setup Trong Better Auth

Better Auth chưa có role setup. Sử dụng [Admin Plugin](https://www.better-auth.com/docs/plugins/admin) — tự động thêm cột `role` vào bảng `users`.

**Roles:**

| Role | Quyền | Mô tả |
|---|---|---|
| `user` | Submit suggestions, xem status | Default cho mọi user mới |
| `admin` | Approve/reject, admin dashboard, full CRUD | Quản trị viên |
| `moderator` (future) | Approve/reject, không xóa user/config | Mở rộng khi cần |
| `premium` (future) | Map với Patreon paying users | Mở rộng khi cần |

**Triển khai:** Khai báo Admin Plugin trong Better Auth config → tự động thêm cột `role VARCHAR DEFAULT 'user'` vào bảng `users`. Go backend JOIN `sessions` + `users` để lấy role trong 1 query duy nhất.

---

## 4. Technical Design

### 4.1 Database Schema

#### Tag Suggestions (MVP)

```sql
CREATE TABLE tag_suggestions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255),                   -- SET NULL on user delete (audit trail)
    video_id VARCHAR(20) NOT NULL
        REFERENCES youtube_videos(youtube_id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    suggested_name VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    admin_note TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Chỉ 1 trong 2: tag có sẵn HOẶC tên tag mới
    CONSTRAINT chk_tag_or_name CHECK (
        (tag_id IS NOT NULL AND suggested_name IS NULL) OR
        (tag_id IS NULL AND suggested_name IS NOT NULL)
    ),
    -- Mỗi user chỉ gợi ý 1 lần cho mỗi cặp video-tag
    CONSTRAINT uq_user_video_tag UNIQUE (user_id, video_id, tag_id)
);

-- Case-insensitive + trimmed unique cho tên tag mới (tránh "Triết học" vs "triết học ")
CREATE UNIQUE INDEX uq_user_video_suggested_name
    ON tag_suggestions (user_id, video_id, LOWER(TRIM(suggested_name)))
    WHERE suggested_name IS NOT NULL;

CREATE INDEX idx_tag_suggestions_status ON tag_suggestions(status);
CREATE INDEX idx_tag_suggestions_video ON tag_suggestions(video_id);
CREATE INDEX idx_tag_suggestions_user ON tag_suggestions(user_id);
```

> **Data Normalization:** Backend service PHẢI `LOWER(TRIM())` giá trị `suggested_name` trước khi lưu. Unique index ở DB là safety net, không phải logic chính.

#### Transcript Corrections (khi port transcript từ v4 — CHỈ GHI CHÚ, không implement ngay)

> ⚠️ **Lưu ý:** Feature này phức tạp (cần sync Qdrant vector embeddings khi approve). Chỉ ghi chú thiết kế, KHÔNG đưa vào implementation plan MVP.

```sql
CREATE TABLE transcript_corrections (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255),                   -- SET NULL on user delete
    video_id VARCHAR(20) NOT NULL
        REFERENCES youtube_videos(youtube_id) ON DELETE CASCADE,
    chunk_id BIGINT NOT NULL,               -- BẮT BUỘC: link tới chunk cụ thể
    original_text TEXT NOT NULL,            -- Lưu lại để admin đối chiếu
    corrected_text TEXT NOT NULL,
    reason VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    admin_note TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transcript_corrections_status ON transcript_corrections(status);
CREATE INDEX idx_transcript_corrections_video ON transcript_corrections(video_id);
CREATE INDEX idx_transcript_corrections_chunk ON transcript_corrections(chunk_id);
```

**Approve flow phức tạp (Transaction 2 bước):**

1. **PostgreSQL:** Update text trong `chunk_transcripts`, concatenate lại toàn bộ chunks để update `complete_transcripts`
2. **Qdrant Sync:** Re-embed chunk mới → Upsert vector vào Qdrant theo `qdrant_point_id`

**Frontend:** Render transcript theo chunks, mỗi chunk có `data-chunk-id`. User click chunk → modal sửa → submit correction với `chunk_id`.

#### Status Values

```
pending   → Chờ admin duyệt
approved  → Admin đã duyệt (tag được gắn / transcript được sửa)
rejected  → Admin từ chối
```

### 4.2 Backend Architecture

Theo đúng Clean Architecture pattern hiện có của v5:

```
backend/internal/
├── domain/
│   ├── entity/
│   │   └── tag_suggestion.go              # Entity + status constants
│   ├── dto/
│   │   └── tag_suggestion_dto.go          # Create/Update/Response DTOs
│   └── port/
│       └── tag_suggestion_repository.go   # Repository interface
├── application/service/
│   └── tag_suggestion_svc.go              # Business logic
│       - Create: validate input, check duplicates, save
│       - Approve: set status, auto-attach tag (or create new tag + attach)
│       - Reject: set status + admin note
│       - ListPending: for admin dashboard
│       - ListByUser: for user's own suggestions
├── repository/
│   └── tag_suggestion_repo.go             # GORM implementation
└── delivery/
    ├── handler/
    │   └── tag_suggestion_handler.go      # HTTP handlers
    └── middleware/
        └── auth.go                        # Session validation (NEW)
```

### 4.3 Auth Middleware

> **Verified:** Better Auth config dùng `usePlural: true` và snake_case field mapping.
> Bảng thực tế: `sessions` (không phải `session`), columns: `user_id`, `expires_at`, `token`.

```go
// auth.go — prerequisite cho mọi contribution feature

func AuthRequired(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Read session token from cookie
        token, err := c.Cookie("better-auth.session_token")
        if err != nil {
            Unauthorized(c, "Session required")
            return
        }

        // 2. Query sessions JOIN users — lấy user_id + role trong 1 query
        var sessionData struct {
            UserID string `gorm:"column:user_id"`
            Role   string `gorm:"column:role"`
        }
        err = db.Table("sessions").
            Select("sessions.user_id, users.role").
            Joins(`JOIN users ON sessions.user_id = users.id`).
            Where("sessions.token = ? AND sessions.expires_at > ?", token, time.Now()).
            First(&sessionData).Error
        if err != nil {
            Unauthorized(c, "Invalid or expired session")
            return
        }

        // 3. Set user context
        c.Set("user_id", sessionData.UserID)
        c.Set("user_role", sessionData.Role)
        c.Next()
    }
}

func AdminRequired(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Reuse AuthRequired logic, then check role
        AuthRequired(db)(c)
        if c.IsAborted() {
            return
        }
        role, _ := c.Get("user_role")
        if role != "admin" {
            Forbidden(c, "Admin access required")
            c.Abort()
            return
        }
        c.Next()
    }
}
```

> **CORS lưu ý:** Frontend API calls cần `credentials: 'include'` để gửi cookie. Go backend CORS middleware cần `AllowCredentials: true` và `AllowOrigins` cụ thể (không dùng wildcard `*`).
>
> **Security note:** Theo thiết kế mặc định của Better Auth, cột `token` trong bảng `sessions` lưu giá trị raw (không hash), và value của cookie cũng là raw token này (được sign để chống giả mạo nhưng có thể đọc trực tiếp). Do đó, Go backend có thể query thẳng bằng toán tử `=` mà không cần logic hashing.

### 4.4 API Endpoints

#### User Endpoints (AuthRequired)

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/videos/:videoId/suggestions` | Gửi gợi ý tag (existing hoặc new) |
| GET | `/api/v1/me/suggestions` | Xem danh sách gợi ý của mình |

#### Admin Endpoints (AdminRequired)

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/admin/suggestions` | Danh sách suggestions (filter by status) |
| PUT | `/api/v1/admin/suggestions/:id/approve` | Duyệt suggestion |
| PUT | `/api/v1/admin/suggestions/:id/reject` | Từ chối suggestion (with admin note) |

#### Request/Response Examples

**POST /api/v1/videos/:videoId/suggestions**

```json
// Gợi ý tag có sẵn
{ "tag_id": 5 }

// Đề xuất tag mới
{ "suggested_name": "Triết học Stoic" }
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": 42,
    "video_id": "dQw4w9WgXcQ",
    "tag_id": 5,
    "tag_name": "Triết học",
    "status": "pending",
    "created_at": "2026-05-09T15:00:00Z"
  }
}
```

**PUT /api/v1/admin/suggestions/:id/approve**

```json
{ "admin_note": "Tag phù hợp" }
```

Side-effect khi approve:
- Nếu `tag_id` != null → Gắn tag vào video (INSERT `video_tags`)
- Nếu `suggested_name` != null → Tạo tag mới (INSERT `tags`) + Gắn vào video

**PUT /api/v1/admin/suggestions/:id/reject**

```json
{ "admin_note": "Tag không liên quan đến nội dung video" }
```

### 4.5 Frontend UX

#### User Flow: Gợi Ý Tag

```
1. User xem VideoDetailPanel
2. Nhấn nút "Gợi ý thẻ" (chỉ hiện khi đã đăng nhập)
3. Modal mở ra:
   - Checkbox list các tags có sẵn (chưa gắn vào video này)
   - Input "Đề xuất thẻ mới" (free text, max 50 chars)
4. Submit → API call → Toast "Đã gửi gợi ý, cảm ơn bạn!"
5. User có thể xem status gợi ý của mình ở trang cá nhân
```

#### Admin Flow: Moderation

```
1. Admin Dashboard → Tab "Đóng góp" (hoặc "Moderation")
2. Danh sách suggestions pending, sorted by newest
3. Mỗi item hiển thị:
   - Video thumbnail + title
   - Tag gợi ý (existing) hoặc tên tag mới
   - User đề xuất
   - Ngày gửi
4. Actions: [Duyệt] [Từ chối] + input admin note
5. Approve → tag tự động gắn vào video
```

---

## 5. Phased Rollout

| Phase | Nội dung | Prerequisite | Effort |
|---|---|---|---|
| **Phase 1** | Auth middleware (Go backend verify Better Auth sessions) | Identity service ✅ | Low |
| **Phase 2** | Admin role setup (Better Auth organization/role plugin) | Phase 1 | Low |
| **Phase 3** | Tag Suggestions — schema, backend, API | Phase 1 + 2 | Medium |
| **Phase 4** | Tag Suggestions — frontend UX (user + admin) | Phase 3 | Medium |
| **Phase 5** | Port transcript pipeline từ v4 | Phase 3 | High |
| **Phase 6** | Transcript Corrections — schema, backend, frontend | Phase 5 | Medium |
| **Phase 7** | Gamification (điểm, leaderboard) | Phase 3 + 6 | Low-Medium |

**MVP = Phase 1 → 4** (Tag Suggestions end-to-end)

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Admin bottleneck (duyệt chậm) | User mất hứng đóng góp | Discord/Telegram webhook notify admin; batch approve UI (multi-select) |
| Spam suggestions | Tốn thời gian admin filter | Rate limit 10-20 suggestions/ngày/user (in-memory hoặc Redis token bucket) |
| Tag name duplicates (viết hoa/thường, dấu) | Tag pollution | `LOWER(TRIM())` ở service layer + functional unique index ở DB |
| Better Auth session format thay đổi | Auth middleware break | Pin Better Auth version, integration tests |
| v4 transcript port phức tạp | Delay Phase 5-6 | Phase 3-4 (tag suggestions) hoạt động độc lập, không phụ thuộc v4 |
| User xóa tài khoản | Mất audit trail contributions | `user_id` SET NULL on delete, không cascade delete contributions |
| Race condition: approve new tag nhưng tag đã tồn tại | Duplicate tag / DB error | Approve flow: check `tags.name` exists → nếu có thì attach existing, không tạo mới |
| Approve tag nhưng video đã có tag đó rồi | Duplicate `video_tags` entry | Approve flow: check `video_tags` exists → nếu có thì mark "already_applied" |
| Admin offline lâu | Suggestions pile up, user mất hứng | Discord webhook là safety net; user thấy status "pending" rõ ràng trên UI |

---

## 7. Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Suggestions submitted (tuần đầu) | >10 | Count `tag_suggestions` |
| Approval rate | >60% | approved / total |
| Time-to-review (median) | <24h | `reviewed_at - created_at` |
| Unique contributors (tháng) | >20 | Distinct `user_id` |
| Tags added via suggestions | >30 trong 3 tháng | Count approved suggestions |

---

## 8. Open Items

| # | Item | Status | Impact |
|---|---|---|---|
| 1 | Better Auth Admin Plugin setup (role column) | **Cần giải quyết trước Phase 2** | Blocks admin endpoints |
| 2 | ~~Better Auth session cookie name~~ | ✅ Verified: `better-auth.session_token` | Resolved |
| 3 | ~~Better Auth table/column names~~ | ✅ Verified: `sessions`, `users`, snake_case, plural | Resolved |
| 4 | Admin dashboard UX design | Cần thiết kế | Phase 4 |
| 5 | v4 → v5 transcript migration strategy | Cần phân tích chi tiết | Phase 5 |
| 6 | Rate limiting: 10 hay 20 suggestions/ngày/user? | Cần quyết định | Phase 3 |
| 7 | Discord/Telegram webhook cho admin notification | Cần setup channel | Phase 3-4 |
| 8 | CORS config: `AllowCredentials` + specific origins | Cần cập nhật middleware | Phase 1 |
| 9 | Transcript correction + Qdrant re-embedding flow | Ghi chú, KHÔNG implement MVP | Phase 5-6 |

---

## 9. Decision Log

| # | Decision | Rationale | Date |
|---|---|---|---|
| 1 | Separate tables per contribution type | KISS, Go type safety, Clean Architecture | 2026-05-09 |
| 2 | Shared DB session query (không HTTP call) | Cùng DB, đơn giản, latency thấp | 2026-05-09 |
| 3 | 100% admin moderation, no auto-approval | Chất lượng > tốc độ, community nhỏ | 2026-05-09 |
| 4 | Chỉ 2 contribution types (tag + transcript) | YAGNI, đủ phục vụ mục tiêu search | 2026-05-09 |
| 5 | Tag suggestions MVP trước, transcript corrections sau | Tag system sẵn có, transcript cần port v4 | 2026-05-09 |
| 6 | Better Auth Admin Plugin cho role management | Đơn giản, tự động thêm cột role, không cần RBAC phức tạp | 2026-05-09 |
| 7 | `user_id` SET NULL on delete (không cascade) | Bảo vệ audit trail, contributions là dữ liệu lịch sử | 2026-05-09 |
| 8 | `LOWER(TRIM())` normalization cho suggested_name | Tránh duplicates do case/whitespace, DB index là safety net | 2026-05-09 |
| 9 | Transcript corrections cần `chunk_id` (không chỉ video_id) | Mapping chính xác tới chunk, phục vụ Qdrant re-embedding | 2026-05-09 |
| 10 | Transcript correction KHÔNG nằm trong MVP | Phức tạp (Qdrant sync), cần port v4 trước, ghi chú thiết kế thôi | 2026-05-09 |

---

## 10. Edge Cases & Business Logic (Bổ sung từ Review)

### 10.1 Approval Flow — Edge Cases

**Case 1: Approve new tag nhưng tag name đã tồn tại**

```
User gợi ý tag mới "Triết học" → pending
Admin tạo tag "Triết học" qua admin CRUD (trong lúc chờ)
Admin approve suggestion → Service PHẢI:
  1. Check tags.name = LOWER(TRIM("Triết học")) → tìm thấy existing tag
  2. Attach existing tag vào video (không tạo duplicate)
  3. Set suggestion status = 'approved'
```

> ⚠️ **Lưu ý Code Go (Transaction):** Vì luồng Approve liên quan tới nhiều thao tác (insert tag mới, insert video_tags, update status), BẮT BUỘC phải bọc toàn bộ trong GORM Transaction (`db.Transaction(func(tx *gorm.DB) error { ... })`). Nếu bất kỳ step nào lỗi, toàn bộ thao tác sẽ rollback.

**Case 2: Approve tag nhưng video đã có tag đó**

```
User A gợi ý tag #5 cho video X → pending
Admin gắn tag #5 cho video X qua admin CRUD
Admin approve User A suggestion → Service PHẢI:
  1. Check video_tags(video_id, tag_id) exists → đã có
  2. Set suggestion status = 'approved' (ghi nhận đóng góp)
  3. KHÔNG insert duplicate vào video_tags
```

**Case 3: Admin reject → PHẢI có lý do**

```
Admin reject suggestion → admin_note REQUIRED (binding:"required")
User thấy rejection reason → học hỏi → gợi ý tốt hơn lần sau
```

### 10.2 Admin Notification (Webhook)

Không cần hệ thống in-app notification phức tạp. Chỉ cần webhook đơn giản trong `tag_suggestion_svc.Create()`:

```go
// Trong TagSuggestionService.Create(), sau khi save thành công:
go func() {
    // ⚠️ QUAN TRỌNG: Bắt panic để không crash toàn bộ Go backend
    defer func() {
        if r := recover(); r != nil {
            log.Printf("Recovered from webhook panic: %v", r)
        }
    }()

    webhookURL := os.Getenv("ADMIN_WEBHOOK_URL") // Discord/Telegram
    if webhookURL == "" { return }
    msg := fmt.Sprintf("📌 Gợi ý tag mới từ user %s cho video '%s': %s", userID, videoTitle, tagName)
    http.Post(webhookURL, "application/json", strings.NewReader(`{"content":"`+msg+`"}`))  
}()
```

### 10.3 Cascading Deletes & Audit Trail

| Table | On User Delete | Lý do |
|---|---|---|
| `tag_suggestions` | Bắt ở Code Go (Reassign) | Không dùng DB Cascade. Khi user xóa account, business logic sẽ tự động gán lại (reassign) `user_id` của các contribution cho một **System Admin account** mặc định. Đảm bảo Audit trail không bao giờ bị đứt gãy hay Null pointer trên Admin Dashboard. (Hoặc ưu tiên Soft-delete / Ban user bên Better Auth thay vì hard delete). |
| `transcript_corrections` | Bắt ở Code Go (Reassign) | Giống `tag_suggestions`, reassign cho System Admin. |
| `sessions` | CASCADE (Better Auth default) | Session hết giá trị khi user xóa |

### 10.4 Rate Limiting

Per-user rate limit cho suggestion endpoints:

- **Limit:** 10-20 suggestions/ngày/user (chốt con số khi implement)
- **Implementation:** In-memory counter (đủ cho ~200 active users) hoặc Redis nếu đã có
- **Response khi vượt limit:** 429 Too Many Requests + message "Bạn đã gửi quá nhiều gợi ý hôm nay"

### 10.5 Frontend UX Details

- **Suggestion modal:** CHỈ hiển thị tags CHƯA gắn vào video (filter out đã có)
- **User feedback:** Badge "Đang chờ duyệt" / "Đã duyệt" / "Từ chối: {lý do}" trên video
- **Admin batch ops:** Multi-select checkboxes + "Duyệt tất cả" / "Từ chối tất cả" buttons
