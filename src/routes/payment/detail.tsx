import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const PaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data for payment detail
  const paymentDetail = {
    id: id,
    code: id === '1' ? 'PT001' : 'PT002',
    agency: {
      name: id === '1' ? 'Đại lý Hà Nội' : 'Đại lý Hồ Chí Minh',
      code: id === '1' ? 'DL001' : 'DL002',
      address: id === '1' 
        ? '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1' 
        : '456 Trần Hưng Đạo, Phường 6, Quận 5',
      phone: id === '1' ? '028 1234 5678' : '028 8765 4321',
      email: id === '1' ? 'daily_hanoi@example.com' : 'daily_hcm@example.com'
    },
    amount: id === '1' ? '5,000,000 VND' : '3,500,000 VND',
    paymentDate: id === '1' ? '15/01/2024' : '14/01/2024',
    paymentMethod: 'Chuyển khoản ngân hàng',
    bankInfo: 'Ngân hàng Vietcombank - Chi nhánh Hà Nội',
    accountNumber: '1234567890',
    accountHolder: 'Công ty ABC',
    notes: 'Thanh toán đơn hàng tháng 1/2024',
    creator: id === '1' ? 'Nguyễn Văn A' : 'Trần Thị B',
    createdDate: id === '1' ? '15/01/2024 08:30' : '14/01/2024 14:15',
    updatedDate: id === '1' ? '15/01/2024 08:30' : '14/01/2024 14:15',
    previousDebt: id === '1' ? '10,000,000 VND' : '8,000,000 VND',
    remainingDebt: id === '1' ? '5,000,000 VND' : '4,500,000 VND'
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chi tiết phiếu thu: {paymentDetail.code}</h1>
            <p className="text-gray-500">Ngày tạo: {paymentDetail.createdDate}</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              In phiếu thu
            </button>
            <Link to="/payment" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Quay lại
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin phiếu thu</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Mã phiếu thu:</span>
                <span className="font-medium">{paymentDetail.code}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Ngày thu:</span>
                <span>{paymentDetail.paymentDate}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Số tiền:</span>
                <span className="font-medium text-green-600">{paymentDetail.amount}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Người tạo:</span>
                <span>{paymentDetail.creator}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Ngày tạo:</span>
                <span>{paymentDetail.createdDate}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Cập nhật lần cuối:</span>
                <span>{paymentDetail.updatedDate}</span>
              </div>
            </div>
          </div>
          
          {/* Agency Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin đại lý</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Đại lý:</span>
                <span className="font-medium">{paymentDetail.agency.name}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Mã đại lý:</span>
                <span>{paymentDetail.agency.code}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Địa chỉ:</span>
                <span>{paymentDetail.agency.address}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Điện thoại:</span>
                <span>{paymentDetail.agency.phone}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Email:</span>
                <span>{paymentDetail.agency.email}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Phương thức:</span>
                <span>{paymentDetail.paymentMethod}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Ngân hàng:</span>
                <span>{paymentDetail.bankInfo}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Số tài khoản:</span>
                <span>{paymentDetail.accountNumber}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Chủ tài khoản:</span>
                <span>{paymentDetail.accountHolder}</span>
              </div>
            </div>
          </div>
          
          {/* Debt Information */}
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin công nợ</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Nợ trước khi thanh toán:</span>
                <span className="text-red-600">{paymentDetail.previousDebt}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Số tiền thanh toán:</span>
                <span className="text-green-600">{paymentDetail.amount}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">Nợ còn lại:</span>
                <span className="font-medium text-red-600">{paymentDetail.remainingDebt}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="border rounded-lg p-6 lg:col-span-2">
            <h2 className="text-lg font-medium mb-4">Ghi chú</h2>
            <p className="text-gray-700">{paymentDetail.notes}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailPage; 