import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loading } from '../../components/common';
import { Truck, ListChecks, DollarSign, BadgeAlert, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';
import { getIssues, deleteIssue, updateIssueStatus, getIssueById, getItemById } from '../../api/export.api';
import type { Issue } from '../../api/export.api';
import { useAuth } from '../../hooks/useAuth';
import { fetchAssignedAgencies } from '../../api/staffAgency.api';
import { useInventory } from '../../context/InventoryContext';

interface ExportItem {
  id: number;
  code: string;
  agency: string;
  exportDate: string;
  totalAmount: number;
  creator: string;
  createdDate: string;
  updatedDate: string;
  status?: 'pending' | 'confirmed' | 'delivered'; // Thêm trạng thái xác nhận
}

interface ExportRequest {
  id: number;
  code: string;
  agency: string;
  exportDate: string;
  totalAmount: number;
  creator: string;
}

interface AssignedAgency {
  agency_id: number;
  agency_name: string;
}

const ExportPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshInventory } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ExportItem | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [exportItems, setExportItems] = useState<ExportItem[]>([]);

  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);

  const [assignedAgencies, setAssignedAgencies] = useState<AssignedAgency[]>([]);

  const [stockCheck, setStockCheck] = useState<Record<string, 'not_checked' | 'in_stock' | 'out_of_stock' | 'checking'>>({});

  const [stockDetails, setStockDetails] = useState<Record<string, {
    items: Array<{
      name: string;
      requested: number;
      available: number;
      status: 'sufficient' | 'insufficient';
    }>;
    overallStatus: 'sufficient' | 'insufficient';
  }>>({});

  useEffect(() => {
    const loadIssues = async () => {
      if (!user) return;
      
      // Staff chỉ có thể truy cập agency được phân công qua StaffAgency
      const assigned = await fetchAssignedAgencies(user.id);
      const agencyIds = assigned.map(a => a.agency_id);
      const agencyList = assigned.map(a => ({agency_id: a.agency_id, agency_name: a.agency_name}));
      setAssignedAgencies(agencyList);
      
      try {
        // Lọc các issue từ các agency đã phân công: processing, confirmed, delivered
        let allResults: Issue[] = [];
        if (agencyIds.length > 0) {
          const responses = await Promise.all(
            agencyIds.map(id => getIssues({ agency_id: id }))
          );
          allResults = responses.flatMap(r => r.results);
        }
        const pendingIssues = allResults.filter(issue => issue.status === 'processing');
        const confirmedIssues = allResults.filter(issue => issue.status === 'confirmed' || issue.status === 'delivered');
        
        // Map sang frontend shape với tính lại total từ details - tất cả từ bảng issue
        const mappedPending = pendingIssues.map(issue => {
          // Tính lại total từ details để đảm bảo đúng
          const calculatedTotal = issue.details 
            ? issue.details.reduce((sum, detail) => sum + (Number(detail.quantity) * Number(detail.unit_price)), 0)
            : Number(issue.total_amount);
          
          return {
            id: issue.issue_id,
            code: `PX${issue.issue_id.toString().padStart(3, '0')}`,
            agency: issue.agency_name || 'Unknown Agency',
            exportDate: issue.issue_date,
            totalAmount: calculatedTotal,
            creator: issue.user_name || 'Unknown User',
            createdDate: issue.created_at,
            updatedDate: issue.created_at,
            status: 'pending' as const,
          };
        });
        
        const mappedConfirmed = confirmedIssues.map(issue => {
          // Tính lại total từ details để đảm bảo đúng
          const calculatedTotal = issue.details 
            ? issue.details.reduce((sum, detail) => sum + (Number(detail.quantity) * Number(detail.unit_price)), 0)
            : Number(issue.total_amount);
          
          return {
            id: issue.issue_id,
            code: `PX${issue.issue_id.toString().padStart(3, '0')}`,
            agency: issue.agency_name || 'Unknown Agency',
            exportDate: issue.issue_date,
            totalAmount: calculatedTotal,
            creator: issue.user_name || 'Unknown User',
            createdDate: issue.created_at,
            updatedDate: issue.created_at,
            status: issue.status === 'delivered' ? 'delivered' as const : 'confirmed' as const,
          };
        });
        
        // Đồng bộ hoàn toàn với trang chi tiết: chỉ dùng dữ liệu từ bảng issue
        setExportItems(mappedConfirmed);
        setExportRequests(mappedPending);
        
        // Chỉ set assignedAgencies nếu đã có agencyList từ API
        // Không tạo uniqueAgencies từ all items để tránh staff thấy agency không được phân công
        if (agencyList.length > 0) {
          setAssignedAgencies(agencyList);
        } else {
          // Staff chưa được assign agency nào - hiển thị danh sách rỗng
          setAssignedAgencies([]);
        }
      } catch (error) {
        console.error('Error loading export page data:', error);
      }
    };
    loadIssues();
  }, [user]);

  // Filter logic
  const filteredItems = exportItems.filter(item => {
    // Hiển thị mọi phiếu (processing và confirmed)
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

  // Filter logic cho exportRequests
  const filteredRequests = exportRequests.filter(req => {
    const matchesSearch = 
      req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgency = selectedAgency === 'all' || req.agency === selectedAgency;
    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true;
      const itemDate = new Date(req.exportDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return itemDate >= start && itemDate <= end;
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    })();
    return matchesSearch && matchesAgency && matchesDateRange;
  });

  // Thống kê
  const totalExports = filteredItems.length;
  const totalAmount = filteredItems.reduce((sum, r) => sum + r.totalAmount, 0);

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAgency, startDate, endDate]);

  const handleDeleteClick = (item: ExportItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteIssue(itemToDelete.id);
        
        setExportItems(exportItems.filter(item => item.id !== itemToDelete.id));
        
        // Refresh inventory to update stock quantities
        refreshInventory();
        
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
  const handleConfirmRequest = async (id: number) => {
    const req = exportRequests.find(r => r.id === id);
    if (!req) return;
    try {
      // Cập nhật issue status thành 'confirmed' - chờ agency xác nhận nhận hàng
      await updateIssueStatus(id, 'confirmed', 'Đã xác nhận xuất hàng - chờ đại lý nhận hàng');
      
      // Cập nhật UI: chuyển từ requests sang exportItems
      const issueDetail = await getIssueById(req.id);
      if (!issueDetail) {
        alert('Không tìm thấy chi tiết phiếu xuất.');
        return;
      }
      
      // Tính lại total từ details
      const calculatedTotal = issueDetail.details 
        ? issueDetail.details.reduce((sum, detail) => sum + (Number(detail.quantity) * Number(detail.unit_price)), 0)
        : Number(issueDetail.total_amount);
      
      const newExportItem: ExportItem = {
        id: issueDetail.issue_id,
        code: `PX${issueDetail.issue_id.toString().padStart(3, '0')}`,
        agency: issueDetail.agency_name || 'Unknown Agency',
        exportDate: issueDetail.issue_date,
        totalAmount: calculatedTotal,
        creator: issueDetail.user_name || 'Unknown User',
        createdDate: issueDetail.created_at,
        updatedDate: issueDetail.created_at,
        status: 'confirmed' as const, // Đã xác nhận bởi staff - chờ agency nhận hàng
      };
      
      // Cập nhật state
      setExportItems(prev => [...prev, newExportItem]);
      setExportRequests(prev => prev.filter(r => r.id !== id));
      
      // Refresh inventory data to update stock quantities
      refreshInventory();
      
      alert(`Đã lập phiếu xuất ${newExportItem.code} thành công! Chờ đại lý xác nhận.`);
    } catch (error: any) {
      console.error('Error confirming issue:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Có lỗi khi lập phiếu xuất: ${errMsg}`);
    }
  };

  // Khi từ chối/tạm hoãn yêu cầu xuất hàng
  const handlePostponeRequest = async (id: number) => {
    try {
      const req = exportRequests.find(r => r.id === id);
      if (!req) return;
      
      // Update status to 'postponed' on server
      await updateIssueStatus(id, 'postponed', 'Tạm hoãn do không đủ tồn kho hoặc lý do khác');
      
      // Remove from pending requests
      setExportRequests(prev => prev.filter(r => r.id !== id));
      
      // Clear stock check data
      setStockCheck(prev => {
        const newState = { ...prev };
        delete newState[req.code];
        return newState;
      });
      setStockDetails(prev => {
        const newState = { ...prev };
        delete newState[req.code];
        return newState;
      });
      
      alert(`Đã tạm hoãn yêu cầu xuất hàng ${req.code}.`);
    } catch (error: any) {
      console.error('Error postponing request:', error);
      let errorMessage = 'Có lỗi xảy ra khi tạm hoãn yêu cầu!';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
    }
  };

  // Real stock check using backend API
  const handleCheckStock = async (code: string) => {
    setStockCheck(prev => ({ ...prev, [code]: 'checking' }));
    
    try {
      // Find the request
      const req = exportRequests.find(r => r.code === code);
      if (!req) {
        throw new Error('Request not found');
      }
      
      // Get detailed issue information including items
      const issueDetail = await getIssueById(req.id);
      
      if (!issueDetail.details || issueDetail.details.length === 0) {
        throw new Error('No items found in this request');
      }
      
      // Check stock for each item
      const stockPromises = issueDetail.details.map(async (detail) => {
        const item = await getItemById(detail.item);
        return {
          name: item.item_name,
          requested: detail.quantity,
          available: item.stock_quantity,
          status: item.stock_quantity >= detail.quantity ? 'sufficient' as const : 'insufficient' as const
        };
      });
      
      const stockResults = await Promise.all(stockPromises);
      const overallStatus = stockResults.every(item => item.status === 'sufficient') ? 'sufficient' : 'insufficient';
      
      // Update stock details
      setStockDetails(prev => ({
        ...prev,
        [code]: {
          items: stockResults,
          overallStatus
        }
      }));
      
      // Update stock check status
      setStockCheck(prev => ({
        ...prev,
        [code]: overallStatus === 'sufficient' ? 'in_stock' : 'out_of_stock'
      }));
      
    } catch (error: any) {
      console.error('Error checking stock:', error);
      setStockCheck(prev => ({ ...prev, [code]: 'not_checked' }));
      alert('Có lỗi xảy ra khi kiểm tra tồn kho. Vui lòng thử lại.');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Quản lý Xuất hàng</h1>
            <p className="text-blue-600 text-base mt-1">Theo dõi và quản lý các phiếu xuất hàng của đại lý.</p>
          </div>
        </div>
        {/* Card thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 flex items-center gap-5">
            <div className="bg-blue-100 p-3 rounded-full">
              <ListChecks className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-500 font-semibold">Tổng phiếu xuất</h3>
              <p className="text-3xl font-bold text-gray-800">{totalExports}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 flex items-center gap-5">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-500 font-semibold">Tổng số tiền</h3>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">{(totalAmount/1000000).toFixed(2)}M</p>
            </div>
          </div>
        </div>
        {/* Card chứa nội dung cũ */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
          <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
            <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide flex items-center gap-2">
              <Truck className="h-7 w-7 text-blue-500 mr-2" /> Quản lý xuất hàng
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold text-lg shadow-lg whitespace-nowrap flex items-center gap-2"
              >
                <BadgeAlert className="h-5 w-5" /> Xác nhận yêu cầu phân phối
              </button>
              <Link
                to="/export/add"
                className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:scale-105 hover:shadow-xl transition-all font-bold text-lg shadow-lg whitespace-nowrap border-2 border-blue-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Tạo phiếu xuất
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
              {assignedAgencies.map((agency) => (
                <option key={agency.agency_name} value={agency.agency_name}>
                  {agency.agency_name}
                </option>
              ))}
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
          
          {/* Thông báo khi chưa được phân công agency */}
          {assignedAgencies.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Chưa được phân công quản lý đại lý
                  </h3>
                  <p className="text-yellow-700 mt-1">
                    Bạn chưa được phân công quản lý đại lý nào. Vui lòng liên hệ quản trị viên để được cấp quyền truy cập.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-extrabold text-blue-800 mb-6 drop-shadow flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-blue-500" /> Danh sách phiếu xuất
          </h2>
          {/* Export Items Table */}
          <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
            <table className="min-w-full bg-white border border-blue-200">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                <tr className="uppercase text-sm">
                  <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Mã phiếu xuất</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap min-w-[150px]">Đại lý</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap min-w-[100px]">Ngày lập phiếu</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Tổng tiền</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Trạng thái</th>
                  <th className="px-6 py-3 text-left whitespace-nowrap min-w-[120px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {currentItems.map((item) => (
                  <tr key={item.code} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-400" /> {item.code}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="max-w-[150px] truncate" title={item.agency}>
                        {item.agency}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{new Date(item.exportDate).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-green-700 font-bold whitespace-nowrap">{item.totalAmount.toLocaleString('vi-VN')} VND</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'delivered' ? (
                        <span className="text-green-600 font-semibold">Đã giao hàng</span>
                      ) : item.status === 'confirmed' ? (
                        <span className="text-blue-600 font-semibold">Đã xác nhận</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Đang xử lý</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Link
                          to={`/export/detail/${item.id}`}
                          className="px-2 sm:px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center whitespace-nowrap flex items-center gap-1"
                        >
                          <ListChecks className="h-4 w-4" /> Xem
                        </Link>
                        <Link
                          to={`/export/edit/${item.id}`}
                          className="px-2 sm:px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center whitespace-nowrap flex items-center gap-1"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span className="hidden sm:inline">Chỉnh sửa</span>
                          <span className="sm:hidden">Sửa</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(item)}
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
          
          {/* Phân trang */}
          {filteredItems.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-600">
                Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredItems.length)} trong tổng số {filteredItems.length} phiếu xuất
              </div>
              <nav className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1} 
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                  if (pageNum > totalPages) return null;
                  return (
                    <button 
                      key={pageNum} 
                      onClick={() => handlePageChange(pageNum)} 
                      className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                        currentPage === pageNum 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                  disabled={currentPage === totalPages} 
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Tiếp
                </button>
              </nav>
            </div>
          )}
          
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
                    <Trash2 className="h-6 w-6 text-red-600" />
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
                  <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center gap-2"><BadgeAlert className="h-6 w-6 text-orange-500" /> Yêu cầu xuất hàng từ đại lý</h2>
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
                    {filteredRequests.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-4 text-gray-500">Không có yêu cầu nào.</td></tr>
                    ) : filteredRequests.map(req => (
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
                                  onClick={() => handleConfirmRequest(req.id)}
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
                                  onClick={() => handlePostponeRequest(req.id)}
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
      </div>
    </DashboardLayout>
  );
};

export default ExportPage;