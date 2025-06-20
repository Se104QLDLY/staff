import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface PaymentRecord {
  id: string;
  agency: string;
  address: string;
  phone: string;
  email: string;
  paymentDate: string;
  amount: number;
}

const PaymentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PaymentRecord | null>(null);

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([
    {
      id: 'PT001',
      agency: 'Đại lý Hà Nội',
      address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      phone: '0901234567',
      email: 'hanoi@example.com',
      paymentDate: '2024-01-15',
      amount: 5000000,
    },
    {
      id: 'PT002',
      agency: 'Đại lý Hồ Chí Minh',
      address: '456 Lê Lợi, Q.1, TP.HCM',
      phone: '0902345678',
      email: 'hcm@example.com',
      paymentDate: '2024-01-14',
      amount: 3500000,
    },
  ]);

  const filteredRecords = paymentRecords.filter(record =>
    record.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.phone.includes(searchTerm) ||
    record.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (record: PaymentRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setPaymentRecords(paymentRecords.filter(r => r.id !== recordToDelete.id));
        setShowDeleteModal(false);
        setRecordToDelete(null);
        alert(`Đã xóa phiếu thu ${recordToDelete.id} thành công!`);
      } catch (error) {
        console.error('Error deleting payment record:', error);
        alert('Có lỗi xảy ra khi xóa phiếu thu!');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">
          QUẢN LÝ THANH TOÁN
        </h1>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm phiếu thu..."
            className="flex-1 px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow-sm min-w-[220px] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/payment/add"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-md whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm phiếu thu
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
          <table className="min-w-full bg-white border border-blue-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left">Đại lý</th>
                <th className="py-3 px-4 text-left">Địa chỉ</th>
                <th className="py-3 px-4 text-left">Điện thoại</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Ngày thu tiền</th>
                <th className="py-3 px-4 text-left">Số tiền thu</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-blue-700">{record.agency}</td>
                  <td className="px-4 py-3 text-gray-800">{record.address}</td>
                  <td className="px-4 py-3 text-gray-800">{record.phone}</td>
                  <td className="px-4 py-3 text-gray-800">{record.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{record.paymentDate}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{record.amount.toLocaleString('vi-VN')} VND</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/payment/detail/${record.id}`}
                        className="p-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(record)}
                        className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-colors"
                        title="Xóa phiếu thu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không tìm thấy phiếu thu nào.</p>
          </div>
        )}
      </div>
      {showDeleteModal && recordToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa phiếu thu</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa phiếu thu <strong>{recordToDelete.id}</strong>?
                <br />
                <span className="text-sm text-red-600">Hành động này không thể hoàn tác.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Xóa phiếu thu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentPage;