# Kế hoạch Phát triển Frontend - Dự án Quản Lý Đại Lý

Tài liệu này mô tả kế hoạch phát triển giao diện người dùng (frontend) cho dự án "Quản Lý Các Đại Lý", dựa trên tài liệu đặc tả chi tiết đã cung cấp.

## I. Công nghệ Frontend Chủ đạo

*   **Ngôn ngữ:** JavaScript / TypeScript
*   **Thư viện/Framework:** React 18
*   **Quản lý Trạng thái (State Management):** Redux Toolkit
*   **Thư viện UI Component:** Material-UI
*   **Xử lý Form:** React Hook Form
*   **HTTP Client (Gọi API):** Axios
*   **Trực quan hóa Dữ liệu (Biểu đồ):** Recharts / Chart.js

## II. Các Module & Màn hình Giao diện Chính

Dưới đây là các module chính cần phát triển cho frontend, tham chiếu từ tài liệu đặc tả (đặc biệt là các chương 1, 2, 4.5 và 5.3).

### 1. Xác thực Người dùng (Authentication)

*   **Màn hình:**
    *   Form Đăng nhập (Tên đăng nhập, Mật khẩu).
    *   Nút "Đăng nhập".
    *   (Tùy chọn) Link "Quên mật khẩu".
*   **Chức năng:**
    *   Validate input người dùng.
    *   Gọi API backend để xác thực.
    *   Xử lý đăng nhập thành công (lưu token/thông tin user vào Redux, chuyển hướng đến Dashboard).
    *   Hiển thị thông báo lỗi nếu đăng nhập thất bại.
    *   Quản lý route được bảo vệ (Protected Routes).
*   **Tham khảo:** Mục 4.5.1, Hình 5.1.

### 2. Bố cục Chính & Dashboard

*   **Màn hình:**
    *   Thanh điều hướng (Navigation: Sidebar hoặc Top bar) để truy cập các module.
    *   Thông tin người dùng / Nút Đăng xuất.
    *   Dashboard hiển thị:
        *   Tổng số đại lý hoạt động.
        *   Doanh số bán hàng tháng.
        *   Công nợ hiện tại.
        *   Biểu đồ doanh số theo thời gian.
        *   Danh sách đại lý có công nợ cao nhất.
*   **Chức năng:**
    *   Gọi API để lấy dữ liệu cho Dashboard.
*   **Tham khảo:** Hình 5.2.

### 3. Quản lý Đại lý (Agency Management)

*   **Màn hình Danh sách (List View):**
    *   Bảng hiển thị danh sách đại lý (Mã, Tên, Loại, Quận/Huyện, Địa chỉ, SĐT, Email,...).
    *   Thanh tìm kiếm.
    *   Bộ lọc (theo Loại, Quận,...).
    *   Nút "Thêm đại lý".
    *   Các nút hành động (Sửa, Xóa) cho mỗi dòng.
    *   Phân trang.
*   **Màn hình Form (Thêm/Sửa):**
    *   Các trường nhập liệu cho thông tin đại lý.
    *   Nút "Lưu", "Hủy".
*   **Chức năng:**
    *   Thực hiện các thao tác CRUD (Create, Read, Update, Delete) cho đại lý thông qua API.
    *   Validate form.
*   **Tham khảo:** Mục 1.2.2 BM1, BM4; 2.1.2 UC03; 4.5.2; Hình 5.3, 5.4.

### 4. Quản lý Nhập hàng (Goods Import Management)

*   **Màn hình Danh sách:**
    *   Bảng hiển thị phiếu nhập (Mã phiếu, Đại lý, Ngày nhập, Tổng tiền,...).
    *   Bộ lọc (theo Đại lý, Khoảng thời gian).
    *   Nút "Tạo phiếu nhập".
    *   Nút hành động (Xem chi tiết, Sửa, Xóa).
