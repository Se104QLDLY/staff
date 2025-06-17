# Staff Management System

Đây là trang quản lý dành cho nhân viên, được xây dựng dựa trên cấu trúc tương tự như trang admin nhưng tập trung vào 5 chức năng chính phù hợp với vai trò nhân viên.

## Tính năng chính

### 1. Quản lý đại lý
- Xem danh sách đại lý
- Thêm đại lý mới vào hệ thống
- Cập nhật thông tin đại lý
- Xem chi tiết và lịch sử giao dịch của đại lý

### 2. Quản lý xuất hàng  
- Tạo phiếu xuất hàng mới
- Xem danh sách phiếu xuất
- Cập nhật trạng thái xuất hàng
- In phiếu xuất và giao hàng

### 3. Quản lý nhập hàng
- Tạo phiếu nhập hàng mới
- Xem danh sách phiếu nhập
- Cập nhật thông tin nhập hàng
- Kiểm tra và xác nhận hàng nhập

### 4. Tra cứu đại lý
- Tìm kiếm đại lý theo nhiều tiêu chí
- Xem thông tin chi tiết đại lý
- Lọc và sắp xếp danh sách đại lý
- Xuất báo cáo đại lý

### 5. Quản lý thanh toán
- Tạo phiếu thu/chi mới
- Xem lịch sử giao dịch thanh toán
- Cập nhật trạng thái thanh toán
- In biên lai và chứng từ

## Cách chạy ứng dụng

```bash
# Cài đặt dependencies
npm install

# Chạy ở chế độ development
npm run dev

# Build cho production
npm run build

# Preview bản build
npm run preview
```

## Cấu trúc dự án

- `src/` - Source code chính
  - `components/` - Các React components
  - `routes/` - Các trang và routing
    - `agencies/` - Quản lý đại lý
    - `export/` - Quản lý xuất hàng  
    - `import/` - Quản lý nhập hàng
    - `search/` - Tra cứu đại lý
    - `payment/` - Quản lý thanh toán
    - `auth/` - Xác thực người dùng
  - `hooks/` - Custom React hooks
  - `api/` - Các API calls
  - `assets/` - Tài nguyên tĩnh

## Khác biệt với trang Admin

Trang Staff được thiết kế với:
- **Tập trung**: Chỉ 5 chức năng cốt lõi cho nhân viên
- **Đơn giản**: Giao diện được tối ưu cho công việc hàng ngày
- **Hiệu quả**: Workflow được streamline cho tốc độ xử lý
- **Quyền hạn**: Phù hợp với vai trò nhân viên, không có quyền admin
- **Trực quan**: Sidebar menu gọn gàng, dễ điều hướng

## Tính năng đã loại bỏ

So với trang admin, đã loại bỏ:
- Dashboard tổng quan (thay bằng trang quản lý đại lý)
- Lập báo cáo phức tạp
- Quản lý quy định
- Quản lý tài khoản
- Các trang thông tin khác
# staff
