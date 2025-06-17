import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface ExportItem {
  code: string;
  agency: string;
  exportDate: string;
  totalAmount: number;
  creator: string;
  createdDate: string;
  updatedDate: string;
}

const ExportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExportItem | null>(null);

  const [exportItems, setExportItems] = useState<ExportItem[]>([
  {
    code: 'PX001',
    agency: 'Đại lý A',
    exportDate: '2024-01-15',
    totalAmount: 18500000,
    creator: 'Nguyễn Văn A',
    createdDate: '2024-01-15',
    updatedDate: '2024-01-15',
  },
  {
    code: 'PX002',
    agency: 'Đại lý B',
    exportDate: '2024-01-14',
    totalAmount: 25700000,
    creator: 'Trần Thị B',
    createdDate: '2024-01-14',
    updatedDate: '2024-01-14',
  },
  ]);

  // Filter logic
  const filteredItems = exportItems.filter(item => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAgency = selectedAgency === 'all' || item.agency === selectedAgency;
    
    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true;
      const itemDate = new Date(item.exportDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) return itemDate >= start && itemDate <= end;
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    })();

    return matchesSearch && matchesAgency && matchesDateRange;
  });

  const handleDeleteClick = (item: ExportItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from local state
        setExportItems(exportItems.filter(item => item.code !== itemToDelete.code));
        
        // Close modal and reset
        setShowDeleteModal(false);
        setItemToDelete(null);
        
        alert(`Đã xóa phiếu xuất ${itemToDelete.code} thành công!`);
      } catch (error) {
        console.error('Error deleting export item:', error);
        alert('Có lỗi xảy ra khi xóa phiếu xuất!');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">Quản lý xuất hàng</h1>
          <Link
            to="/export/add"
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Tạo phiếu xuất</span>
            <span className="sm:hidden">Thêm</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm phiếu xuất..."
            className="flex-1 min-w-[220px] px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold whitespace-nowrap"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
          >
            <option value="all">Tất cả đại lý</option>
            <option value="Đại lý A">Đại lý A</option>
            <option value="Đại lý B">Đại lý B</option>
          </select>
          <input
            type="date"
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg whitespace-nowrap"
            placeholder="Từ ngày"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg whitespace-nowrap"
            placeholder="Đến ngày"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 drop-shadow">Danh sách phiếu xuất</h2>
        
        {/* Export Items Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
          <table className="min-w-full bg-white border border-blue-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Mã phiếu xuất</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[150px]">Đại lý</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[100px]">Ngày xuất</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Tổng tiền</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[100px] hidden md:table-cell">Người tạo</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[100px] hidden lg:table-cell">Ngày tạo</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[100px] hidden xl:table-cell">Cập nhật</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredItems.map((item) => (
                <tr key={item.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{item.code}</td>
                  <td className="px-6 py-4 text-gray-900">
                    <div className="max-w-[150px] truncate" title={item.agency}>
                      {item.agency}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{new Date(item.exportDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-gray-700 font-semibold whitespace-nowrap">{item.totalAmount.toLocaleString('vi-VN')} VND</td>
                  <td className="px-6 py-4 text-gray-700 hidden md:table-cell">
                    <div className="max-w-[120px] truncate" title={item.creator}>
                      {item.creator}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap hidden lg:table-cell">{new Date(item.createdDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap hidden xl:table-cell">{new Date(item.updatedDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Link
                        to={`/export/detail/${item.code}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        Xem
                      </Link>
                      <Link
                        to={`/export/edit/${item.code}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                        <span className="sm:hidden">Sửa</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(item)}
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

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không tìm thấy phiếu xuất nào.</p>
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa phiếu xuất</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa phiếu xuất <strong>{itemToDelete?.code}</strong>?
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
                    Xóa phiếu xuất
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

export default ExportPage;