*   **Màn hình Form (Tạo/Sửa):**
    *   Thông tin chung của phiếu nhập.
    *   Bảng chi tiết mặt hàng nhập (Mã sản phẩm, Tên, Số lượng, Đơn giá, Thành tiền - tự tính).
    *   Nút "Thêm sản phẩm".
    *   Hiển thị tổng tiền (tự tính).
    *   Nút "Lưu", "Hủy".
*   **Chức năng:** CRUD phiếu nhập, tính toán tự động.
*   **Tham khảo:** Mục 1.2.2 BM2; 2.1.2 UC04; 4.5.3; Hình 5.5, 5.6.

### 5. Quản lý Xuất hàng (Goods Export Management)

*   **Màn hình Danh sách:**
    *   Bảng hiển thị phiếu xuất (Mã phiếu, Đại lý, Ngày xuất, Tổng tiền,...).
    *   Thanh tìm kiếm, Bộ lọc.
    *   Nút "Tạo phiếu xuất".
    *   Nút hành động.
*   **Màn hình Form (Tạo/Sửa):**
    *   Thông tin chung của phiếu xuất (chọn Đại lý - hiển thị công nợ hiện tại).
    *   Bảng chi tiết mặt hàng xuất (Mã sản phẩm, Tên, Số lượng - kiểm tra tồn kho, Đơn giá - tự tính theo QĐ3, Thành tiền).
    *   Hiển thị số lượng tồn kho.
    *   Nút "Thêm sản phẩm".
    *   Hiển thị tổng tiền.
    *   Nút "Lưu", "Hủy".
*   **Chức năng:** CRUD phiếu xuất, kiểm tra tồn kho, kiểm tra hạn mức nợ (QĐ3), tính toán giá.
*   **Tham khảo:** Mục 1.2.2 BM3; 2.1.2 UC05; 4.5.4; Hình 5.7, 5.8.

### 6. Quản lý Thanh toán (Payment Management)

*   **Màn hình Danh sách:**
    *   Bảng hiển thị phiếu thu (Mã phiếu, Đại lý, Số tiền, Ngày thu,...).
    *   Thanh tìm kiếm.
    *   Nút "Thêm phiếu thu".
*   **Màn hình Form (Tạo/Sửa):**
    *   Thông tin phiếu thu (chọn Đại lý - hiển thị công nợ).
    *   Nhập số tiền thu (validate không vượt quá công nợ theo QĐ5).
    *   Nút "Lưu", "Hủy".
*   **Chức năng:** CRUD phiếu thu, validate số tiền thu.
*   **Tham khảo:** Mục 1.2.2 BM5; 2.1.2 UC07; 4.5.5; Hình 5.9, 5.10.

### 7. Báo cáo (Reporting)

*   **Màn hình Chính:**
    *   Chọn Loại báo cáo (Doanh số, Công nợ).
    *   Chọn Thời gian (Tháng, Năm).
    *   Nút "Tạo báo cáo", "Xuất Excel".
*   **Màn hình Báo cáo Doanh số:**
    *   Hiển thị bảng dữ liệu và biểu đồ doanh số.
*   **Màn hình Báo cáo Công nợ:**
    *   Hiển thị bảng dữ liệu và biểu đồ công nợ.
*   **Chức năng:** Lấy dữ liệu báo cáo theo bộ lọc, hiển thị dưới dạng bảng và biểu đồ, hỗ trợ xuất Excel.
*   **Tham khảo:** Mục 1.2.2 BM6.1, BM6.2; 2.1.2 UC08; 4.5.6; Hình 5.11, 5.12.

### 8. Quản lý Quy định (Rule Management - Admin Only)

*   **Màn hình:**
    *   Bảng hiển thị các quy định hiện tại (Số loại đại lý, Hạn mức nợ,...).
    *   Nút Sửa cho mỗi quy định.
*   **Màn hình Form Sửa Quy định:**
    *   Cho phép admin thay đổi giá trị của quy định.
*   **Chức năng:** Hiển thị và cho phép admin cập nhật các quy định hệ thống.
*   **Tham khảo:** Mục 1.2.1.1 Yêu cầu 7; QĐ7; 4.5.7; Hình 5.13.

