# Tính năng Staff - Tập trung vào 5 chức năng chính

## Tổng quan
Trang Staff đã được tối ưu hóa để tập trung vào 5 chức năng cốt lõi cần thiết cho công việc hàng ngày của nhân viên, loại bỏ các tính năng phức tạp không cần thiết.

## 5 Chức năng chính được giữ lại

### 1. Quản lý đại lý (`/agencies`)
- **Mục đích**: Quản lý toàn bộ thông tin đại lý
- **Chức năng**:
  - Xem danh sách đại lý có phân trang
  - Thêm đại lý mới với đầy đủ thông tin
  - Cập nhật thông tin đại lý hiện có
  - Xem chi tiết và lịch sử giao dịch
  - Tìm kiếm và lọc đại lý

### 2. Quản lý xuất hàng (`/export`)
- **Mục đích**: Xử lý các đơn hàng xuất ra từ kho
- **Chức năng**:
  - Tạo phiếu xuất hàng mới
  - Xem danh sách tất cả phiếu xuất
  - Cập nhật trạng thái xuất hàng
  - Xem chi tiết từng phiếu xuất
  - In phiếu xuất và giấy tờ giao hàng

### 3. Quản lý nhập hàng (`/import`)
- **Mục đích**: Xử lý việc nhập hàng vào kho
- **Chức năng**:
  - Tạo phiếu nhập hàng mới
  - Xem danh sách phiếu nhập
  - Cập nhật thông tin nhập hàng
  - Kiểm tra và xác nhận hàng nhập
  - Theo dõi trạng thái nhập hàng

### 4. Tra cứu đại lý (`/search`)
- **Mục đích**: Tìm kiếm nhanh thông tin đại lý
- **Chức năng**:
  - Tìm kiếm đại lý theo tên, mã, địa chỉ
  - Lọc theo loại đại lý, khu vực
  - Sắp xếp kết quả tìm kiếm
  - Xem thông tin chi tiết nhanh
  - Xuất danh sách tìm kiếm

### 5. Quản lý thanh toán (`/payment`)
- **Mục đích**: Xử lý các giao dịch thanh toán
- **Chức năng**:
  - Tạo phiếu thu/chi mới
  - Xem lịch sử giao dịch thanh toán
  - Cập nhật trạng thái thanh toán
  - In biên lai và chứng từ
  - Theo dõi công nợ đại lý

## Các thay đổi đã thực hiện

### 1. Cấu trúc Routing
- **Trang chủ**: Chuyển từ `/admin` → `/agencies` (mặc định)
- **Loại bỏ**: `/dashboard`, `/reports`, `/regulations`, `/account`
- **Giữ lại**: `/agencies`, `/export`, `/import`, `/search`, `/payment`

### 2. Sidebar Navigation
- **Từ 9 mục menu** → **5 mục menu**
- **Thứ tự ưu tiên**:
  1. Quản lý đại lý (trang chủ)
  2. Quản lý xuất hàng
  3. Quản lý nhập hàng
  4. Tra cứu đại lý
  5. Quản lý thanh toán

### 3. Branding
- **Logo**: Thay đổi từ "Admin" → "Staff"
- **Màu sắc**: Giữ nguyên theme xanh dương
- **Giao diện**: Đơn giản hóa, loại bỏ các tùy chọn phức tạp

### 4. Loại bỏ Components
- **Landing page**: Không cần thiết cho staff
- **Dashboard**: Thay bằng trang quản lý đại lý
- **Các routes không dùng**: `/about`, `/home`, `/reports`, `/regulations`, `/account`

## Lợi ích của việc tối ưu

### 1. Tăng hiệu suất
- Ít menu → Điều hướng nhanh hơn
- Tập trung vào công việc chính
- Giảm thời gian training nhân viên

### 2. Giảm phức tạp
- Loại bỏ các tính năng không cần thiết
- Workflow rõ ràng và trực quan
- Ít lỗi khi sử dụng

### 3. Phù hợp vai trò
- Chỉ có quyền hạn cần thiết
- Không truy cập được chức năng admin
- Tối ưu cho công việc hàng ngày

## Kế hoạch phát triển tiếp theo

### Phase 1: Hoàn thiện UI/UX (Tuần 1-2)
- [ ] Tối ưu giao diện từng trang
- [ ] Responsive design cho mobile
- [ ] Keyboard shortcuts cho tác vụ thường dùng

### Phase 2: Tính năng nâng cao (Tuần 3-4)
- [ ] Tìm kiếm nâng cao (autocomplete, filter)
- [ ] Xuất/nhập Excel
- [ ] Thông báo real-time

### Phase 3: Tích hợp (Tuần 5-6)
- [ ] API authentication
- [ ] Kết nối database
- [ ] Testing và bug fixes

## Cách triển khai

```bash
# Cài đặt dependencies
cd staff
npm install

# Chạy development
npm run dev

# Truy cập tại: http://localhost:5173
```

Staff sẽ mở trực tiếp trang Quản lý đại lý làm trang chủ. 