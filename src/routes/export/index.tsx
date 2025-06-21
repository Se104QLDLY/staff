import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loading } from '../../components/common';

interface ExportItem {
  code: string;
  agency: string;
  exportDate: string;
  totalAmount: number;
  creator: string;
  createdDate: string;
  updatedDate: string;
  status?: 'pending' | 'confirmed'; // Thêm trạng thái xác nhận
}

interface ExportRequest {
  code: string;
  agency: string;
  exportDate: string;
  totalAmount: number;
  creator: string;
}

const ExportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExportItem | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [exportItems, setExportItems] = useState<ExportItem[]>([
    {
      code: 'PX001',
      agency: 'Đại lý A',
      exportDate: '2024-01-15',
      totalAmount: 18500000,
      creator: 'Nguyễn Văn A',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-15',
      status: 'pending', // Chưa xác nhận
    },
    {
      code: 'PX002',
      agency: 'Đại lý B',
      exportDate: '2024-01-14',
      totalAmount: 25700000,
      creator: 'Trần Thị B',
      createdDate: '2024-01-14',
      updatedDate: '2024-01-14',
      status: 'confirmed', // Đã xác nhận
    },
  ]);

  // Danh sách yêu cầu xuất hàng (pending)
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([
    {
      code: 'YEUCAU001',
      agency: 'Đại lý C',
      exportDate: '2024-01-20',
      totalAmount: 9900000,
      creator: 'Nguyễn Văn C',
    },
    {
      code: 'YEUCAU002',
      agency: 'Đại lý D',
      exportDate: '2024-01-21',
      totalAmount: 12300000,
      creator: 'Trần Thị D',
    },
  ]);

  // Danh sách yêu cầu đã xác nhận nhưng chưa lập phiếu xuất
  const [confirmedRequests, setConfirmedRequests] = useState<ExportRequest[]>([]);

  // State lưu trạng thái kiểm tra tồn kho cho từng yêu cầu
  const [stockCheck, setStockCheck] = useState<Record<string, 'not_checked' | 'in_stock' | 'out_of_stock' | 'checking'>>({});

  // State lưu chi tiết tồn kho cho từng yêu cầu
  const [stockDetails, setStockDetails] = useState<Record<string, {
    items: Array<{
      name: string;
      requested: number;
      available: number;
      status: 'sufficient' | 'insufficient';
    }>;
    overallStatus: 'sufficient' | 'insufficient';
  }>>({});

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

  // Khi xác nhận yêu cầu xuất hàng
  const handleConfirmRequest = (code: string) => {
    const stockDetail = stockDetails[code];
    if (stockDetail && stockDetail.overallStatus === 'sufficient') {
      const req = exportRequests.find(r => r.code === code);
      if (req) {
        setConfirmedRequests(list => [req, ...list]);
        setExportRequests(requests => requests.filter(r => r.code !== code));
        // Xóa thông tin kiểm tra tồn kho
        setStockCheck(prev => {
          const newState = { ...prev };
          delete newState[code];
          return newState;
        });
        setStockDetails(prev => {
          const newState = { ...prev };
          delete newState[code];
          return newState;
        });
      }
    }
  };

  // Khi lập phiếu xuất từ yêu cầu đã xác nhận
  const handleCreateExportFromRequest = (code: string) => {
    const req = confirmedRequests.find(r => r.code === code);
    if (req) {
      setExportItems(items => [
        {
          code: req.code.replace('YEUCAU', 'PX'),
          agency: req.agency,
          exportDate: req.exportDate,
          totalAmount: 0, // hoặc nhập số tiền khi lập phiếu
          creator: '', // hoặc nhập người tạo khi lập phiếu
          createdDate: req.exportDate,
          updatedDate: req.exportDate,
          status: 'confirmed',
        },
        ...items
      ]);
      setConfirmedRequests(list => list.filter(r => r.code !== code));
    }
  };

  // Khi từ chối yêu cầu xuất hàng
  const handlePostponeRequest = (code: string) => {
    const req = exportRequests.find(r => r.code === code);
    if (req) {
      // Có thể lưu vào danh sách tạm hoãn hoặc xóa khỏi danh sách yêu cầu
      setExportRequests(requests => requests.filter(r => r.code !== code));
      // Xóa thông tin kiểm tra tồn kho
      setStockCheck(prev => {
        const newState = { ...prev };
        delete newState[code];
        return newState;
      });
      setStockDetails(prev => {
        const newState = { ...prev };
        delete newState[code];
        return newState;
      });
    }
  };

  // Hàm kiểm tra tồn kho (random, có loading)
  const handleCheckStock = (code: string) => {
    setStockCheck(prev => ({
      ...prev,
      [code]: 'checking',
    }));
    
    setTimeout(() => {
      // Mock data cho chi tiết tồn kho - thực tế hơn
      const mockItems = [
        { name: 'Laptop Dell Inspiron 15', requested: 5, available: Math.floor(Math.random() * 10) + 1 },
        { name: 'Chuột không dây Logitech', requested: 20, available: Math.floor(Math.random() * 30) + 5 },
        { name: 'Bàn phím cơ Gaming', requested: 8, available: Math.floor(Math.random() * 15) + 2 },
        { name: 'Màn hình 24 inch', requested: 3, available: Math.floor(Math.random() * 8) + 1 },
        { name: 'USB 3.0 32GB', requested: 15, available: Math.floor(Math.random() * 25) + 3 },
      ];
      
      // Cập nhật status cho từng item - logic chính xác hơn
      const updatedItems = mockItems.map(item => ({
        ...item,
        status: item.requested <= item.available ? 'sufficient' as const : 'insufficient' as const
      }));
      
      // Tính toán trạng thái tổng thể - chỉ đủ khi TẤT CẢ items đều đủ
      const overallStatus = updatedItems.every(item => item.status === 'sufficient') ? 'sufficient' as const : 'insufficient' as const;
      
      setStockDetails(prev => ({
        ...prev,
        [code]: {
          items: updatedItems,
          overallStatus
        }
      }));
      
      setStockCheck(prev => ({
        ...prev,
        [code]: overallStatus === 'sufficient' ? 'in_stock' : 'out_of_stock',
      }));
    }, 1500); // Tăng thời gian loading để thực tế hơn
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">Quản lý xuất hàng</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
            >
              Xác nhận các đại lý
            </button>
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
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[100px]">Ngày lập phiếu</th>
                <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Tổng tiền</th>
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

        {/* Modal xác nhận yêu cầu xuất hàng */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-blue-800 mb-2">Yêu cầu xuất hàng từ đại lý</h2>
                <p className="text-gray-600 mb-4">Danh sách các đại lý gửi yêu cầu xuất hàng, xác nhận để lập phiếu xuất.</p>
              </div>
              <table className="min-w-full bg-white border border-blue-200 mb-4">
                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                  <tr className="uppercase text-sm">
                    <th className="px-4 py-2">Mã yêu cầu</th>
                    <th className="px-4 py-2">Đại lý</th>
                    <th className="px-4 py-2">Ngày yêu cầu</th>
                    <th className="px-4 py-2">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {exportRequests.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-500">Không có yêu cầu nào.</td></tr>
                  ) : exportRequests.map(req => (
                    <tr key={req.code} className="border-b hover:bg-blue-50">
                      <td className="px-4 py-2 font-semibold">{req.code}</td>
                      <td className="px-4 py-2">{req.agency}</td>
                      <td className="px-4 py-2">{req.exportDate}</td>
                      <td className="px-4 py-2">
                        {/* Nếu chưa kiểm tra tồn kho */}
                        {(!stockCheck[req.code] || stockCheck[req.code] === 'not_checked') && (
                          <button
                            onClick={() => handleCheckStock(req.code)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
                          >
                            Kiểm tra tồn kho
                          </button>
                        )}
                        {/* Loading khi đang kiểm tra tồn kho */}
                        {stockCheck[req.code] === 'checking' && (
                          <div className="flex items-center gap-2">
                            <Loading size="sm" text="Đang kiểm tra..." />
                          </div>
                        )}
                        {/* Nếu đã kiểm tra - hiển thị chi tiết và 2 button */}
                        {(stockCheck[req.code] === 'in_stock' || stockCheck[req.code] === 'out_of_stock') && (
                          <div className="space-y-2">
                            {/* Chi tiết tồn kho */}
                            {stockDetails[req.code] && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                  <span>Chi tiết tồn kho:</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    stockDetails[req.code]?.overallStatus === 'sufficient' 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {stockDetails[req.code]?.overallStatus === 'sufficient' ? 'ĐỦ TỒN KHO' : 'THIẾU TỒN KHO'}
                                  </span>
                                </h4>
                                <div className="space-y-2">
                                  {stockDetails[req.code]?.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs p-2 bg-white rounded border">
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate" title={item.name}>
                                          {item.name}
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                          Yêu cầu: {item.requested} | Có sẵn: {item.available}
                                        </div>
                                      </div>
                                      <div className="ml-2 flex items-center gap-1">
                                        <span className={`font-bold ${
                                          item.status === 'sufficient' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {item.requested}/{item.available}
                                        </span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                          item.status === 'sufficient' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                          {item.status === 'sufficient' ? '✓' : '✗'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 p-2 bg-white rounded border">
                                  <div className="text-xs font-semibold text-gray-700 mb-1">Tóm tắt:</div>
                                  <div className={`text-xs font-bold ${
                                    stockDetails[req.code]?.overallStatus === 'sufficient' ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {stockDetails[req.code]?.overallStatus === 'sufficient' 
                                      ? '✓ Tất cả mặt hàng đều đủ tồn kho - Có thể xác nhận xuất hàng' 
                                      : '✗ Một số mặt hàng thiếu tồn kho - Chỉ có thể tạm hoãn'
                                    }
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* 2 button Xác nhận và Tạm hoãn */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConfirmRequest(req.code)}
                                disabled={stockCheck[req.code] === 'out_of_stock'}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                  stockCheck[req.code] === 'in_stock'
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transform hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                }`}
                                title={
                                  stockCheck[req.code] === 'in_stock' 
                                    ? 'Xác nhận xuất hàng - Tất cả mặt hàng đều đủ tồn kho' 
                                    : 'Không thể xác nhận - Một số mặt hàng thiếu tồn kho'
                                }
                              >
                                <div className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Xác nhận
                                </div>
                              </button>
                              <button
                                onClick={() => handlePostponeRequest(req.code)}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                title="Tạm hoãn yêu cầu xuất hàng"
                              >
                                <div className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Tạm hoãn
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Danh sách yêu cầu đã xác nhận nhưng chưa lập phiếu xuất */}
              {confirmedRequests.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-blue-700 mt-6 mb-2">Yêu cầu đã xác nhận</h3>
                  <table className="min-w-full bg-white border border-blue-200 mb-4">
                    <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                      <tr className="uppercase text-sm">
                        <th className="px-4 py-2">Mã yêu cầu</th>
                        <th className="px-4 py-2">Đại lý</th>
                        <th className="px-4 py-2">Ngày yêu cầu</th>
                        <th className="px-4 py-2">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmedRequests.map(req => (
                        <tr key={req.code} className="border-b hover:bg-blue-50">
                          <td className="px-4 py-2 font-semibold">{req.code}</td>
                          <td className="px-4 py-2">{req.agency}</td>
                          <td className="px-4 py-2">{req.exportDate}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleCreateExportFromRequest(req.code)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                              Lập phiếu xuất
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <button
                onClick={() => setShowRequestModal(false)}
                className="mt-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExportPage;