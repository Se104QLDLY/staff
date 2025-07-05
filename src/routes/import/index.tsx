import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PackagePlus, ListChecks, DollarSign, FilePlus2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchReceipts, deleteReceipt } from '../../api/import.api';
import type { ReceiptItem } from '../../api/import.api';
import { fetchAssignedAgencies } from '../../api/staffAgency.api';

interface ImportRecord {
  id: string;
  importDate: string;
  totalAmount: string;
  agency: string;
  agencyId: number;
}

const ImportManagementPage: React.FC = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ImportRecord | null>(null);
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const { user } = useAuth();
  const [assignedAgencies, setAssignedAgencies] = useState<{agency_id: number; agency_name: string;}[]>([]);

  const agencies = ['Tất cả đại lý', 'Đại lý A', 'Đại lý B', 'Đại lý C'];

  // Fetch assigned agencies and import records
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Lấy danh sách agency được phân công
        const agencies = await fetchAssignedAgencies(user.id);
        setAssignedAgencies(agencies);
        const agencyIds = agencies.map(a => a.agency_id);

        // Fetch phiếu nhập
        const data: ReceiptItem[] = await fetchReceipts();
        // Lọc chỉ phiếu nhập của các agency được phân công
        const filtered = data.filter(item => agencyIds.includes(item.agency_id));
        // Map dữ liệu sang ImportRecord
        const records: ImportRecord[] = filtered.map(item => ({
          id: item.receipt_id.toString(),
          importDate: item.receipt_date,
          totalAmount: Number(item.total_amount).toLocaleString('vi-VN'),
          agency: item.agency_name,
          agencyId: item.agency_id
        }));
        setImportRecords(records);
      } catch (error) {
        console.error('Error loading import data:', error);
      }
    })();
  }, [user]);

  // Lọc theo từ khóa và đại lý
  const filteredRecords = importRecords.filter(
    (record) =>
      (!fromDate || new Date(record.importDate) >= new Date(fromDate)) &&
      (!toDate || new Date(record.importDate) <= new Date(toDate)) &&
      (selectedAgency === '' || selectedAgency === 'Tất cả đại lý' || record.agency === selectedAgency) &&
      (
        record.id.toLowerCase().includes(search.toLowerCase()) ||
        record.totalAmount.toLowerCase().includes(search.toLowerCase()) ||
        record.importDate.includes(search)
      )
  );

  const handleDeleteClick = (record: ImportRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      try {
        // Call API to delete
        await deleteReceipt(Number(recordToDelete.id));
        
        // Update local state
        setImportRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        
        // Close modal and reset
        setShowDeleteModal(false);
        setRecordToDelete(null);
        
        alert(`Đã xóa phiếu nhập ${recordToDelete.id} thành công!`);
      } catch (error) {
        console.error('Error deleting import record:', error);
        alert('Có lỗi xảy ra khi xóa phiếu nhập!');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  // Thống kê
  const totalImports = filteredRecords.length;
  const totalAmount = filteredRecords.reduce((sum, r) => sum + Number(r.totalAmount.replace(/[^\d]/g, '')), 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl">
            <PackagePlus className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Quản lý Nhập hàng</h1>
            <p className="text-blue-600 text-lg mt-1 font-medium">Theo dõi và quản lý các phiếu nhập hàng của đại lý.</p>
          </div>
        </div>
        {/* Card thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 flex items-center gap-5 hover:scale-105 transition-transform">
            <div className="bg-blue-200 p-4 rounded-full shadow">
              <ListChecks className="h-9 w-9 text-blue-700" />
            </div>
            <div>
              <h3 className="text-blue-700 font-semibold text-lg">Tổng phiếu nhập</h3>
              <p className="text-4xl font-extrabold text-gray-900">{totalImports}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-cyan-100 rounded-2xl shadow-lg p-6 border-l-4 border-green-500 flex items-center gap-5 hover:scale-105 transition-transform">
            <div className="bg-green-200 p-4 rounded-full shadow">
              <DollarSign className="h-9 w-9 text-green-700" />
            </div>
            <div>
              <h3 className="text-green-700 font-semibold text-lg">Tổng số tiền</h3>
              <p className="text-3xl lg:text-4xl font-extrabold text-gray-900">{(totalAmount/1000000).toFixed(2)}M</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide flex items-center gap-2">
            <PackagePlus className="h-7 w-7 text-blue-500 mr-2" /> Quản lý Nhập hàng
          </h1>
          {/* Filters and Add Button */}
          <div className="flex flex-wrap gap-4 mb-8 items-center">
            <input
              type="text"
              placeholder="Tìm kiếm phiếu nhập..."
              className="flex-1 min-w-[220px] px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={selectedAgency}
              onChange={e => setSelectedAgency(e.target.value)}
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm min-w-[180px]"
            >
              {agencies.map(agency => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Từ ngày"
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="Đến ngày"
              className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <Link
              to="/import/add"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:scale-105 hover:shadow-xl transition-all font-bold text-lg shadow-lg whitespace-nowrap border-2 border-blue-700"
            >
              <FilePlus2 className="h-5 w-5 mr-2" /> Tạo phiếu nhập
            </Link>
          </div>
          {/* Import Records Table */}
          <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
            <table className="min-w-full bg-white border border-blue-200">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                <tr className="uppercase text-sm">
                  <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Mã phiếu nhập</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px]">Ngày lập phiếu</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Tổng tiền</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2">
                      <PackagePlus className="h-5 w-5 text-blue-400" /> {record.id}
                    </td>
                    <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{new Date(record.importDate).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">{record.totalAmount} VND</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Link
                          to={`/import/view/${record.id}`}
                          className="px-2 sm:px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center whitespace-nowrap flex items-center gap-1"
                        >
                          <ListChecks className="h-4 w-4" /> Xem
                        </Link>
                        <Link
                          to={`/import/edit/${record.id}`}
                          className="px-2 sm:px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center whitespace-nowrap flex items-center gap-1"
                        >
                          <FilePlus2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Chỉnh sửa</span>
                          <span className="sm:hidden">Sửa</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(record)}
                          className="px-2 sm:px-3 py-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> Xóa
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
              <p className="text-gray-500 text-lg">Không tìm thấy phiếu nhập nào.</p>
            </div>
          )}
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
                    <Trash2 className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa phiếu nhập</h3>
                  <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa phiếu nhập <strong>{recordToDelete?.id}</strong>?
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
                      Xóa phiếu nhập
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImportManagementPage;