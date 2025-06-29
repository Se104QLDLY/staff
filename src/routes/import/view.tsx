import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Package, Calendar, User, FileText, Edit, ArrowLeft, Printer, Trash2 } from 'lucide-react';

interface ImportProduct {
  id: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ImportRecord {
  id: string;
  agency: string;
  agencyCode: string;
  importDate: string;
  totalAmount: number;
  creator: string;
  createdDate: string;
  updatedDate: string;
  note?: string;
  products: ImportProduct[];
  status: 'Hoàn thành' | 'Đang xử lý' | 'Hủy';
}

const ViewImportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - trong thực tế sẽ fetch từ API
  const importRecord: ImportRecord = {
    id: id || 'PN001',
    agency: 'Đại lý Minh Anh',
    agencyCode: 'DL001',
    importDate: '2024-01-15',
    totalAmount: 15000000,
    creator: 'Nguyễn Văn A',
    createdDate: '2024-01-15',
    updatedDate: '2024-01-15',
    note: 'Nhập hàng theo đơn đặt hàng tháng 1/2024',
    status: 'Hoàn thành',
    products: [
      {
        id: '1',
        productName: 'Sản phẩm A',
        unit: 'Thùng',
        quantity: 100,
        unitPrice: 120000,
        totalPrice: 12000000
      },
      {
        id: '2',
        productName: 'Sản phẩm B',
        unit: 'Hộp',
        quantity: 150,
        unitPrice: 20000,
        totalPrice: 3000000
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700';
      case 'Đang xử lý': return 'bg-amber-100 text-amber-700';
      case 'Hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Tính tổng số lượng
  const totalQuantity = importRecord.products.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <DashboardLayout>
      <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-zinc-800">Chi tiết Phiếu Nhập</h1>
                <p className="text-zinc-500 text-base mt-1">Thông tin chi tiết phiếu nhập mã <span className="font-semibold text-zinc-600">#{id}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link 
                to={`/import/edit/${importRecord.id}`}
                className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold gap-2 text-sm shadow-sm hover:shadow-md shadow-blue-500/20"
              >
                <Edit size={16} /><span>Chỉnh sửa</span>
              </Link>
              <Link 
                to="/import" 
                className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-200 font-semibold gap-2 text-sm"
              >
                <ArrowLeft size={16} /><span>Quay lại</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 p-6 mb-8">
            <h2 className="text-xl font-bold text-zinc-800 mb-6">Thông tin chung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Mã phiếu nhập</p>
                  <p className="text-lg font-semibold text-zinc-800">{importRecord.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Ngày lập phiếu</p>
                  <p className="text-lg font-semibold text-zinc-800">{new Date(importRecord.importDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Người tạo</p>
                  <p className="text-lg font-semibold text-zinc-800">{importRecord.creator}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">ST</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Trạng thái</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(importRecord.status)}`}>
                    {importRecord.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 overflow-hidden mb-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-800">Danh sách sản phẩm</h2>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Tổng: {totalQuantity.toLocaleString('vi-VN')} sản phẩm</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-blue-900/80 bg-blue-100/60">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-center w-16">STT</th>
                    <th className="px-6 py-4 font-semibold min-w-[200px]">Mặt hàng</th>
                    <th className="px-6 py-4 font-semibold min-w-[120px]">Đơn vị tính</th>
                    <th className="px-6 py-4 font-semibold text-center w-28">Số lượng</th>
                    <th className="px-6 py-4 font-semibold w-40">Đơn giá</th>
                    <th className="px-6 py-4 font-semibold text-right w-48">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {importRecord.products.map((product, idx) => (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 text-center font-medium text-zinc-500">{idx + 1}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-800">{product.productName}</td>
                      <td className="px-6 py-4 text-zinc-600">{product.unit}</td>
                      <td className="px-6 py-4 text-center text-zinc-700">{product.quantity.toLocaleString('vi-VN')}</td>
                      <td className="px-6 py-4 text-zinc-700">{product.unitPrice.toLocaleString('vi-VN')} VND</td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-600">{product.totalPrice.toLocaleString('vi-VN')} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Summary Card */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-xl p-6 shadow-lg shadow-blue-500/20">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-sky-100">Tổng cộng</h3>
                  <span className="text-sky-200 font-medium">{importRecord.products.length} sản phẩm</span>
                </div>
                <p className="text-4xl font-bold tracking-tight">
                  {importRecord.totalAmount.toLocaleString('vi-VN')} <span className="text-2xl font-semibold text-sky-200">VND</span>
                </p>
                {importRecord.note && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-sky-100 text-sm">{importRecord.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewImportPage; 