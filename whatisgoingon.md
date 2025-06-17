# Tổng quan dự án

## Cấu trúc dự án

Dự án được chia thành hai phần chính:
- `admin`: Giao diện quản trị dành cho quản lý hệ thống
- `client`: Giao diện người dùng cuối (end-user)

### Phần Admin

#### Công nghệ sử dụng
- React 19.1.0
- TypeScript
- Tailwind CSS 4.1.6
- React Router DOM 7.6.0
- React Hook Form 7.56.3 với Yup để validation
- Vite 6.3.5 làm build tool

#### Cấu trúc thư mục chi tiết
```
admin/
├── src/                    # Mã nguồn chính
│   ├── api/                # API calls và service
│   │   ├── endpoints/      # Định nghĩa các endpoints API
│   │   └── axiosClient.ts  # Cấu hình Axios client
│   ├── assets/             # Static assets (hình ảnh, fonts, ...)
│   ├── components/         # React components tái sử dụng
│   │   ├── common/         # Components dùng chung (Button, Input, etc.)
│   │   ├── landing/        # Components cho trang landing
│   │   │   ├── Header/     # Component header
│   │   │   ├── Hero/       # Component hero section
│   │   │   ├── Features/   # Component giới thiệu tính năng
│   │   │   ├── Metrics/    # Component hiển thị số liệu
│   │   │   ├── Team/       # Component giới thiệu đội ngũ
│   │   │   └── Footer/     # Component footer
│   │   └── layout/         # Components layout (Sidebar, Navbar, etc.)
│   ├── hooks/              # React hooks tùy chỉnh
│   ├── pages/              # Components trang
│   ├── routes/             # Cấu hình định tuyến
│   │   ├── auth/           # Chức năng xác thực
│   │   │   ├── Login.tsx   # Trang đăng nhập
│   │   │   └── Register.tsx# Trang đăng ký
│   │   ├── home/           # Trang chủ
│   │   │   └── index.tsx   # Component trang chủ
│   │   └── index.tsx       # Cấu hình routes
│   ├── styles/             # Kiểu dáng global và module
│   ├── App.tsx             # Component gốc, cấu hình Router
│   ├── index.css           # CSS toàn cục
│   └── main.tsx            # Entry point, render app vào DOM
├── public/                 # Static files
├── package.json            # Dependency và scripts
└── vite.config.ts          # Cấu hình Vite
```

#### Chi tiết file quan trọng

1. **routes/index.tsx**
   - **Chức năng**: Định nghĩa tất cả các routes trong ứng dụng
   - **Nội dung chính**: Cấu hình các đường dẫn (paths) và liên kết với components tương ứng
   - **Vai trò**: Central routing, điểm khởi đầu cho navigation của ứng dụng

2. **routes/auth/Login.tsx**
   - **Chức năng**: Hiển thị và xử lý form đăng nhập
   - **Nội dung chính**: Form với các field username/password, validation, xử lý submit
   - **Công nghệ sử dụng**: React Hook Form + Yup validation
   - **UI**: Responsive design, styled với Tailwind CSS, hiệu ứng hover và focus
   - **Liên kết**: Có link đến trang đăng ký và quên mật khẩu

3. **routes/auth/Register.tsx**
   - **Chức năng**: Hiển thị và xử lý form đăng ký người dùng mới
   - **Nội dung chính**: Form với các field: fullName, username, email, phone, password, confirmPassword
   - **Validation**: Kiểm tra email hợp lệ, mật khẩu tối thiểu 6 ký tự, số điện thoại chỉ chứa số, v.v.
   - **UI**: Consistent styling với form đăng nhập

4. **routes/home/index.tsx**
   - **Chức năng**: Hiển thị trang chủ
   - **Nội dung chính**: Tổng hợp nhiều components từ thư mục landing để tạo trang chủ đầy đủ
   - **Structure**: Header, Hero section, Metrics, Features, Team, Footer

