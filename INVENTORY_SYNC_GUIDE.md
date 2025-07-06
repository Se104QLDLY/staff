# 🔍 Hướng dẫn Kiểm tra & Debug Tồn kho Frontend

## Vấn đề đã giải quyết

**VẤN ĐỀ CŨ**: Frontend hiển thị tồn kho không đúng sau khi xuất hàng do không tự động refresh dữ liệu từ backend.

**NGUYÊN NHÂN**: 
- Các trang import/export không có cơ chế đồng bộ tồn kho
- Dữ liệu cached cũ không được refresh khi có thay đổi
- Không có global state management cho inventory

## Giải pháp đã triển khai

### 1. InventoryContext (Global State)
```typescript
// src/context/InventoryContext.tsx
- Tạo global context để quản lý inventory version
- Trigger refresh khi có thay đổi tồn kho
- Auto-refresh tất cả components đang sử dụng inventory
```

### 2. Auto-refresh sau mỗi giao dịch
```typescript
// Các điểm trigger refresh:
- Tạo phiếu xuất (export/add.tsx)
- Xác nhận xuất hàng (export/index.tsx)
- Tạo phiếu nhập (import/add.tsx)
- Xóa phiếu xuất/nhập (import/index.tsx, export/index.tsx)
```

### 3. Manual refresh button
```typescript
// import/index.tsx - Modal inventory có nút "Làm mới"
- Cho phép user manually refresh dữ liệu
- Gọi cả refreshInventory() và fetchImportData()
```

### 4. Debug utility
```typescript
// src/utils/debugInventory.ts
- Kiểm tra tính đồng bộ giữa DB và frontend
- So sánh stock_quantity vs calculated stock
- Log chi tiết các giao dịch
```

## Cách kiểm tra

### Test Flow 1: Xuất hàng
1. Mở trang Import → Click "Xem tồn kho" → Ghi nhận số lượng
2. Mở trang Export → Tạo phiếu xuất với sản phẩm từ bước 1
3. Quay lại trang Import → Click "Xem tồn kho" → Kiểm tra số lượng đã giảm
4. **Kết quả mong đợi**: Tồn kho giảm ngay lập tức

### Test Flow 2: Nhập hàng
1. Mở trang Import → Click "Xem tồn kho" → Ghi nhận số lượng
2. Tạo phiếu nhập với sản phẩm từ bước 1
3. Quay lại trang Import → Click "Xem tồn kho" → Kiểm tra số lượng đã tăng
4. **Kết quả mong đợi**: Tồn kho tăng ngay lập tức

### Test Flow 3: Debug Console
1. Mở Developer Tools → Console
2. Chạy: `window.debugInventorySync()`
3. Kiểm tra log có warning/error không
4. **Kết quả mong đợi**: Tất cả items hiển thị ✅ (stock is correct)

## Debugging khi có vấn đề

### 1. Kiểm tra Network requests
```javascript
// Mở DevTools → Network tab
// Sau mỗi giao dịch, kiểm tra có gọi API không:
- POST /api/v1/inventory/issues/ (tạo phiếu xuất)
- POST /api/v1/inventory/receipts/ (tạo phiếu nhập)
- GET /api/v1/inventory/items/ (refresh tồn kho)
```

### 2. Kiểm tra Context state
```javascript
// Trong React DevTools
// Tìm InventoryProvider → Props → inventoryVersion
// Số này phải tăng sau mỗi giao dịch
```

### 3. Kiểm tra backend
```bash
# Chạy test backend
cd BE-AM/agency_management
python test_stock_immediate_reduction.py

# Kiểm tra database trực tiếp
python manage.py shell
>>> from inventory.models import Item
>>> Item.objects.all().values('item_name', 'stock_quantity')
```

### 4. Force refresh
```javascript
// Nếu vẫn không sync, thử force refresh
window.location.reload();
```

## Các lỗi thường gặp

### 1. "Cannot find name 'refreshInventory'"
- **Nguyên nhân**: Component chưa import useInventory
- **Giải pháp**: Thêm `import { useInventory } from '../context/InventoryContext'`

### 2. Tồn kho không cập nhật
- **Nguyên nhân**: Thiếu `refreshInventory()` sau giao dịch
- **Giải pháp**: Thêm `refreshInventory()` trong success callback

### 3. Context not found
- **Nguyên nhân**: Component không nằm trong InventoryProvider
- **Giải pháp**: Kiểm tra App.tsx có bao InventoryProvider không

### 4. Backend trả về lỗi
- **Nguyên nhân**: Validation error, insufficient stock, etc.
- **Giải pháp**: Kiểm tra API response, fix data nếu cần

## Monitoring

### 1. Production logs
```javascript
// Thêm vào production để monitor
console.log('🔄 Inventory refreshed at:', new Date().toISOString());
```

### 2. Error tracking
```javascript
// Catch inventory sync errors
try {
  refreshInventory();
} catch (error) {
  console.error('❌ Inventory refresh failed:', error);
  // Send to error tracking service
}
```

## Kết luận

Với các thay đổi trên, frontend sẽ:
- ✅ Tự động refresh tồn kho sau mỗi giao dịch
- ✅ Hiển thị số lượng chính xác realtime
- ✅ Có cơ chế debug và troubleshoot
- ✅ Có manual refresh khi cần

**Lưu ý**: Nếu vẫn gặp vấn đề, chạy `window.debugInventorySync()` để kiểm tra chi tiết.
