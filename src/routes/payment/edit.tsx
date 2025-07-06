import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPaymentById, updatePayment } from '../../api/payment.api';
import { getAgencyById } from '../../api/agency.api';
import { useAuth } from '../../hooks/useAuth';

// =================================================================================
// MOCK DEPENDENCIES & HELPERS (For standalone running)
// Trong dự án thật, bạn sẽ dùng 'react-router-dom' và thư viện icon
// =================================================================================

// Mock Layout Component
const DashboardLayout = ({ children }) => <div className="w-full">{children}</div>;

// Helper function to format currency
const formatCurrency = (value) => {
    if (isNaN(value)) return '0';
    return value.toLocaleString('vi-VN');
};

// =================================================================================
// SVG ICONS (Inline replacement for lucide-react library)
// =================================================================================
const Icon = ({ children, className }) => <div className={className}>{children}</div>;
const FilePenLine = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"/><polyline points="14 2 14 8 20 8"/><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21l-2.83 1.19L6.3 19.37l4.12-6.76z"/></svg></Icon>;
const ArrowLeft = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></Icon>;
const User = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></Icon>;
const MapPin = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></Icon>;
const Phone = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></Icon>;
const Mail = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></Icon>;
const CalendarDays = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></Icon>;
const Landmark = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg></Icon>;
const Banknote = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg></Icon>;
const PencilLine = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></Icon>;
const CheckCircle = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></Icon>;
const Spinner = ({ className }) => <Icon className={className}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></Icon>;

// =================================================================================
// DATA SETUP (For standalone running)
// =================================================================================
const setupMockData = () => {
    // Chỉ thiết lập nếu chưa có dữ liệu
    if (!localStorage.getItem('agencies')) {
        const mockAgencies = [
            { agency_id: 1, agency_name: "Đại lý Tiến Phát", address: "123 Võ Văn Tần, Q.3, TP.HCM", phone_number: "0908123456", email: "tienphat@email.com", debt_amount: 50000000 },
            { agency_id: 2, agency_name: "Công ty An Khang", address: "45 Lý Thường Kiệt, Q.10, TP.HCM", phone_number: "0913789123", email: "ankhang@email.com", debt_amount: 125000000 },
            { agency_id: 3, agency_name: "Nhà phân phối Hưng Thịnh", address: "789 Nguyễn Văn Linh, Q.7, TP.HCM", phone_number: "0989456789", email: "hungthinh@email.com", debt_amount: 0 },
        ];
        localStorage.setItem('agencies', JSON.stringify(mockAgencies));
    }
    if (!localStorage.getItem('payments')) {
        const mockPayments = [
            { payment_id: 101, agency_id: 2, payment_date: "2025-06-20", amount_collected: 25000000, note: "Thanh toán đợt 1 tháng 6" },
        ];
        localStorage.setItem('payments', JSON.stringify(mockPayments));
    }
};

const getAgencies = () => {
    const data = localStorage.getItem('agencies');
    return data ? JSON.parse(data) : [];
};

