import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, User, MapPin, Phone, Mail, CalendarDays, BadgeDollarSign, ArrowLeft, Save, Building2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

// Hàm lấy danh sách đại lý từ localStorage (hoặc mock nếu chưa có)
const getAgencies = () => {
  const data = localStorage.getItem('agencies');
  if (data) return JSON.parse(data);
  // Nếu chưa có, tạo 1 số đại lý mẫu
  const defaultAgencies = [
    { agency_id: 1, agency_name: 'Đại lý Hà Nội', phone_number: '0901234567', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM', email: 'hanoi@example.com', representative: 'Nguyễn Văn A', debt_amount: 5000000 },
    { agency_id: 2, agency_name: 'Đại lý Hồ Chí Minh', phone_number: '0902345678', address: '456 Lê Lợi, Q.1, TP.HCM', email: 'hcm@example.com', representative: 'Lê Thị B', debt_amount: 3500000 },
    { agency_id: 3, agency_name: 'Đại lý Đà Nẵng', phone_number: '0903456789', address: '789 Trần Phú, Q.Hải Châu, TP.Đà Nẵng', email: 'danang@example.com', representative: 'Phạm Văn C', debt_amount: 2000000 }
  ];
  localStorage.setItem('agencies', JSON.stringify(defaultAgencies));
  return defaultAgencies;
};

const AddPaymentReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [agencies] = useState(getAgencies());

  const [formData, setFormData] = useState({
    agency_id: '',
    payment_date: '',
    amount_collected: '',
    note: ''
  });

  const handleAgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agencyId = parseInt(e.target.value);
    const agency = agencies.find((a: any) => a.agency_id === agencyId);
    setSelectedAgency(agency);
    setFormData({ ...formData, agency_id: e.target.value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Lấy danh sách payment hiện tại
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const newPayment = {
        payment_id: Date.now(),
        ...formData,
        agency_id: Number(formData.agency_id),
        amount_collected: Number(formData.amount_collected),
        created_at: new Date().toISOString(),
        user_id: 1,
        user_name: 'Người dùng demo'
      };
      payments.push(newPayment);
      localStorage.setItem('payments', JSON.stringify(payments));
      navigate('/payment');
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const amount = parseFloat(formData.amount_collected) || 0;
  const currentDebt = selectedAgency?.debt_amount || 0;
  const remainingDebt = Math.max(0, currentDebt - amount);

  return (
    <DashboardLayout>
      <div className=" font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-blue-800">Lập Phiếu Thu</h1>
                <p className="text-blue-600 text-base mt-1">Thu tiền từ đại lý</p>
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
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agency Selection Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Chọn đại lý
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Đại lý <span className="text-red-500">*</span></label>
                  <select
                    name="agency_id"
                    value={formData.agency_id}
                    onChange={handleAgencyChange}
                    className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black shadow-sm transition-all duration-200"
                    required
                  >
                    <option value="" className="text-gray-700">Chọn đại lý...</option>
                    {agencies.map((agency: any) => (
                      <option key={agency.agency_id} value={agency.agency_id} className="text-black">
                        {agency.agency_name} - Nợ: {agency.debt_amount.toLocaleString('vi-VN')} VND
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Agency Info Card - Hiển thị khi chọn đại lý */}
            {selectedAgency && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-blue-200/80">
                <h2 className="text-xl font-bold text-blue-800 mb-6">Thông tin đại lý</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Tên đại lý</p>
                      <p className="text-lg font-semibold text-blue-800">{selectedAgency.agency_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Địa chỉ</p>
                      <p className="text-lg font-semibold text-cyan-800">{selectedAgency.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Điện thoại</p>
                      <p className="text-lg font-semibold text-blue-800">{selectedAgency.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-600 font-medium">Email</p>
                      <p className="text-lg font-semibold text-cyan-800">{selectedAgency.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
              <h2 className="text-xl font-bold text-black mb-6">Thông tin thu tiền</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Ngày thu tiền <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-400">
                      <CalendarDays size={18} />
                    </span>
                    <input
                      type="date"
                      name="payment_date"
                      value={formData.payment_date}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">Số tiền thu (VND) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-400">
                      <BadgeDollarSign size={18} />
                    </span>
                    <input
                      type="number"
                      name="amount_collected"
                      value={formData.amount_collected}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-700 shadow-sm transition-all duration-200"
                      placeholder="Nhập số tiền thu..."
                      min="0"
                      step="1000"
                      max={selectedAgency?.debt_amount || undefined}
                      required
                    />
                  </div>
                  {selectedAgency && (
                    <p className="text-sm text-gray-700 mt-1">
                      Nợ hiện tại: <span className="font-semibold text-cyan-600">{selectedAgency.debt_amount.toLocaleString('vi-VN')} VND</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-700 shadow-sm transition-all duration-200"
                  placeholder="Thêm ghi chú cho phiếu thu..."
                />
              </div>
            </div>

            {/* Summary and Submit */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Summary Card */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl p-6 shadow-lg shadow-blue-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-cyan-100">Tổng tiền thu</h3>
                    <DollarSign size={24} className="text-cyan-200"/>
                  </div>
                  <p className="text-4xl font-bold tracking-tight">
                    {amount.toLocaleString('vi-VN')} <span className="text-2xl font-semibold text-cyan-200">VND</span>
                  </p>
                  {selectedAgency && (
                    <div className="mt-4 space-y-2 text-cyan-200 text-sm">
                      <div className="flex justify-between">
                        <span>Nợ hiện tại:</span>
                        <span className="font-semibold">{currentDebt.toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nợ còn lại:</span>
                        <span className="font-semibold">{remainingDebt.toLocaleString('vi-VN')} VND</span>
                      </div>
                    </div>
                  )}
                  {formData.note && (
                    <div className="mt-4 p-3 bg-white/10 rounded-lg">
                      <p className="text-cyan-100 text-sm">{formData.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="lg:w-80">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200/80">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/payment')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-semibold transition-all duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedAgency}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow-md shadow-blue-500/20"
                    >
                      {isSubmitting ? (
                        <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Đang lưu...</>
                      ) : (
                        <><Save size={16} className="mr-2"/>Lưu phiếu thu</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPaymentReceipt;