### 9. Quản lý Tài khoản (User Account Management - Admin Only)

*   **Màn hình:**
    *   Bảng hiển thị danh sách người dùng (Tên đăng nhập, Vai trò,...).
    *   Nút "Thêm tài khoản".
*   **Màn hình Form (Thêm/Sửa):**
    *   Các trường thông tin tài khoản người dùng.
    *   Cơ chế phân quyền.
*   **Chức năng:** CRUD tài khoản người dùng, quản lý vai trò và quyền hạn.
*   **Tham khảo:** Mục 2.1.2 UC01; Hình 2.2 (Biểu đồ use case).

## III. Các Component & Tính năng Frontend Chung

*   **Component Bảng (Table):** Tái sử dụng, có sắp xếp, lọc, phân trang.
*   **Component Form:** Chuẩn hóa, tái sử dụng.
*   **Modals/Dialogs:** Cho xác nhận, form nhanh, hiển thị chi tiết.
*   **Thông báo (Notifications/Snackbars):** Cho các trạng thái thành công/lỗi.
*   **Chỉ báo Tải (Loading Indicators).**
*   **Thiết kế Đáp ứng (Responsive Design):** Đảm bảo giao diện hoạt động tốt trên nhiều kích thước màn hình.
*   **Khả năng Tiếp cận (Accessibility - A11y).**

## IV. Quy trình & Cấu trúc Dự án Frontend

1.  **Thiết lập (Setup):**
    *   Khởi tạo dự án React với TypeScript (sử dụng Vite hoặc Create React App).
    *   Cài đặt các thư viện cần thiết.
2.  **Cấu trúc Thư mục (Ví dụ):**
    *   `src/components/`: Các UI component tái sử dụng.
    *   `src/pages/` (hoặc `src/features/`): Các component cấp cao cho mỗi module/màn hình.
    *   `src/services/` (hoặc `src/api/`): Các hàm gọi API (sử dụng Axios).
    *   `src/store/`: Redux store, slices, selectors.
    *   `src/hooks/`: Các custom React hooks.
    *   `src/utils/`: Các hàm tiện ích.
    *   `src/routes/`: Cấu hình routing.
    *   `src/assets/`: Tài nguyên tĩnh (hình ảnh, icons).
    *   `src/models/` (hoặc `src/types/`): Các interface/type TypeScript.
3.  **Triển khai:**
    *   Bắt đầu với module Xác thực và Bố cục chính.
    *   Phát triển từng module theo thứ tự ưu tiên, tạo các trang, component, Redux slice và service API tương ứng.
4.  **Styling:**
    *   Sử dụng Material-UI theming và prop `sx` hoặc các giải pháp như styled-components/JSS cho các style tùy chỉnh.
5.  **Kiểm thử (Testing):**
    *   Viết unit test cho các component, logic Redux, hàm tiện ích (sử dụng Jest & React Testing Library).

## V. Lưu ý quan trọng

*   **Tương tác API:** Tất cả các thao tác dữ liệu (CRUD) đều cần gọi API đến backend. Phối hợp chặt chẽ với đội backend để thống nhất API endpoints và cấu trúc dữ liệu.
*   **Quản lý Trạng thái:** Sử dụng Redux Toolkit để quản lý trạng thái toàn cục của ứng dụng, đặc biệt là dữ liệu được chia sẻ giữa các component (thông tin người dùng, danh sách đại lý, v.v.).
*   **Tái sử dụng Component:** Xây dựng các component UI chung (bảng, form, modal) để tăng tính nhất quán và giảm thiểu việc lặp code.
*   **Validate Form:** Sử dụng React Hook Form để validate dữ liệu nhập từ người dùng trước khi gửi lên server.

Đây là khung sườn để đội frontend bắt đầu. Cần tham chiếu chi tiết hơn vào tài liệu đặc tả gốc khi triển khai từng phần cụ thể.