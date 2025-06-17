# Cấu Trúc Thư Mục - Dự Án Quản Lý Đại Lý (Phần Admin)

## Cấu trúc tổng quan
```
admin/                      # Thư mục gốc cho phần Admin
├── src/                   # Mã nguồn chính
├── public/                # Tài nguyên tĩnh
├── node_modules/          # Dependencies
└── [Các file cấu hình]    # Các file cấu hình của project
```

## Chi tiết cấu trúc thư mục src
```
src/
├── api/                    # Xử lý các cuộc gọi API
│   ├── rules.ts           # API cho quản lý quy định
│   └── users.ts           # API cho quản lý người dùng
│
├── components/            # Components dùng chung
│   ├── common/           # Components UI cơ bản
│   │   ├── Table/       # Component bảng dữ liệu
│   │   ├── Form/        # Components form
│   │   └── Modal/       # Components modal/dialog
│   └── layout/          # Components layout
│       ├── Sidebar/     # Thanh điều hướng
│       └── Header/      # Header của ứng dụng
│
├── pages/                # Các trang chính
│   ├── rules/           # Quản lý quy định
│   │   ├── RulesList.tsx    # Danh sách quy định
│   │   └── RuleEdit.tsx     # Chỉnh sửa quy định
│   └── users/           # Quản lý người dùng
│       ├── UsersList.tsx    # Danh sách người dùng
│       └── UserForm.tsx     # Form thêm/sửa người dùng
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts      # Hook xử lý authentication
│   └── usePermissions.ts    # Hook xử lý phân quyền
│
├── routes/             # Cấu hình routing
│   └── ProtectedRoute.tsx    # Component bảo vệ route
│
├── store/              # Quản lý state (Redux)
│   ├── rules/         # State quản lý quy định
│   └── users/         # State quản lý người dùng
│
├── types/             # Định nghĩa kiểu dữ liệu TypeScript
│   ├── rule.types.ts  # Kiểu dữ liệu cho quy định
│   └── user.types.ts  # Kiểu dữ liệu cho người dùng
│
└── utils/             # Các hàm tiện ích
    ├── auth.ts        # Xử lý authentication
    └── validation.ts  # Xử lý validation
```

## Mô tả chức năng các thư mục

### 1. api/
- Chứa các hàm gọi API đến backend
- Sử dụng Axios để thực hiện các request
- Được tổ chức theo từng module chức năng

### 2. components/
- Chứa các components có thể tái sử dụng
- Chia thành 2 loại: common (dùng chung) và layout (bố cục)
- Mỗi component được tổ chức trong một thư mục riêng

### 3. pages/
- Chứa các trang chính của ứng dụng
- Mỗi module được tổ chức trong một thư mục riêng
- Các file được đặt tên theo chức năng

### 4. hooks/
- Chứa các custom React hooks
- Tách biệt logic nghiệp vụ để tái sử dụng

### 5. routes/
- Cấu hình routing cho ứng dụng
- Xử lý bảo vệ các route cần authentication

### 6. store/
- Quản lý state toàn cục bằng Redux
- Tổ chức theo từng module chức năng

### 7. types/
- Định nghĩa các interface và type cho TypeScript
- Giúp code có tính type-safe cao hơn

### 8. utils/
- Chứa các hàm tiện ích dùng chung
- Các hàm xử lý authentication, validation, etc.

## Quy ước đặt tên
- Tên thư mục: Sử dụng chữ thường, phân tách bằng dấu gạch ngang (kebab-case)
- Tên file component: PascalCase (ví dụ: UserList.tsx)
- Tên file không phải component: camelCase (ví dụ: authUtils.ts)
- Tên interface/type: PascalCase với tiền tố I cho interface (ví dụ: IUser)

## Lưu ý quan trọng
- Mỗi component nên được đặt trong một thư mục riêng cùng với các file liên quan
- Sử dụng index.ts để export các module
- Tách biệt rõ ràng giữa các module chức năng
- Tuân thủ nguyên tắc DRY (Don't Repeat Yourself) 