import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, User, MapPin, Phone, Mail, CalendarDays, BadgeDollarSign, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Chi tiết phiếu thu</h1>
              <p className="text-gray-600 text-base mt-1">Thông tin chi tiết về phiếu thu tiền từ đại lý.</p>
            </div>
          </div>
          <div className="space-y-6 text-lg">
            <div className="flex items-center gap-3">
              <User className="text-blue-500 h-6 w-6" />
              <span className="font-bold text-blue-800 w-32 inline-block">Đại lý:</span>
              <span>{payment.agency}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-cyan-500 h-6 w-6" />
              <span className="font-bold text-blue-800 w-32 inline-block">Địa chỉ:</span>
              <span>{payment.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-green-500 h-6 w-6" />
              <span className="font-bold text-blue-800 w-32 inline-block">Điện thoại:</span>
              <span>{payment.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-purple-500 h-6 w-6" />
              <span className="font-bold text-blue-800 w-32 inline-block">Email:</span>
              <span>{payment.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="text-orange-500 h-6 w-6" />
              <span className="font-bold text-blue-800 w-32 inline-block">Ngày thu tiền:</span>
              <span>{payment.paymentDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <BadgeDollarSign className="text-green-600 h-6 w-6" />
              <span className="font-bold text-blue-800 w-32 inline-block">Số tiền thu:</span>
              <span className="font-bold text-green-600">{payment.amount.toLocaleString('vi-VN')} VND</span>
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <button
              onClick={() => navigate('/payment')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-blue-100 text-gray-700 rounded-2xl hover:bg-blue-200 transition-colors font-bold text-lg shadow"
            >
              <ArrowLeft className="h-5 w-5" /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetailPage; 