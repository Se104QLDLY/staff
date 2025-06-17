import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

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
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Đang xử lý': return 'bg-yellow-100 text-yellow-800';
      case 'Hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
              Chi tiết phiếu nhập
            </h1>
            <p className="text-gray-600">Xem thông tin chi tiết phiếu nhập {importRecord.id}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/import/edit/${importRecord.id}`}
              className="flex items-center px-4 py-2 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-xl transition-colors font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Chỉnh sửa
            </Link>
            <Link
              to="/import"
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Quay lại
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Thông tin phiếu nhập</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-semibold mb-1">Mã phiếu nhập</label>
                  <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{importRecord.id}</p>
                </div>
                <div>
                  <label className="block text-blue-700 font-semibold mb-1">Ngày nhập hàng</label>
                  <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">{new Date(importRecord.importDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="block text-blue-700 font-semibold mb-1">Đại lý</label>
                  <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{importRecord.agency}</p>
                </div>
                <div>
                  <label className="block text-blue-700 font-semibold mb-1">Mã đại lý</label>
                  <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">{importRecord.agencyCode}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-blue-700 font-semibold mb-1">Ghi chú</label>
                  <p className="bg-white px-4 py-3 rounded-lg border text-gray-700 leading-relaxed">{importRecord.note || 'Không có ghi chú'}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
              <h2 className="text-xl font-bold text-green-800 mb-4">Danh sách sản phẩm</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-green-200 rounded-lg">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-green-800 font-semibold">Tên sản phẩm</th>
                      <th className="px-4 py-3 text-left text-green-800 font-semibold">Đơn vị</th>
                      <th className="px-4 py-3 text-right text-green-800 font-semibold">Số lượng</th>
                      <th className="px-4 py-3 text-right text-green-800 font-semibold">Đơn giá</th>
                      <th className="px-4 py-3 text-right text-green-800 font-semibold">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {importRecord.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{product.productName}</td>
                        <td className="px-4 py-3 text-gray-700">{product.unit}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{product.quantity.toLocaleString('vi-VN')}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{product.unitPrice.toLocaleString('vi-VN')} VND</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">{product.totalPrice.toLocaleString('vi-VN')} VND</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right font-bold text-green-800">Tổng cộng:</td>
                      <td className="px-4 py-3 text-right font-bold text-green-600 text-lg">
                        {importRecord.totalAmount.toLocaleString('vi-VN')} VND
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Trạng thái</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Tình trạng:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(importRecord.status)}`}>
                    {importRecord.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Tổng giá trị:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {importRecord.totalAmount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>
            </div>

            {/* Dates Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thời gian</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Ngày nhập hàng</label>
                  <p className="text-blue-600 font-semibold">{new Date(importRecord.importDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Ngày tạo phiếu</label>
                  <p className="text-gray-800">{new Date(importRecord.createdDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Cập nhật lần cuối</label>
                  <p className="text-gray-800">{new Date(importRecord.updatedDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Người tạo</label>
                  <p className="text-gray-800">{importRecord.creator}</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác</h3>
              <div className="space-y-3">
                <Link
                  to={`/import/edit/${importRecord.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Chỉnh sửa
                </Link>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Xóa phiếu nhập
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  In phiếu nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewImportPage; 