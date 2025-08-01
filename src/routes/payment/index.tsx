import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, Trash2, Eye, AlertCircle, CheckCircle, Users, Mail, Phone, MapPin, CalendarDays, DollarSign, Search, MoreVertical, ListChecks, LayoutGrid, List, XCircle, Clock, PlusCircle, Pencil, User, BadgeDollarSign, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { fetchPayments, deletePayment, updatePaymentStatus } from '../../api/payment.api';
import { useAuth } from '../../hooks/useAuth';
import { fetchAssignedAgencies } from '../../api/staffAgency.api';
import type { PaymentItem } from '../../api/payment.api';

interface PaymentRecord {
  id: string;
  agency_id: number;
  agency: string;
  address: string;
  phone: string;
  email: string;
  paymentDate: string;
  amount: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán';
}

const currentAgency = {
  name: '',
  address: '',
  phone: '',
  email: ''
};

const PaymentCard: React.FC<{
  record: PaymentRecord;
  onDelete: (record: PaymentRecord) => void;
  onViewDetail: (record: PaymentRecord) => void;
  onEdit: (record: PaymentRecord) => void;
}> = ({ record, onDelete, onViewDetail, onEdit }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Receipt className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-semibold text-blue-700 text-sm">{record.id}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onEdit(record)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa phiếu thu">
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>
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

const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const [assignedAgencyIds, setAssignedAgencyIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<PaymentRecord | null>(null);
  const [recordToView, setRecordToView] = useState<PaymentRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loadingPay, setLoadingPay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        // Lấy danh sách agency staff quản lý
        const assigned = await fetchAssignedAgencies(user.id);
        const agencyIds = assigned.map(a => a.agency_id);
        setAssignedAgencyIds(agencyIds);
        // Lấy tất cả payment rồi filter theo agency
        const data: PaymentItem[] = await fetchPayments();
        const filtered = data.filter(item => agencyIds.includes(item.agency_id));
        const records: PaymentRecord[] = filtered.map(item => ({
          id: item.payment_id.toString(),
          agency_id: item.agency_id,
          agency: item.agency_name,
          address: currentAgency.address,
          phone: currentAgency.phone,
          email: currentAgency.email,
          paymentDate: item.payment_date,
          amount: Number(item.amount_collected),
          status: item.status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán',
        }));
        setPaymentRecords(records);
      } catch (error) {
        console.error('Error fetching payment records:', error);
      }
    })();
  }, [user]);

  const filteredRecords = paymentRecords.filter(record =>
    (
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
        await deletePayment(Number(recordToDelete.id));
        setPaymentRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        setShowDeleteModal(false);
        setRecordToDelete(null);
        setToast({ type: 'success', message: `Đã xóa phiếu thu ${recordToDelete.id} thành công!` });
        setTimeout(() => setToast(null), 3000);
      } catch (error) {
        console.error('Error deleting payment:', error);
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
    try {
      await updatePaymentStatus(Number(id), 'completed');
      setPaymentRecords(records =>
        records.map(r => r.id === id ? { ...r, status: 'Đã thanh toán' } : r)
      );
      setShowDetailModal(false);
      setToast({ type: 'success', message: `Đã thanh toán phiếu thu ${id} thành công!` });
    } catch (error) {
      console.error('Error updating payment status:', error);
      setToast({ type: 'error', message: 'Có lỗi khi cập nhật trạng thái thanh toán!' });
    }
    setLoadingPay(false);
  };

  const handleEditClick = (record: PaymentRecord) => {
    if (record.status !== 'Chưa thanh toán') {
      setToast({ type: 'error', message: 'Chỉ có thể chỉnh sửa phiếu thu ở trạng thái Chưa thanh toán!' });
      return;
    }
    window.location.href = `/payment/edit/${record.id}`;
  };

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
            </div>
          </div>
          {/* Bảng/Card hiển thị phiếu thu */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
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
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;