5. **components/landing/**
   - **Header**: Thanh điều hướng chính, có logo và menu navigation
   - **Hero**: Banner chính trên trang landing
   - **Features**: Giới thiệu các tính năng chính của sản phẩm
   - **Metrics**: Hiển thị số liệu thống kê
   - **Team**: Giới thiệu đội ngũ phát triển
   - **Footer**: Chân trang với thông tin liên hệ, copyright, etc.

6. **api/axiosClient.ts**
   - **Chức năng**: Cấu hình Axios để gọi API
   - **Nội dung chính**: Setup interceptors, base URL, headers, xử lý errors
   - **Vai trò**: Cung cấp HTTP client được cấu hình sẵn cho toàn bộ ứng dụng

7. **App.tsx**
   - **Chức năng**: Component gốc của ứng dụng
   - **Nội dung chính**: Thiết lập Router và render các routes
   - **Vai trò**: Entry point cho cấu trúc component

### Phần Client

Giao diện người dùng cuối đang trong giai đoạn phát triển với:
- React và TypeScript
- Vite làm build tool
- Cấu trúc thư mục cơ bản tương tự phần Admin

## Vấn đề gặp phải và giải pháp

### Vấn đề CSS
- **Vấn đề**: Xung đột CSS giữa các thiết lập mặc định và component đăng nhập
- **Nguyên nhân**: CSS toàn cục trong `index.css` thiết lập các thuộc tính không tương thích với thiết kế của form đăng nhập, cụ thể:
  - `body { display: flex; place-items: center; min-height: 100vh; }` làm cho form đăng nhập không hiển thị đúng
  - Các thiết lập màu nền tối không phù hợp với giao diện sáng của form
- **Giải pháp**: Sửa đổi CSS toàn cục trong `index.css` để loại bỏ các thuộc tính gây xung đột

### Lưu ý khi phát triển
1. **CSS**: Cẩn thận với các thiết lập CSS toàn cục có thể ảnh hưởng đến các components
   - Sử dụng CSS modules hoặc styled-components để giảm xung đột
   - Kiểm tra kỹ các thuộc tính CSS trong các file toàn cục

2. **Responsive**: Các components hiện tại được thiết kế để đáp ứng (responsive), nhưng cần kiểm tra trên:
   - Thiết bị di động (< 768px)
   - Tablet (768px - 1024px)
   - Desktop (> 1024px)

3. **Authentication**: Hệ thống xác thực chỉ có UI, chưa có logic kết nối với backend
   - Cần implement xử lý đăng nhập/đăng ký thực tế với API
   - Xử lý lưu trữ token và session
   - Bảo vệ các routes cần authentication

## Hướng phát triển tiếp theo

1. **Backend Integration**: 
   - Kết nối các form authentication với backend API
   - Implement các API call cho các chức năng chính
   - Quản lý authentication state (tokens, sessions)

2. **State Management**: 
   - Triển khai quản lý trạng thái (có thể sử dụng Context API hoặc Redux)
   - Tổ chức store/reducer để quản lý dữ liệu ứng dụng

3. **Client Development**: 
   - Phát triển phần giao diện người dùng cuối
   - Đồng bộ thiết kế và UX giữa admin và client

4. **Testing**: 
   - Thêm unit tests cho components (Jest, React Testing Library)
   - Thêm integration tests
   - Thêm E2E tests (Cypress, Playwright)

5. **Documentation**: 
   - Hoàn thiện tài liệu dự án
   - Viết API documentation
   - Tạo hướng dẫn sử dụng cho end-users

## Quy ước code và best practices

1. **Component organization**:
   - Mỗi component nên được đặt trong thư mục riêng với file index.tsx hoặc tên component
   - Nên có file styles riêng cho mỗi component (nếu cần)
   - Sử dụng TypeScript interfaces/types rõ ràng cho props

2. **Form validation**:
   - Sử dụng React Hook Form và Yup một cách nhất quán
   - Validation rules nên được định nghĩa rõ ràng trong schema

3. **CSS classes**:
   - Tuân thủ quy ước của Tailwind CSS
   - Tránh dùng !important
   - Cấu trúc classes từ layout → spacing → sizing → colors → effects 