# Survey Portal

Cổng trả lời khảo sát: người được mời mở link dạng `/survey/:code?token=...` để điền và gửi phiếu.

## Chạy

1. Cài đặt: `npm install`
2. Tạo file `.env` (tuỳ chọn):
   - `VITE_API_BASE_URL=http://localhost:3000/api` (trỏ tới survey-core)
3. Chạy: `npm run dev`
4. Build: `npm run build`

## Luồng

- Mở link → kiểm tra token → hiển thị form câu hỏi (chỉ khảo sát Active, trong khoảng ngày).
- Lưu nháp (partial) hoặc Gửi hoàn thành → cập nhật trạng thái doanh nghiệp (Viewed / Partial / Completed).
