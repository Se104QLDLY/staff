# Cấu trúc Backend

**Created**: May 15, 2025 8:51 AM

## Cấu trúc dự án

```
agency_management/
├── apps/                           # Tập hợp toàn bộ các app chức năng
│   ├── accounts/                   # Tài khoản & phân quyền
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── utils.py                # Xử lý xác minh email
│   │
│   ├── agencies/                   # Quản lý đại lý, loại, quận/huyện
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── inventory/                  # Quản lý nhập/xuất kho & hàng hóa
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── finance/                    # Báo cáo công nợ, phiếu thu
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── regulations/                # Các quy định hệ thống
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   └── dashboard/                  # API tổng quan (doanh số, công nợ, số lượng đại lý)
│       ├── views.py
│       └── urls.py
│
├── config/                         # Cấu hình chính dự án
│   ├── init.py
│   ├── settings.py                 # Cấu hình chung (JWT, Swagger, DB, Email...)
│   ├── urls.py                     # Include toàn bộ route apps
│   ├── wsgi.py
│   └── asgi.py
│
├── manage.py                       # Entry point Django
├── requirements.txt                # Danh sách thư viện
├── .env                            # Biến môi trường (DB, SECRET_KEY...)
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
└── .github/
    └── workflows/
        └── django-ci.yml           # GitHub Actions CI/CD
```

## 📦 Các App Chính & Chức Năng

### 1. `accounts` – Quản lý tài khoản, phân quyền

* **Models**: 
  * `User`
  * `AccountRole`

* **Features**:
  * Đăng nhập / Đăng xuất
  * Phân quyền: Admin / Staff
  * CRUD tài khoản

* **APIs**: 
  * `/api/accounts/`
  * `/api/auth/`

### 2. `agencies` – Đại lý, loại đại lý, quận

* **Models**:
  * `Agency`
  * `AgencyType`
  * `District`

* **Tính năng**:
  * CRUD đại lý
  * Phân loại theo quận, loại đại lý
  * Tìm kiếm nâng cao

* **APIs**:
  * `GET /api/agencies/`
  * `POST /api/agencies/`
  * `GET /api/agency-types/`
  * `GET /api/districts/`

### 3. `inventory` – Quản lý kho, phiếu nhập/xuất

* **Models**:
  * `Item`, `Unit`
  * `Receipt`, `ReceiptDetail`
  * `Issue`, `IssueDetail`

* **Tính năng**:
  * Lập phiếu nhập/xuất
  * Tự tính thành tiền
  * Kiểm tra tồn kho & công nợ khi xuất hàng

* **APIs**:
  * `POST /api/receipts/`
  * `POST /api/issues/`

### 4. `finance` – Phiếu thu, báo cáo

* **Models**:
  * `Payment`, `Report`

* **Tính năng**:
  * Lập phiếu thu (hạn chế không thu vượt nợ)
  * Tính nợ đầu kỳ, phát sinh, nợ cuối
  * Báo cáo doanh số / công nợ theo tháng

* **APIs**:
  * `GET /api/reports/debt/`
  * `GET /api/reports/sales/`

### 5. `regulations` – Quy định hệ thống

* **Models**: 
  * `Regulation`

* **Tính năng**:
  * Thay đổi số lượng loại đại lý, đơn vị tính, tỉ lệ xuất, v.v.

* **APIs**:
  * `GET /api/regulations/`
  * `PUT /api/regulations/<key>/`

### 6. `dashboard` – Thống kê tổng quan

* **Tính năng**:
  * Tổng doanh số, công nợ, số lượng đại lý
  * Biểu đồ top 5 đại lý có doanh số / nợ cao nhất

* **APIs**:
  * `GET /api/dashboard/`

## 🔗 Mối Quan Hệ Cơ Bản (ERD rút gọn)

```
User
└──< created_by

Agency <── Receipt ──< ReceiptDetail
       <── Issue   ──< IssueDetail
       <── Payment

Item ──< ReceiptDetail, IssueDetail

Regulation = cấu hình hệ thống
Report = báo cáo tự động (JSONB)
```

## 🛠️ Tính Năng Hỗ Trợ

✅ **API RESTful**: JSON communication cho frontend React  
✅ **Token-based Auth (JWT)**: Sử dụng djangorestframework-simplejwt  
✅ **Tự động export Excel**: với pandas, openpyxl  
✅ **Tìm kiếm nâng cao**: Django Filter, SearchFilter  
✅ **Xử lý async** (tùy chọn): Celery + Redis cho báo cáo nặng  
✅ **Bảo mật**: Phân quyền theo từng ViewSet  

## 🔑 Quyền Truy Cập Gợi Ý

| Chức năng | Admin | Nhân viên |
|-----------|-------|-----------|
| Đăng nhập | ✅ | ✅ |
| Quản lý tài khoản | ✅ | ❌ |
| Quản lý đại lý | ✅ | ✅ (xem) |
| Lập phiếu nhập/xuất | ✅ | ✅ |
| Lập phiếu thu tiền | ✅ | ✅ |
| Thay đổi quy định | ✅ | ❌ |
| Tạo/xem báo cáo | ✅ | ✅ |
| Dashboard | ✅ | ✅ |

## 💡 Gợi Ý Tách Model, Serializer, ViewSet

### Ví dụ agencies/models.py:

```python
# agencies/models.py
class Agency(models.Model):
    name = models.CharField(max_length=150)
    type = models.ForeignKey('AgencyType', on_delete=models.CASCADE)
    district = models.ForeignKey('District', on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    debt = models.DecimalField(max_digits=15, decimal_places=2, default=0)
```

### agencies/serializers.py:

```python
# agencies/serializers.py
class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = '__all__'
```

### agencies/views.py:

```python
# agencies/views.py
class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer
    permission_classes = [IsAuthenticated]