import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ArrowLeft, Package, Calendar, User, FileText, Edit3, Trash2 } from 'lucide-react';
import { getReceiptById, deleteReceipt, type Receipt } from '../../api/receipt.api';

const ViewImportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const receiptData = await getReceiptById(parseInt(id));
        setReceipt(receiptData);
      } catch (err) {
        setError('Không thể tải thông tin phiếu nhập');
        console.error('Error fetching receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const handleDeleteReceipt = async () => {
    if (!receipt) return;
    
    try {
      setDeleting(true);
      await deleteReceipt(receipt.receipt_id);
      navigate('/import');
    } catch (err) {
      setError('Không thể xóa phiếu nhập');
      console.error('Error deleting receipt:', err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-zinc-600">Đang tải thông tin phiếu nhập...</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !receipt) {
    return (
      <DashboardLayout>
        <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || 'Không tìm thấy phiếu nhập'}</p>
                <Link 
                  to="/import" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Quay lại
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700';
      case 'Đang xử lý': return 'bg-amber-100 text-amber-700';
      case 'Hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Tính tổng số lượng từ details
  const totalQuantity = receipt.details?.reduce((sum: number, detail) => sum + detail.quantity, 0) || 0;

  return (
    <DashboardLayout>
      <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-zinc-800">Chi tiết Phiếu Nhập</h1>
                <p className="text-zinc-500 text-base mt-1">Thông tin chi tiết phiếu nhập mã <span className="font-semibold text-zinc-600">#{receipt.receipt_id}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link 
                to={`/import/edit/${receipt.receipt_id}`}
                className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold gap-2 text-sm shadow-sm hover:shadow-md shadow-blue-500/20"
              >
                <Edit3 size={16} />
                <span>Chỉnh sửa</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold gap-2 text-sm shadow-sm hover:shadow-md shadow-red-500/20"
              >
                <Trash2 size={16} />
                <span>Xóa</span>
              </button>
              <Link 
                to="/import" 
                className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-200 font-semibold gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                <span>Quay lại</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 p-6 mb-8">
            <h2 className="text-xl font-bold text-zinc-800 mb-6">Thông tin chung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Mã phiếu nhập</p>
                  <p className="text-lg font-semibold text-zinc-800">#{receipt.receipt_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Ngày lập phiếu</p>
                  <p className="text-lg font-semibold text-zinc-800">{new Date(receipt.receipt_date).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Người tạo</p>
                  <p className="text-lg font-semibold text-zinc-800">{receipt.user_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">ST</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Trạng thái</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(receipt.status)}`}>
                    {receipt.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 overflow-hidden mb-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-800">Danh sách sản phẩm</h2>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span>Tổng: {totalQuantity.toLocaleString('vi-VN')} sản phẩm</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-blue-900/80 bg-blue-100/60">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-center w-16">STT</th>
                    <th className="px-6 py-4 font-semibold min-w-[200px]">Mặt hàng</th>
                    <th className="px-6 py-4 font-semibold text-center w-28">Số lượng</th>
                    <th className="px-6 py-4 font-semibold w-40">Đơn giá</th>
                    <th className="px-6 py-4 font-semibold text-right w-48">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {receipt.details?.map((detail, idx) => (
                    <tr key={detail.receipt_detail_id} className="hover:bg-zinc-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 text-center font-medium text-zinc-500">{idx + 1}</td>
                      <td className="px-6 py-4 font-semibold text-zinc-800">{detail.item_name}</td>
                      <td className="px-6 py-4 text-center text-zinc-700">{detail.quantity.toLocaleString('vi-VN')}</td>
                      <td className="px-6 py-4 text-zinc-700">{parseFloat(detail.unit_price).toLocaleString('vi-VN')} VND</td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-600">{parseFloat(detail.line_total).toLocaleString('vi-VN')} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Summary Card */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-xl p-6 shadow-lg shadow-blue-500/20">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-sky-100">Tổng cộng</h3>
                  <span className="text-sky-200 font-medium">{receipt.details?.length || 0} sản phẩm</span>
                </div>
                <p className="text-4xl font-bold tracking-tight">
                  {receipt.total_amount.toLocaleString('vi-VN')} <span className="text-2xl font-semibold text-sky-200">VND</span>
                </p>
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <p className="text-sky-100 text-sm">Nhà cung cấp: {receipt.agency_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa phiếu nhập #{receipt.receipt_id}? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteReceipt}
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
};

export default ViewImportPage;