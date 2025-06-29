import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DollarSign, User, MapPin, Phone, Mail, CalendarDays, BadgeDollarSign, ArrowLeft, Edit, Building2, FileText, Clock, UserCheck } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const PaymentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [agency, setAgency] = useState<any>(null);

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
        const payment = payments.find((p: any) => p.payment_id === Number(id));
        setPayment(payment);
        const agencyData = agencies.find((a: any) => a.agency_id === payment?.agency_id);
        setAgency(agencyData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    loadPaymentData();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <DashboardLayout><div className="p-8 text-center">Đang tải...</div></DashboardLayout>;
  }
  if (!payment || !agency) {
    return <DashboardLayout><div className="p-8 text-center">Không tìm thấy phiếu thu!</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-blue-800">Chi Tiết Phiếu Thu</h1>
                <p className="text-blue-600 text-base mt-1">Thông tin chi tiết phiếu thu #{payment.payment_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate('/payment')}
                className="flex items-center justify-center px-4 py-2.5 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-semibold gap-2 text-sm"
              >
                <ArrowLeft size={16} /><span>Quay lại</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/payment/edit/${payment.payment_id}`)}
                className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 font-semibold gap-2 text-sm shadow-sm hover:shadow-md shadow-blue-500/20"
              >
                <Edit size={16} /><span>Chỉnh sửa</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
                <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Thông tin phiếu thu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Ngày thu tiền</p>
                      <p className="text-lg font-semibold text-blue-800">{formatDate(payment.payment_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <BadgeDollarSign className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Số tiền thu</p>
                      <p className="text-lg font-semibold text-cyan-800">{payment.amount_collected.toLocaleString('vi-VN')} VND</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Người tạo</p>
                      <p className="text-lg font-semibold text-cyan-800">{payment.user_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Thời gian tạo</p>
                      <p className="text-lg font-semibold text-blue-800">{formatDateTime(payment.created_at)}</p>
                    </div>
                  </div>
                </div>
                {payment.note && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium mb-2">Ghi chú</p>
                    <p className="text-blue-800">{payment.note}</p>
                  </div>
                )}
              </div>

              {/* Agency Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
                <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Thông tin đại lý
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Tên đại lý</p>
                      <p className="text-lg font-semibold text-blue-800">{agency.agency_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Địa chỉ</p>
                      <p className="text-lg font-semibold text-cyan-800">{agency.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Điện thoại</p>
                      <p className="text-lg font-semibold text-blue-800">{agency.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Email</p>
                      <p className="text-lg font-semibold text-cyan-800">{agency.email}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Người đại diện:</span>
                    <span className="text-blue-800 font-semibold">{agency.representative}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl p-6 shadow-lg shadow-blue-500/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-cyan-100">Tổng tiền thu</h3>
                  <DollarSign size={24} className="text-cyan-200"/>
                </div>
                <p className="text-4xl font-bold tracking-tight mb-4">
                  {payment.amount_collected.toLocaleString('vi-VN')} <span className="text-2xl font-semibold text-cyan-200">VND</span>
                </p>
                <div className="space-y-2 text-cyan-200 text-sm">
                  <div className="flex justify-between">
                    <span>Nợ hiện tại:</span>
                    <span className="font-semibold">{agency.debt_amount.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nợ còn lại:</span>
                    <span className="font-semibold">{(agency.debt_amount - payment.amount_collected).toLocaleString('vi-VN')} VND</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/payment/edit/${payment.payment_id}`)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 font-semibold transition-all duration-200 shadow-sm hover:shadow-md shadow-blue-500/20"
                  >
                    <Edit size={16} className="mr-2"/>
                    Chỉnh sửa phiếu thu
                  </button>
                  <button
                    onClick={() => navigate('/payment')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-semibold transition-all duration-200"
                  >
                    <ArrowLeft size={16} className="mr-2"/>
                    Quay lại danh sách
                  </button>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Trạng thái</h3>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-cyan-700 font-semibold">Đã hoàn thành</span>
                </div>
                <p className="text-gray-700 text-sm mt-2">
                  Phiếu thu đã được xác nhận và lưu vào hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentDetail; 