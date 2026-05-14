# Chiến lược xác thực Email - TTT Project

## 1. Bài toán
Cần quyết định việc có bắt buộc xác thực email ngay khi đăng ký tài khoản hay không. Đây là sự đánh đổi giữa **trải nghiệm người dùng (UX)** và **chất lượng dữ liệu/bảo mật**.

## 2. Các phương án đánh giá

| Tiêu chí | Phương án A: Bắt buộc ngay | Phương án B: Không xác thực | Phương án C: Hybrid (Khuyến nghị) |
|----------|---------------------------|----------------------------|-----------------------------------|
| **UX/Ma sát** | Rất cao (dễ bỏ cuộc) | Không có (mượt nhất) | Thấp (đăng ký xong dùng ngay) |
| **Chất lượng dữ liệu** | 100% email thật | Rất nhiều tài khoản rác | Email thật tăng dần theo thời gian |
| **Bảo mật** | Cao nhất | Thấp | Trung bình - Cao |
| **Marketing** | List email sạch 100% | List email nhiều bounce | List email phân loại được |

## 3. Giải pháp đề xuất: Phương án Hybrid

### Lý do lựa chọn:
- **Tối ưu tỷ lệ chuyển đổi (Conversion):** Không chặn người dùng khám phá ứng dụng ngay sau khi đăng ký.
- **Tính thực tế:** Hiện tại hệ thống chưa tích hợp nhà cung cấp email (Resend/SendGrid). Bắt buộc xác thực sẽ làm tê liệt quy trình đăng ký.
- **Khả năng mở rộng:** Dễ dàng thắt chặt quy định khi lượng người dùng lớn và các tính năng cộng đồng (comment, tag) trở nên nhạy cảm hơn.

### Lộ trình thực hiện:

#### Giai đoạn 1 (Hiện tại):
- `requireEmailVerification = false` trong cấu hình Better Auth.
- Cho phép người dùng đăng ký và sử dụng toàn bộ tính năng.

#### Giai đoạn 2 (Sau khi có Email Infra):
- Tích hợp Resend/SendGrid vào `identity-service`.
- Hiển thị banner nhắc nhở xác thực email trên Header nếu `user.emailVerified` là false.
- Gửi email xác thực tự động sau khi đăng ký.

#### Giai đoạn 3 (Trưởng thành):
- Giới hạn các tính năng "ghi" (như đề xuất tag, chỉnh sửa transcript) chỉ dành cho tài khoản đã xác thực.
- Tài khoản chưa xác thực chỉ được xem nội dung.

## 4. Rủi ro và giải pháp
- **Rủi ro:** Tài khoản rác chiếm dụng tài nguyên.
- **Giải pháp:** Chạy script dọn dẹp (clean up) các tài khoản chưa xác thực sau 30 ngày định kỳ.

## 5. Kết luận
Ở giai đoạn MVP và phát triển sớm, **không nên bắt buộc xác thực email ngay lập tức**. Hãy ưu tiên giữ chân người dùng và giảm thiểu ma sát đăng ký, đồng thời chuẩn bị hạ tầng để chuyển sang mô hình Hybrid khi cần thiết.
