import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Trash2, Eye, AlertCircle, CheckCircle, Users, Mail, Phone, MapPin, CalendarDays, DollarSign, Search, MoreVertical, ListChecks, LayoutGrid, List, XCircle, Clock, PlusCircle, Pencil, User, BadgeDollarSign, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface PaymentRecord {
  id: string;
  agency: string;
  address: string;
  phone: string;
  email: string;
  paymentDate: string;
  amount: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán';
}

const currentAgency = {
  name: 'Đại lý Hà Nội',
  address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
  phone: '0901234567',
  email: 'hanoi@example.com'
};

const initialPaymentRecords: PaymentRecord[] = [
  { id: 'PT001', agency: 'Đại lý Hà Nội', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'hanoi@example.com', paymentDate: '2024-07-21', amount: 5000000, status: 'Đã thanh toán' },
  { id: 'PT007', agency: 'Đại lý Hà Nội', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'hanoi@example.com', paymentDate: '2024-07-20', amount: 3200000, status: 'Chưa thanh toán' },
  { id: 'PT015', agency: 'Đại lý Hà Nội', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'hanoi@example.com', paymentDate: '2024-07-19', amount: 4800000, status: 'Đã thanh toán' },
  { id: 'PT023', agency: 'Đại lý Hà Nội', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'hanoi@example.com', paymentDate: '2024-07-18', amount: 2100000, status: 'Chưa thanh toán' },
  { id: 'PT031', agency: 'Đại lý Hà Nội', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'hanoi@example.com', paymentDate: '2024-07-17', amount: 6500000, status: 'Đã thanh toán' },
  { id: 'PT045', agency: 'Đại lý Hà Nội', address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội', phone: '0901234567', email: 'hanoi@example.com', paymentDate: '2024-07-16', amount: 3800000, status: 'Chưa thanh toán' },
];

const PaymentCard: React.FC<{
  record: PaymentRecord;
  onDelete: (record: PaymentRecord) => void;
  onViewDetail: (record: PaymentRecord) => void;
}> = ({ record, onDelete, onViewDetail }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Receipt className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-semibold text-blue-700 text-sm">{record.id}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onViewDetail(record)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
          <Eye className="w-4 h-4 text-blue-600" />
        </button>
        <button onClick={() => onDelete(record)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Xóa phiếu thu">
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          <span>{record.paymentDate}</span>
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Số tiền thu:</span>
          <span className="font-bold text-green-600 text-lg">{record.amount.toLocaleString('vi-VN')} VNĐ</span>
        </div>
      </div>
    </div>
  </div>
);

const DetailModal: React.FC<{
  record: PaymentRecord | null;
  onClose: () => void;
  onPay?: (id: string) => Promise<void>;
  loadingPay?: boolean;
}> = ({ record, onClose, onPay, loadingPay }) => {
  if (!record) return null;
  const isPaid = record.status === 'Đã thanh toán';
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-white">
              <Receipt className="w-8 h-8 text-white drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold">Chi tiết phiếu thu</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-sm shadow ${isPaid ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-yellow-100 border border-yellow-400 text-yellow-700'}`}>
                  {isPaid ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  {isPaid ? 'Hoàn thành' : 'Chưa thanh toán'}
                </span>
              </div>
              <p className="text-blue-100 font-semibold flex items-center gap-2 mt-1">
                <ListChecks className="w-4 h-4 text-white" />
                Mã phiếu: <span className="underline">{record.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400" title="Đóng">
            <XCircle className="w-7 h-7 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Thông tin đại lý
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Tên đại lý</label>
                <p className="font-medium text-gray-900">{currentAgency.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Mã phiếu thu</label>
                <p className="font-medium text-blue-600">{record.id}</p>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm text-gray-500">Địa chỉ</label>
              <p className="font-medium text-gray-900">{currentAgency.address}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" /> Thông tin liên hệ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <label className="text-sm text-gray-500">Số điện thoại</label>
                  <p className="font-medium text-gray-900">{currentAgency.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{currentAgency.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" /> Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <div>
                  <label className="text-sm text-gray-500">Ngày thu tiền</label>
                  <p className="font-medium text-gray-900">{record.paymentDate}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Số tiền thu</label>
                <p className="text-2xl font-bold text-green-600">{record.amount.toLocaleString('vi-VN')} VNĐ</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {isPaid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-500" />
              )}
              Trạng thái
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
              <span className="text-sm text-gray-500">{isPaid ? 'Phiếu thu đã được xử lý thành công' : 'Phiếu thu chưa được thanh toán'}</span>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Đóng</button>
            {!isPaid && onPay && (
              <button
                onClick={() => onPay(record.id)}
                disabled={loadingPay}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-60"
              >
                {loadingPay ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : (
                  <DollarSign className="w-4 h-4" />
                )}
                Thanh toán
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: React.FC<{
  record: PaymentRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ record, onConfirm, onCancel }) => {
  if (!record) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa phiếu thu</h3>
          <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa phiếu thu <strong>{record.id}</strong>?<br /><span className="text-sm text-red-600">Hành động này không thể hoàn tác.</span></p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold">Hủy bỏ</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">Xóa phiếu thu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditModal: React.FC<{
  record: PaymentRecord | null;
  onClose: () => void;
  onSave: (updated: PaymentRecord) => void;
  loading?: boolean;
}> = ({ record, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    agency: record?.agency || '',
    address: record?.address || '',
    phone: record?.phone || '',
    email: record?.email || '',
    paymentDate: record?.paymentDate || '',
    amount: record?.amount || 0,
    status: record?.status || 'Chưa thanh toán',
  });
  if (!record) return null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'amount' ? Number(value) : value }));
  };
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 bg-opacity-95 flex items-center justify-center z-50 p-2">
      <div className="w-full max-w-3xl mx-auto rounded-xl shadow-xl border border-gray-100 bg-white/90 backdrop-blur-lg p-0 overflow-hidden max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-200 via-blue-100 to-purple-200 p-3 relative">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow border border-gray-100">
            <Pencil className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-extrabold text-gray-700 drop-shadow uppercase tracking-wide flex-1 text-center">Sửa phiếu thu</h2>
          <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 hover:bg-red-400 transition-colors shadow" title="Đóng"><XCircle className="w-5 h-5 text-blue-400 hover:text-white" /></button>
        </div>
        {/* Form card */}
        <form className="p-3 md:p-5 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 bg-transparent" style={{minHeight:'0'}} onSubmit={e => { e.preventDefault(); onSave({ ...record, ...form }); }}>
          <div className="space-y-3 flex flex-col justify-between">
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-blue-700 mb-1 flex items-center gap-1">
                <User className="text-blue-400 h-4 w-4" /> Đại lý
              </label>
              <input
                type="text"
                name="agency"
                value={form.agency}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-300 text-sm bg-white"
                placeholder="Nhập tên đại lý..."
                required
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-cyan-700 mb-1 flex items-center gap-1">
                <MapPin className="text-cyan-400 h-4 w-4" /> Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-cyan-200 focus:border-cyan-300 text-sm bg-white"
                placeholder="Nhập địa chỉ đại lý..."
                required
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-fuchsia-700 mb-1 flex items-center gap-1">
                <Phone className="text-fuchsia-400 h-4 w-4" /> Điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-fuchsia-200 focus:border-fuchsia-300 text-sm bg-white"
                placeholder="Nhập số điện thoại..."
                required
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-purple-700 mb-1 flex items-center gap-1">
                <Mail className="text-purple-400 h-4 w-4" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-purple-200 focus:border-purple-300 text-sm bg-white"
                placeholder="Nhập email đại lý..."
                required
              />
            </div>
          </div>
          <div className="space-y-3 flex flex-col justify-between">
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-orange-700 mb-1 flex items-center gap-1">
                <CalendarDays className="text-orange-400 h-4 w-4" /> Ngày thu tiền
              </label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-orange-200 focus:border-orange-300 text-sm bg-white"
                required
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-green-700 mb-1 flex items-center gap-1">
                <BadgeDollarSign className="text-green-400 h-4 w-4" /> Số tiền thu
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-300 text-sm bg-white"
                placeholder="Nhập số tiền thu..."
                required
              />
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <label className="block text-sm font-bold text-fuchsia-700 mb-1 flex items-center gap-1">
                <CheckCircle className="text-fuchsia-400 h-4 w-4" /> Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-2 py-1 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-fuchsia-200 focus:border-fuchsia-300 text-sm bg-white"
                required
              >
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Chưa thanh toán">Chưa thanh toán</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 rounded-full hover:bg-blue-200 transition-colors font-bold text-sm shadow border border-gray-200"
              >
                <ArrowLeft className="h-4 w-4" /> Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-blue-400 to-green-300 text-white rounded-full hover:from-blue-500 hover:to-green-400 transition-all font-bold text-sm shadow border border-blue-100 disabled:opacity-60"
              >
                {loading ? <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> : <Pencil className="h-4 w-4" />}Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PaymentRecord | null>(null);
  const [recordToView, setRecordToView] = useState<PaymentRecord | null>(null);
  const [recordToEdit, setRecordToEdit] = useState<PaymentRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const itemsPerPage = 8;
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(initialPaymentRecords);
  const [loadingPay, setLoadingPay] = useState(false);

  const filteredRecords = paymentRecords.filter(record =>
    record.agency === currentAgency.name && (
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.paymentDate.includes(searchTerm) ||
      record.amount.toString().includes(searchTerm)
    )
  );

  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleDeleteClick = (record: PaymentRecord) => { setRecordToDelete(record); setShowDeleteModal(true); };
  const handleViewDetail = (record: PaymentRecord) => { setRecordToView(record); setShowDetailModal(true); };
  const handleCloseDetail = () => { setShowDetailModal(false); setRecordToView(null); };
  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setPaymentRecords(paymentRecords.filter(r => r.id !== recordToDelete.id));
        setShowDeleteModal(false);
        setRecordToDelete(null);
        setToast({ type: 'success', message: `Đã xóa phiếu thu ${recordToDelete.id} thành công!` });
        setTimeout(() => setToast(null), 3000);
      } catch (error) {
        setToast({ type: 'error', message: 'Có lỗi xảy ra khi xóa phiếu thu!' });
        setTimeout(() => setToast(null), 3000);
      }
    }
  };
  const handleDeleteCancel = () => { setShowDeleteModal(false); setRecordToDelete(null); };

  const totalPayments = filteredRecords.length;
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

  const handlePay = async (id: string) => {
    setLoadingPay(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPaymentRecords(records =>
      records.map(r => r.id === id ? { ...r, status: 'Đã thanh toán' } : r)
    );
    setShowDetailModal(false);
    setToast({ type: 'success', message: `Đã thanh toán phiếu thu ${id} thành công!` });
    setLoadingPay(false);
  };

  const handleEditClick = (record: PaymentRecord) => { setRecordToEdit(record); setShowEditModal(true); };
  const handleEditSave = async (updated: PaymentRecord) => {
    setPaymentRecords(records => records.map(r => r.id === updated.id ? updated : r));
    setShowEditModal(false);
    setRecordToEdit(null);
    setToast({ type: 'success', message: `Đã cập nhật phiếu thu ${updated.id} thành công!` });
    setTimeout(() => setToast(null), 3000);
  };
  const handleEditCancel = () => { setShowEditModal(false); setRecordToEdit(null); };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 font-semibold animate-fade-in-down ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {toast.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            {toast.message}
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          {/* Header với thông tin đại lý */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Receipt className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-800">Phiếu Thu Của Tôi</h1>
                <p className="text-blue-600 font-semibold">{currentAgency.name}</p>
              </div>
            </div>
            <Link to="/payment/add" className="ml-auto inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-blue-700">
              <PlusCircle className="h-5 w-5" /> Thêm phiếu thu
            </Link>
          </header>
          {/* Thẻ thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 flex items-center gap-5">
              <div className="bg-blue-100 p-3 rounded-full">
                <ListChecks className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-500 font-semibold">Tổng phiếu thu</h3>
                <p className="text-3xl font-bold text-gray-800">{totalPayments}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 flex items-center gap-5">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-500 font-semibold">Tổng số tiền</h3>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{(totalAmount / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
          {/* Thanh tìm kiếm và chuyển đổi view */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã phiếu, ngày thu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  {viewMode === 'table' ? <LayoutGrid size={16}/> : <List size={16}/>} {viewMode === 'table' ? 'Card View' : 'Table View'}
                </button>
              </div>
            </div>
          </div>
          {/* Bảng/Card hiển thị phiếu thu */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1"><ListChecks className="h-5 w-5" />Mã phiếu</span></th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1"><CalendarDays className="h-5 w-5" />Ngày thu</span></th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1"><Users className="h-5 w-5" />Đại lý</span></th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1 justify-end"><DollarSign className="h-5 w-5" />Số tiền</span></th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1 justify-center"><Users className="h-5 w-5" />Trạng thái</span></th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm"><span className="flex items-center gap-1 justify-center"><MoreVertical className="h-5 w-5" />Thao tác</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Receipt className="w-4 h-4 text-blue-600" /></div><span className="font-semibold text-blue-700">{record.id}</span></div></td>
                        <td className="py-3 px-4 text-sm text-gray-600">{record.paymentDate}</td>
                        <td className="py-3 px-4 text-gray-700"><div className="font-semibold">{record.agency}</div><div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={14}/> {record.phone}</div></td>
                        <td className="py-3 px-4 text-right"><span className="font-bold text-green-600">{record.amount.toLocaleString('vi-VN')} VNĐ</span></td>
                        <td className="py-3 px-4 text-center">
                          {record.status === 'Đã thanh toán' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg shadow-sm">
                              <CheckCircle className="h-4 w-4" /> Đã thanh toán
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg shadow-sm">
                              <Clock className="h-4 w-4" /> Chưa thanh toán
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(record)}
                              className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded-lg hover:bg-yellow-200 transition-colors shadow-sm"
                              title="Sửa phiếu thu"
                            >
                              <Pencil className="h-5 w-5" /> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(record)}
                              className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                              title="Xóa phiếu thu"
                            >
                              <Trash2 className="h-5 w-5" /> Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4"><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{currentRecords.map((record) => (<PaymentCard key={record.id} record={record} onDelete={handleDeleteClick} onViewDetail={handleViewDetail} />))}</div></div>
            )}
            {filteredRecords.length === 0 && (
              <div className="text-center py-12"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-6 h-6 text-gray-400" /></div><p className="text-gray-500 text-lg">Không tìm thấy phiếu thu nào</p><p className="text-gray-400 text-sm">Thử thay đổi từ khóa tìm kiếm</p></div>
            )}
          </div>
          {/* Phân trang */}
          {filteredRecords.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-1">
                <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Trước</button>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                  if (pageNum > totalPages) return null;
                  return (
                    <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-3 py-2 text-sm border rounded-lg transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{pageNum}</button>
                  );
                })}
                <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Tiếp</button>
              </nav>
            </div>
          )}
        </div>
        {/* Modal xác nhận xóa */}
        {showDeleteModal && recordToDelete && (
          <DeleteModal record={recordToDelete} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />
        )}
        {/* Modal chi tiết phiếu thu */}
        {showDetailModal && recordToView && (
          <DetailModal record={recordToView} onClose={handleCloseDetail} onPay={handlePay} loadingPay={loadingPay} />
        )}
        {/* Modal sửa phiếu thu */}
        {showEditModal && recordToEdit && (
          <EditModal record={recordToEdit} onClose={handleEditCancel} onSave={handleEditSave} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;