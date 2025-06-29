import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DollarSign, User, MapPin, Phone, Mail, CalendarDays, BadgeDollarSign, ArrowLeft, Save, Building2, Edit3 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const getAgencies = () => {
  const data = localStorage.getItem('agencies');
  if (data) return JSON.parse(data);
  return [];
};

const EditPaymentReceipt: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [agencies] = useState(getAgencies());
  const [formData, setFormData] = useState({
    agency_id: '',
    payment_date: '',
    amount_collected: '',
    note: ''
  });

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const payment = payments.find((p: any) => p.payment_id === Number(id));
        if (payment) {
          setFormData({
            agency_id: payment.agency_id.toString(),
            payment_date: payment.payment_date,
            amount_collected: payment.amount_collected.toString(),
            note: payment.note || ''
          });
          const agency = agencies.find((a: any) => a.agency_id === payment.agency_id);
          setSelectedAgency(agency);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    loadPaymentData();
  }, [id, agencies]);

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
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const idx = payments.findIndex((p: any) => p.payment_id === Number(id));
      if (idx !== -1) {
        payments[idx] = {
          ...payments[idx],
          ...formData,
          agency_id: Number(formData.agency_id),
          amount_collected: Number(formData.amount_collected)
        };
        localStorage.setItem('payments', JSON.stringify(payments));
      }
      navigate('/payment');
    } catch (error) {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  const amount = parseFloat(formData.amount_collected) || 0;
  const currentDebt = selectedAgency?.debt_amount || 0;
  const remainingDebt = Math.max(0, currentDebt - amount);

  if (isLoading) {
    return <DashboardLayout><div className="p-8 text-center">Đang tải...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Edit3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-800">Chỉnh Sửa Phiếu Thu</h1>
                <p className="text-slate-600 text-base mt-1">Cập nhật thông tin phiếu thu #{id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate('/payment')}
                className="flex items-center justify-center px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 font-semibold gap-2 text-sm"
              >
                <ArrowLeft size={16} /><span>Quay lại</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agency Selection Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-600" />
                Chọn đại lý
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Đại lý <span className="text-red-500">*</span></label>
                  <select
                    name="agency_id"
                    value={formData.agency_id}
                    onChange={handleAgencyChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 shadow-sm transition-all duration-200"
                    required
                  >
                    <option value="">Chọn đại lý...</option>
                    {agencies.map(agency => (
                      <option key={agency.agency_id} value={agency.agency_id}>
                        {agency.agency_name} - Nợ: {agency.debt_amount.toLocaleString('vi-VN')} VND
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Agency Info Card - Hiển thị khi chọn đại lý */}
            {selectedAgency && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border border-amber-200/80">
                <h2 className="text-xl font-bold text-amber-800 mb-6">Thông tin đại lý</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Tên đại lý</p>
                      <p className="text-lg font-semibold text-amber-800">{selectedAgency.agency_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Địa chỉ</p>
                      <p className="text-lg font-semibold text-orange-800">{selectedAgency.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Điện thoại</p>
                      <p className="text-lg font-semibold text-yellow-800">{selectedAgency.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-red-600 font-medium">Email</p>
                      <p className="text-lg font-semibold text-red-800">{selectedAgency.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Thông tin thu tiền</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Ngày thu tiền <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <CalendarDays size={18} />
                    </span>
                    <input
                      type="date"
                      name="payment_date"
                      value={formData.payment_date}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Số tiền thu (VND) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <BadgeDollarSign size={18} />
                    </span>
                    <input
                      type="number"
                      name="amount_collected"
                      value={formData.amount_collected}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 shadow-sm transition-all duration-200"
                      placeholder="Nhập số tiền thu..."
                      min="0"
                      step="1000"
                      max={selectedAgency?.debt_amount || undefined}
                      required
                    />
                  </div>
                  {selectedAgency && (
                    <p className="text-sm text-slate-500 mt-1">
                      Nợ hiện tại: <span className="font-semibold text-amber-600">{selectedAgency.debt_amount.toLocaleString('vi-VN')} VND</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Ghi chú</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 shadow-sm transition-all duration-200"
                  placeholder="Thêm ghi chú cho phiếu thu..."
                />
              </div>
            </div>

            {/* Summary and Submit */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Summary Card */}
              <div className="flex-1">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-6 shadow-lg shadow-amber-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-amber-100">Tổng tiền thu</h3>
                    <DollarSign size={24} className="text-amber-200"/>
                  </div>
                  <p className="text-4xl font-bold tracking-tight">
                    {amount.toLocaleString('vi-VN')} <span className="text-2xl font-semibold text-amber-200">VND</span>
                  </p>
                  {selectedAgency && (
                    <div className="mt-4 space-y-2 text-amber-200 text-sm">
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
                      <p className="text-amber-100 text-sm">{formData.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="lg:w-80">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/payment')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300/70 font-semibold transition-all duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedAgency}
                      className="w-full flex items-center justify-center px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow-md shadow-amber-500/20"
                    >
                      {isSubmitting ? (
                        <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Đang cập nhật...</>
                      ) : (
                        <><Save size={16} className="mr-2"/>Cập nhật phiếu thu</>
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

export default EditPaymentReceipt; 