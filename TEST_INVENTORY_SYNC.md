# 🧪 Test Guide: Inventory Sync Fix

## Đã hoàn thành những gì?

✅ **Tạo InventoryContext** - Global state management cho inventory
✅ **Auto-refresh sau giao dịch** - Tự động cập nhật tồn kho
✅ **Manual refresh button** - Nút làm mới trong modal
✅ **Debug utility** - Tool để kiểm tra đồng bộ
✅ **Fix all pages** - Import, Export, Add pages

## Cách test chi tiết

### 🚀 Bước 1: Khởi động servers
```bash
# Terminal 1: Backend
cd BE-AM/agency_management
python manage.py runserver

# Terminal 2: Admin Frontend (Login)
cd FE-AM/Admin
npm run dev

# Terminal 3: Staff Frontend
cd FE-AM/staff
npm run dev
```

### 🔐 Bước 2: Login
1. Mở `http://localhost:5173/login`
2. Login với tài khoản staff
3. Sẽ auto-redirect về `http://localhost:5176/`

### 📊 Bước 3: Test Inventory Sync

#### Test Case 1: Xem tồn kho ban đầu
1. Vào `/import` → Click "Xem tồn kho"
2. Ghi nhận số lượng của 1-2 sản phẩm
3. Chụp screenshot hoặc ghi lại số

#### Test Case 2: Tạo phiếu nhập
1. Vào `/import/add`
2. Chọn ngày, chọn sản phẩm, nhập số lượng (VD: +10)
3. Submit → Có thấy alert "Tạo phiếu nhập thành công!"
4. Quay lại `/import` → Click "Xem tồn kho"
5. **Kiểm tra**: Số lượng đã tăng +10 chưa?

#### Test Case 3: Tạo phiếu xuất
1. Vào `/export/add`
2. Chọn agency, chọn sản phẩm, nhập số lượng (VD: -5)
3. Submit → Có thấy alert "Tạo phiếu xuất thành công!"
4. Quay lại `/import` → Click "Xem tồn kho"
5. **Kiểm tra**: Số lượng đã giảm -5 chưa?

#### Test Case 4: Xác nhận phiếu xuất
1. Vào `/export` → Tab "Yêu cầu xuất hàng"
2. Click "Xác nhận" cho 1 phiếu
3. Quay lại `/import` → Click "Xem tồn kho"
4. **Kiểm tra**: Tồn kho có cập nhật không?

#### Test Case 5: Manual refresh
1. Vào `/import` → Click "Xem tồn kho"
2. Click nút "Làm mới" trong modal
3. **Kiểm tra**: Data có reload không?

### 🐛 Bước 4: Debug nếu có lỗi

#### Debug Console
1. Mở DevTools (F12) → Console
2. Chạy: `window.debugInventorySync()`
3. Xem có warning/error không

#### Debug Network
1. DevTools → Network tab
2. Làm 1 giao dịch → Xem có các API calls:
   - `POST /api/v1/inventory/receipts/`
   - `POST /api/v1/inventory/issues/`
   - `GET /api/v1/inventory/items/`

#### Debug Backend
```bash
cd BE-AM/agency_management
python test_stock_immediate_reduction.py
```

### 📝 Kết quả mong đợi

#### ✅ PASS nếu:
- Tồn kho cập nhật ngay lập tức sau mỗi giao dịch
- Không cần refresh trang để thấy số mới
- `window.debugInventorySync()` hiển thị tất cả ✅
- Modal "Xem tồn kho" hiển thị đúng

#### ❌ FAIL nếu:
- Tồn kho không thay đổi sau giao dịch
- Phải refresh trang mới thấy số mới
- `window.debugInventorySync()` có ⚠️ warnings
- Console có lỗi inventory sync

### 🔧 Troubleshooting

#### Lỗi: "Cannot find name 'refreshInventory'"
```bash
# Kiểm tra file đã import useInventory chưa
grep -r "useInventory" src/routes/
```

#### Lỗi: Context not found
```bash
# Kiểm tra App.tsx có InventoryProvider chưa
cat src/App.tsx | grep "InventoryProvider"
```

#### Lỗi: API calls không thành công
```bash
# Kiểm tra backend có chạy không
curl http://localhost:8000/api/v1/inventory/items/
```

### 📊 Test Results Template

```
## Test Results - [Date]

### Test Case 1: Nhập hàng
- Sản phẩm: [Tên sản phẩm]
- Số lượng trước: [X]
- Số lượng nhập: [+Y]
- Số lượng sau: [X+Y]
- Kết quả: ✅ PASS / ❌ FAIL

### Test Case 2: Xuất hàng
- Sản phẩm: [Tên sản phẩm]
- Số lượng trước: [X]
- Số lượng xuất: [-Y]
- Số lượng sau: [X-Y]
- Kết quả: ✅ PASS / ❌ FAIL

### Debug Console
- `window.debugInventorySync()`: ✅ No warnings / ❌ Has warnings
- Console errors: ✅ None / ❌ [Error details]

### Overall: ✅ PASS / ❌ FAIL
```

## 🎯 Acceptance Criteria

Test được coi là PASS khi:
1. ✅ Tồn kho cập nhật realtime (không cần refresh)
2. ✅ Tất cả giao dịch đều trigger refresh
3. ✅ Manual refresh button hoạt động
4. ✅ Debug utility không có warnings
5. ✅ UI/UX smooth, không có lỗi

Nếu bất kỳ criteria nào FAIL, cần debug và fix trước khi deploy production.
