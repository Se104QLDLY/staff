import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { 
  PackagePlus, 
  Eye, 
  Edit3, 
  Trash2, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
  FileText,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { getReceipts, deleteReceipt, type Receipt } from '../../api/receipt.api';
import { getItems } from '../../api/inventory.api';
import type { Item as InventoryItem } from '../../api/inventory.api';

interface ImportRecord {
  id: string;
  importDate: string;
  totalAmount: string;
  agency: string;
  agencyId: number;
  status: string;
  itemCount: number;
}

interface ImportStats {
  totalReceipts: number;
  totalValue: number;
  thisMonthReceipts: number;
  thisMonthValue: number;
  lowStockItems: number;
  totalItems: number;
}

const ImportManagementPage: React.FC = () => {
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<ImportStats>({
    totalReceipts: 0,
    totalValue: 0,
    thisMonthReceipts: 0,
    thisMonthValue: 0,
    lowStockItems: 0,
    totalItems: 0
  });

  const fetchImportData = async () => {
    try {
      setLoading(true);
      
      // Fetch phiếu nhập và inventory items song song
      const [paginatedData, itemsData] = await Promise.all([
        getReceipts({ limit: 100 }),
        getItems()
      ]);

      const data: Receipt[] = paginatedData.results || [];
      setInventoryItems(itemsData);
      
      // Map dữ liệu sang ImportRecord
      const records: ImportRecord[] = data.map(item => ({
        id: item.receipt_id.toString(),
        importDate: item.receipt_date,
        totalAmount: Number(item.total_amount).toLocaleString('vi-VN'),
        agency: item.agency_name || 'Nhà phân phối',
        agencyId: item.agency_id || 0,
        status: item.status || 'Hoàn thành',
        itemCount: item.details?.length || 0
      }));
      
      setImportRecords(records);
      
      // Tính toán thống kê
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthRecords = data.filter(item => {
        const itemDate = new Date(item.receipt_date);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      });
      
      const totalValue = data.reduce((sum, item) => sum + Number(item.total_amount), 0);
      const thisMonthValue = thisMonthRecords.reduce((sum, item) => sum + Number(item.total_amount), 0);
      const lowStockItems = itemsData.filter(item => item.stock_quantity < 10).length;
      
      setStats({
        totalReceipts: data.length,
        totalValue,
        thisMonthReceipts: thisMonthRecords.length,
        thisMonthValue,
        lowStockItems,
        totalItems: itemsData.length
      });
      
    } catch (error) {
      console.error('Error loading import data:', error);
    } finally {
      setLoading(false);
    }
  };
      const thisMonthValue = thisMonthRecords.reduce((sum, item) => sum + Number(item.total_amount), 0);
      const lowStockItems = itemsData.filter(item => item.stock_quantity < 10).length;
      
      setStats({
        totalReceipts: data.length,
        totalValue,
        thisMonthReceipts: thisMonthRecords.length,
        thisMonthValue,
        lowStockItems,
        totalItems: itemsData.length
      });
      
    } catch (error) {
      console.error('Error loading import data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory items for stock display
  useEffect(() => {
    fetchImportData();
  }, []);

  // Filter records based on search and status
  const filteredRecords = importRecords.filter(record => {
    const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.agency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-700';
      case 'Đang xử lý': return 'bg-yellow-100 text-yellow-700';
      case 'Hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    try {
      setDeleting(true);
      await deleteReceipt(parseInt(receiptId));
      
      // Refresh data after successful deletion
      await fetchImportData();
      
      setShowDeleteModal(false);
      setSelectedReceiptId(null);
    } catch (error) {
      console.error('Error deleting receipt:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                <PackagePlus className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý Nhập hàng</h1>
                <p className="text-gray-600 text-lg">Dashboard tổng quan và quản lý phiếu nhập</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={fetchImportData}
                className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg shadow-gray-200/50 border border-gray-200"
              >
                <RefreshCw size={18} />
                <span>Làm mới</span>
              </button>
              <Link 
                to="/import/add"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-xl shadow-blue-500/30"
              >
                <PackagePlus size={18} />
                <span>Tạo phiếu nhập</span>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Receipts */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/50 border border-blue-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <ArrowUp size={14} />
                  <span>+12%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Tổng phiếu nhập</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalReceipts}</p>
                <p className="text-gray-400 text-xs mt-1">Tất cả thời gian</p>
              </div>
            </div>

            {/* Total Value */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-100/50 border border-green-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <ArrowUp size={14} />
                  <span>+8%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Tổng giá trị</p>
                <p className="text-3xl font-bold text-gray-800">{(stats.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-gray-400 text-xs mt-1">VND</p>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100/50 border border-purple-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <ArrowUp size={14} />
                  <span>+15%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Tháng này</p>
                <p className="text-3xl font-bold text-gray-800">{stats.thisMonthReceipts}</p>
                <p className="text-gray-400 text-xs mt-1">{(stats.thisMonthValue / 1000000).toFixed(1)}M VND</p>
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-100/50 border border-orange-100/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                  <ArrowDown size={14} />
                  <span>-5%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Hàng sắp hết</p>
                <p className="text-3xl font-bold text-gray-800">{stats.lowStockItems}</p>
                <p className="text-gray-400 text-xs mt-1">< 10 sản phẩm</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Create Receipt */}
            <Link 
              to="/import/add"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <PackagePlus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tạo phiếu nhập</h3>
                  <p className="text-blue-100 text-sm">Nhập hàng mới vào kho</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100 text-sm">Nhấn để bắt đầu</span>
                <Activity className="h-5 w-5 opacity-70" />
              </div>
            </Link>

            {/* View Inventory */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-2xl hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Xem tồn kho</h3>
                  <p className="text-green-100 text-sm">Kiểm tra số lượng hàng</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-100 text-sm">{stats.totalItems} sản phẩm</span>
                <BarChart3 className="h-5 w-5 opacity-70" />
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Báo cáo</h3>
                  <p className="text-purple-100 text-sm">Phân tích xu hướng</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-100 text-sm">Xem chi tiết</span>
                <BarChart3 className="h-5 w-5 opacity-70" />
              </div>
            </div>
          </div>

          {/* Recent Receipts */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Phiếu nhập gần đây</h2>
                  <p className="text-gray-600">Quản lý và theo dõi các phiếu nhập</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm phiếu nhập..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Mã phiếu</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày nhập</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nhà cung cấp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Số lượng SP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {importRecords.slice(0, 10).map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">#{record.id}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(record.importDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{record.agency}</td>
                      <td className="px-6 py-4 text-gray-600">{record.itemCount} SP</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">{record.totalAmount} VND</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                          {record.status === 'Hoàn thành' && <CheckCircle size={12} />}
                          {record.status === 'Đang xử lý' && <Clock size={12} />}
                          {record.status === 'Hủy' && <AlertTriangle size={12} />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            to={`/import/view/${record.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link 
                            to={`/import/edit/${record.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedReceiptId(record.id);
                              setShowDeleteModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {importRecords.length > 10 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-sm">
                    Hiển thị 10 trên tổng {importRecords.length} phiếu nhập
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    Xem tất cả →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa phiếu nhập #{selectedReceiptId}? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedReceiptId(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                onClick={() => selectedReceiptId && handleDeleteReceipt(selectedReceiptId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                  Quản lý Nhập hàng
                </h1>
                <p className="text-slate-600 text-lg mt-2 font-medium">
                  Theo dõi tồn kho và lịch sử phiếu nhập một cách thông minh
                </p>
              </div>
            </div>
};

export default ImportManagementPage;
