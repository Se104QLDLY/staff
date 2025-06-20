import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiUser, HiLocationMarker, HiPhone, HiMail, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const mockData = [
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
];

const PaymentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const payment = mockData.find((item) => item.id === id);

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto mt-16 text-center text-red-600 text-xl font-bold">Không tìm thấy phiếu thu!</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl shadow-2xl p-12 border-4 border-blue-200 max-w-xl mx-auto mt-12">
        <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 drop-shadow flex items-center gap-3 justify-center uppercase tracking-wide">
          <HiCurrencyDollar className="text-blue-500 text-4xl" />
          Chi tiết phiếu thu
        </h1>
        <div className="space-y-6 text-lg">
          <div className="flex items-center gap-3">
            <HiUser className="text-blue-400 text-2xl" />
            <span className="font-bold text-blue-800 w-32 inline-block">Đại lý:</span>
            <span>{payment.agency}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiLocationMarker className="text-blue-400 text-2xl" />
            <span className="font-bold text-blue-800 w-32 inline-block">Địa chỉ:</span>
            <span>{payment.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiPhone className="text-blue-400 text-2xl" />
            <span className="font-bold text-blue-800 w-32 inline-block">Điện thoại:</span>
            <span>{payment.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiMail className="text-blue-400 text-2xl" />
            <span className="font-bold text-blue-800 w-32 inline-block">Email:</span>
            <span>{payment.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiCalendar className="text-blue-400 text-2xl" />
            <span className="font-bold text-blue-800 w-32 inline-block">Ngày thu tiền:</span>
            <span>{payment.paymentDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <HiCurrencyDollar className="text-blue-400 text-2xl" />
            <span className="font-bold text-blue-800 w-32 inline-block">Số tiền thu:</span>
            <span className="font-bold text-green-600">{payment.amount.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <button
            onClick={() => navigate('/payment')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-bold text-lg shadow"
          >
            Quay lại
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailPage; 