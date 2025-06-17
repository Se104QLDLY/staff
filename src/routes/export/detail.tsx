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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chi tiết phiếu xuất: {exportData.code}</h1>
            <p className="text-gray-500">Ngày tạo: {new Date(exportData.createdDate).toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              In phiếu xuất
            </button>
            <Link to="/export" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Quay lại
            </Link>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mb-6 flex items-center">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {exportData.status}
          </span>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => changeTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('info')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Thông tin chung
            </button>
            <button
              onClick={() => changeTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('products')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sản phẩm
            </button>
            <button
              onClick={() => changeTab('finance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('finance')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tài chính
            </button>
            <button
              onClick={() => changeTab('delivery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('delivery')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vận chuyển
            </button>
            <button
              onClick={() => changeTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('history')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lịch sử
            </button>
          </nav>
        </div>
        
        {/* Tab Contents */}
        <div>
          {/* Thông tin chung */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Thông tin phiếu xuất</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Mã phiếu xuất:</span>
                    <span className="font-medium">{exportData.code}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Người tạo:</span>
                    <span>{exportData.creator}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Ngày tạo:</span>
                    <span>{new Date(exportData.createdDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Cập nhật lần cuối:</span>
                    <span>{new Date(exportData.updatedDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className="font-medium text-green-600">{exportData.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Thông tin đại lý</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Đại lý:</span>
                    <span className="font-medium">{exportData.agency.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Mã đại lý:</span>
                    <span>{exportData.agency.code}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Địa chỉ:</span>
                    <span>{exportData.agency.address}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Điện thoại:</span>
                    <span>{exportData.agency.phone}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Email:</span>
                    <span>{exportData.agency.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 lg:col-span-2">
                <h2 className="text-lg font-medium mb-4">Ghi chú</h2>
                <p className="text-gray-700">{exportData.notes}</p>
              </div>
              
              <div className="border rounded-lg p-6 lg:col-span-2">
                <h2 className="text-lg font-medium mb-4">Tài liệu đính kèm</h2>
                <div className="space-y-2">
                  {exportData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center p-2 border rounded hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <a href={file.url} className="text-blue-600 hover:underline">
                        {file.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Sản phẩm */}
          {activeTab === 'products' && (
            <div>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã sản phẩm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên sản phẩm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn vị
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn giá
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exportData.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.price.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.total.toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Tổng cộng:
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {totalQuantity}
                      </td>
                      <td></td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {exportData.finance.subtotal.toLocaleString('vi-VN')} ₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          
          {/* Tài chính */}
          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Chi tiết thanh toán</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Tổng tiền hàng:</span>
                    <span>{exportData.finance.subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Thuế VAT (10%):</span>
                    <span>{exportData.finance.vat.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Chiết khấu:</span>
                    <span>-{exportData.finance.discount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="grid grid-cols-2 pt-2 border-t">
                    <span className="text-gray-900 font-medium">Tổng thanh toán:</span>
                    <span className="text-gray-900 font-medium">{exportData.finance.total.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Thông tin thanh toán</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Phương thức thanh toán:</span>
                    <span>{exportData.finance.paymentMethod}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Trạng thái thanh toán:</span>
                    <span className={exportData.finance.paymentStatus === 'Đã thanh toán' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                      {exportData.finance.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Vận chuyển */}
          {activeTab === 'delivery' && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Thông tin vận chuyển</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Người giao hàng:</span>
                    <span>{exportData.delivery.deliveryPerson}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Ngày xuất kho:</span>
                    <span>{new Date(exportData.delivery.deliveryDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Phương thức vận chuyển:</span>
                    <span>{exportData.delivery.deliveryMethod}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Ghi chú vận chuyển:</span>
                  <p className="mt-2 text-gray-700">{exportData.delivery.notes}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Lịch sử */}
          {activeTab === 'history' && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Lịch sử thao tác</h2>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200"></div>
                <ul className="space-y-6">
                  {exportData.history.map((item, index) => (
                    <li key={index} className="relative pl-10">
                      <div className="absolute left-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{item.action}</h3>
                        <p className="text-gray-500">{item.time} - {item.user}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExportDetailPage; 