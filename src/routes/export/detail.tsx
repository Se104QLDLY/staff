import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useTabNavigation } from '../../hooks/useTabNavigation';

interface ProductItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

type ExportTab = 'info' | 'products' | 'finance' | 'delivery' | 'history';

const ExportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeTab, changeTab, isActive } = useTabNavigation<ExportTab>('info');
  
  // Mock data cho phiếu xuất
  const exportData = {
    code: id || 'PX001',
    status: 'Đã xuất kho',
    createdDate: '2024-01-15',
    creator: 'Nguyễn Văn A',
    updatedDate: '2024-01-15',
    agency: {
      name: 'Đại lý A',
      code: 'DL001',
      address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      phone: '0901234567',
      email: 'daily_a@example.com'
    },
    products: [
      {
        id: 'SP001',
        name: 'Laptop Dell XPS 13',
        unit: 'Chiếc',
        quantity: 5,
        price: 30000000,
        total: 150000000
      },
      {
        id: 'SP002',
        name: 'Màn hình Dell 27"',
        unit: 'Chiếc',
        quantity: 10,
        price: 6000000,
        total: 60000000
      },
      {
        id: 'SP003',
        name: 'Bàn phím Logitech',
        unit: 'Chiếc',
        quantity: 15,
        price: 2000000,
        total: 30000000
      }
    ],
    finance: {
      subtotal: 240000000,
      vat: 24000000,
      discount: 5000000,
      total: 259000000,
      paymentMethod: 'Chuyển khoản ngân hàng',
      paymentStatus: 'Đã thanh toán'
    },
    delivery: {
      deliveryPerson: 'Trần Văn B',
      deliveryDate: '2024-01-17',
      deliveryMethod: 'Xe tải công ty',
      notes: 'Giao hàng trong giờ hành chính'
    },
    history: [
      {
        action: 'Tạo phiếu xuất',
        time: '2024-01-15 08:30',
        user: 'Nguyễn Văn A'
      },
      {
        action: 'Phê duyệt phiếu xuất',
        time: '2024-01-15 10:45',
        user: 'Lê Thị C'
      },
      {
        action: 'Chuẩn bị hàng tại kho',
        time: '2024-01-16 14:20',
        user: 'Phạm Văn D'
      },
      {
        action: 'Xuất kho',
        time: '2024-01-17 09:15',
        user: 'Trần Văn B'
      }
    ],
    attachments: [
      { name: 'Biên bản giao hàng.pdf', url: '#' },
      { name: 'Hình ảnh giao hàng.jpg', url: '#' }
    ],
    notes: 'Khách hàng yêu cầu giao gấp, ưu tiên xử lý đơn hàng này.'
  };

  // Tính tổng số lượng và tổng tiền
  const totalQuantity = exportData.products.reduce((sum, product) => sum + product.quantity, 0);
  
  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">Chi tiết phiếu xuất</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Mã phiếu xuất</label>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{exportData.code}</div>
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Đại lý</label>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-800">{exportData.agency.name}</div>
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Ngày lập phiếu</label>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-800">{new Date(exportData.createdDate).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white mb-8">
          <table className="min-w-full bg-white border border-blue-200 rounded-2xl">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left">STT</th>
                <th className="py-3 px-4 text-left">Mặt hàng</th>
                <th className="py-3 px-4 text-left">Đơn vị tính</th>
                <th className="py-3 px-4 text-left">Số lượng</th>
                <th className="py-3 px-4 text-left">Đơn giá</th>
                <th className="py-3 px-4 text-left">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {exportData.products.map((product, idx) => (
                <tr key={product.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3 text-blue-700 text-center font-semibold">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-700">{product.unit}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{product.quantity.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{product.price.toLocaleString('vi-VN')} VND</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">{product.total.toLocaleString('vi-VN')} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-lg px-8 py-6 min-w-[320px] w-full max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Tổng tiền</span>
              <span className="text-2xl font-bold text-blue-700">{exportData.products.reduce((sum, p) => sum + p.total, 0).toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExportDetailPage; 