// =================================================================================
// MAIN COMPONENT: EditPaymentReceipt
// =================================================================================
const EditPaymentReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencies] = useState(getAgencies());
  const [formData, setFormData] = useState({
    agency_id: '',
    payment_date: '',
    amount_collected: '',
    note: ''
  });

  // --- DATA LOADING EFFECT ---
  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        if (!id || !user) return;
        const payment = await getPaymentById(Number(id));
        if (payment.user_id !== user.id) {
          alert('Bạn không có quyền chỉnh sửa phiếu thu này!');
          navigate('/payment');
          return;
        }
        if (payment.status !== 'pending' && payment.status !== 'Chưa thanh toán') {
          alert('Chỉ có thể chỉnh sửa phiếu thu ở trạng thái Chưa thanh toán!');
          navigate('/payment');
          return;
        }
        setFormData({
          agency_id: payment.agency_id?.toString() || '',
          payment_date: payment.payment_date || '',
          amount_collected: payment.amount_collected?.toString() || '',
          note: payment.note || ''
        });
        // Lấy thông tin đại lý từ backend
        const agencyRaw = await getAgencyById(payment.agency_id);
        // Map lại các trường cho FE
        const agency = {
          agency_id: agencyRaw.id,
          agency_name: agencyRaw.name,
          phone_number: agencyRaw.phone,
          address: agencyRaw.address,
          email: agencyRaw.email,
          debt_amount: parseFloat(agencyRaw.current_debt),
        };
        setSelectedAgency(agency);
      } catch (error) {
        alert('Không tìm thấy phiếu thu hoặc dữ liệu không hợp lệ!');
        navigate('/payment');
      } finally {
        setIsLoading(false);
      }
    };
    loadPaymentData();
  }, [id, user, navigate]);

  // --- HANDLERS ---
  const handleAgencyChange = (e) => {
    const agencyId = parseInt(e.target.value, 10);
    const agency = agencies.find((a) => a.agency_id === agencyId);
    setSelectedAgency(agency);
    setFormData({ ...formData, agency_id: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Kiểm tra trạng thái trước khi cập nhật
      if (selectedAgency && selectedAgency.debt_amount < parseFloat(formData.amount_collected)) {
        alert('Số tiền thu vượt quá nợ còn lại của đại lý!');
        setIsSubmitting(false);
        return;
      }
      // Gọi API cập nhật payment lên backend
      await updatePayment(Number(id), {
        agency_id: Number(formData.agency_id),
        payment_date: formData.payment_date,
        amount_collected: Number(formData.amount_collected),
        note: formData.note
      });
      alert('Cập nhật phiếu thu thành công!');
      navigate('/payment');
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DERIVED STATE & FORMATTERS ---
  const amount = parseFloat(formData.amount_collected) || 0;
  const currentDebt = selectedAgency?.debt_amount || 0;
  const remainingDebt = Math.max(0, currentDebt - amount);

  // Đường dẫn đến trang danh sách phiếu thu
  const PAYMENT_LIST_PATH = '/payment';

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
            <Spinner className="h-6 w-6 mr-3" />
            Đang tải dữ liệu phiếu thu...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 to-blue-100/30 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FilePenLine className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Chỉnh Sửa Phiếu Thu</h1>
                <p className="text-slate-500 text-base mt-1">Cập nhật chi tiết cho phiếu thu #{id}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(PAYMENT_LIST_PATH)}
              className="flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 font-semibold gap-2 text-sm shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại danh sách</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Cột Trái: Form Nhập Liệu */}
              <div className="lg:col-span-3 space-y-6">
                {/* Card 1: Thông tin Đại lý */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/80">
                  <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-blue-500" />
                    Thông tin Đại Lý
                  </h2>
                  <div className="space-y-6">
                    {/* Bỏ dropdown chọn đại lý, chỉ hiển thị info */}
                    {selectedAgency && (
                      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-200/80 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <InfoItem icon={<User className="h-5 w-5" />} label="Người đại diện" value={selectedAgency.agency_name} />
                          <InfoItem icon={<Phone className="h-5 w-5" />} label="Số điện thoại" value={selectedAgency.phone_number} />
                          <InfoItem icon={<MapPin className="h-5 w-5" />} label="Địa chỉ" value={selectedAgency.address} className="md:col-span-2"/>
                          <InfoItem icon={<Mail className="h-5 w-5" />} label="Email" value={selectedAgency.email} className="md:col-span-2"/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: Thông tin Thanh toán */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/80">
                  <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <Banknote className="h-6 w-6 text-blue-500" />
                    Thông tin Thu Tiền
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Ngày thu tiền <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <CalendarDays className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 h-full w-5" />
                        <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 shadow-sm transition-all" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Số tiền thu (VND) <span className="text-red-500">*</span></label>
                      <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 font-semibold">₫</span>
                        <input type="number" name="amount_collected" value={formData.amount_collected} onChange={handleChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 shadow-sm transition-all" placeholder="0" min="1" max={selectedAgency?.debt_amount || undefined} required />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Ghi chú</label>
                    <div className="relative">
                       <PencilLine className="absolute top-3.5 left-0 flex items-center pl-3.5 text-slate-400 h-full w-5" />
                      <textarea name="note" value={formData.note} onChange={handleChange} rows={3} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 shadow-sm transition-all" placeholder="Thêm ghi chú cho phiếu thu..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột Phải: Tóm tắt & Hành động */}
              <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-8 h-fit">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl shadow-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-200 mb-2">Tóm Tắt Phiếu Thu</h3>
                  <p className="text-sm text-blue-200">Tổng tiền thu</p>
                  <p className="text-5xl font-bold tracking-tight text-cyan-300">
                    {formatCurrency(amount)} <span className="text-3xl font-semibold text-blue-300">VND</span>
                  </p>
                  
                  {selectedAgency && (
                    <div className="mt-6 pt-4 border-t border-white/20 space-y-2 text-blue-200 text-sm">
                      <SummaryRow label="Nợ ban đầu:" value={`${formatCurrency(currentDebt)} VND`} />
                      <SummaryRow label="Thu kỳ này:" value={`- ${formatCurrency(amount)} VND`} />
                      <hr className="border-white/20 my-2" />
                      <SummaryRow label="Nợ còn lại:" value={`${formatCurrency(remainingDebt)} VND`} isHighlighted />
                    </div>
                  )}

                  {formData.note && (
                    <div className="mt-4 p-3 bg-white/10 rounded-lg">
                      <p className="text-blue-100 text-sm italic">{`Ghi chú: ${formData.note}`}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/80">
                  <div className="grid grid-cols-1 gap-4">
                    <button type="submit" disabled={isSubmitting || !selectedAgency || amount <= 0} className="w-full flex items-center justify-center px-4 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold transition-all duration-300 shadow-md hover:shadow-lg shadow-blue-500/20 text-base">
                      {isSubmitting ? (
                        <> <Spinner className="h-5 w-5 mr-3" /> Đang cập nhật... </>
                      ) : (
                        <> <CheckCircle className="h-5 w-5 mr-2"/> Cập Nhật Phiếu Thu </>
                      )}
                    </button>
                    <button type="button" onClick={() => navigate(PAYMENT_LIST_PATH)} className="w-full flex items-center justify-center px-4 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300/70 font-semibold transition-all">
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
       {/* CSS for animation - In a real app, this should be in a global CSS file */}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
};

// =================================================================================
// HELPER COMPONENTS
// =================================================================================
const InfoItem = ({ icon, label, value, className }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="w-8 h-8 mt-1 flex-shrink-0 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-base font-semibold text-slate-700">{value}</p>
    </div>
  </div>
);

const SummaryRow = ({ label, value, isHighlighted }) => (
  <div className={`flex justify-between items-center ${isHighlighted ? 'text-base' : 'text-sm'}`}>
    <span>{label}</span>
    <span className={isHighlighted ? 'font-bold text-cyan-300' : 'font-medium text-blue-100'}>
      {value}
    </span>
  </div>
);

// =================================================================================
// EXPORT APP
// =================================================================================
export default function App() {
  return <EditPaymentReceipt />;
}
