import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface ImportRecord {
  id: string;
  agency: string;
  importDate: string;
  totalAmount: string;
  creator: string;
  createdDate: string;
  updatedDate: string;
}

const ImportManagementPage: React.FC = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ImportRecord | null>(null);

  const [importRecords, setImportRecords] = useState<ImportRecord[]>([
    {
      id: 'PN001',
      agency: 'Đại lý A',
      importDate: '2024-01-15',
      totalAmount: '15,000,000',
      creator: 'Nguyễn Văn A',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-15',
    },
    {
      id: 'PN002',
      agency: 'Đại lý B',
      importDate: '2024-01-14',
      totalAmount: '22,500,000',
      creator: 'Trần Thị B',
      createdDate: '2024-01-14',
      updatedDate: '2024-01-14',
    },
  ]);

  const filteredRecords = importRecords.filter(
    (record) =>
      (!fromDate || new Date(record.importDate) >= new Date(fromDate)) &&
      (!toDate || new Date(record.importDate) <= new Date(toDate)) &&
      (!selectedAgency || record.agency === selectedAgency)
  );

  const handleDeleteClick = (record: ImportRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from local state
        setImportRecords(importRecords.filter(r => r.id !== recordToDelete.id));
        
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

  const agencies = ['Đại lý A', 'Đại lý B', 'Đại lý C'];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">Quản lý Nhập hàng</h1>
        
        {/* Filters and Add Button */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <select 
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
          >
            <option value="">Tất cả đại lý</option>
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
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Tạo phiếu nhập</span>
            <span className="sm:hidden">Thêm</span>
          </Link>
        </div>

        {/* Import Records Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
          <table className="min-w-full bg-white border border-blue-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Mã phiếu nhập</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[150px]">Đại lý</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px]">Ngày nhập</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Tổng tiền</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden md:table-cell">Người tạo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden lg:table-cell">Ngày tạo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden xl:table-cell">Cập nhật</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{record.id}</td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="max-w-[150px] truncate" title={record.agency}>
                      {record.agency}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{new Date(record.importDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-gray-800 font-semibold whitespace-nowrap">{record.totalAmount} VND</td>
                  <td className="px-4 py-3 text-gray-800 hidden md:table-cell">
                    <div className="max-w-[120px] truncate" title={record.creator}>
                      {record.creator}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden lg:table-cell">{new Date(record.createdDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden xl:table-cell">{new Date(record.updatedDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Link
                        to={`/import/view/${record.id}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        Xem
                      </Link>
                      <Link
                        to={`/import/edit/${record.id}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                        <span className="sm:hidden">Sửa</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(record)}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Xóa
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
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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
    </DashboardLayout>
  );
};

export default ImportManagementPage;