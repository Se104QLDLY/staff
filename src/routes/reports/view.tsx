import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';
import { 
  FileText, User, Calendar, BadgeCheck, Layers, ArrowLeft, DollarSign, 
  Info, ClipboardList, CheckCircle, AlertCircle, TrendingUp, TrendingDown,
  Package, FileSpreadsheet, Loader2 
} from 'lucide-react';
import { getReportDetail, exportReportExcel, exportReportPDF, type ReportDetail, type SalesData, type DebtData, type InventoryData } from '../../api/report.api';
import toast from 'react-hot-toast';

const ViewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<{ excel: boolean; pdf: boolean }>({ excel: false, pdf: false });

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError('ID báo cáo không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const reportId = parseInt(id.replace(/[^0-9]/g, ''));
        if (isNaN(reportId)) {
          setError('ID báo cáo không hợp lệ');
          setLoading(false);
          return;
        }

        const reportData = await getReportDetail(reportId);
        setReport(reportData);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Không thể tải báo cáo. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleExportExcel = async () => {
    if (!report) return;
    
    try {
      setExportLoading(prev => ({ ...prev, excel: true }));
      const blob = await exportReportExcel(report.report_id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${report.report_type}-${report.report_id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công!');
    } catch (err) {
      console.error('Export Excel error:', err);
      toast.error('Không thể xuất Excel. Vui lòng thử lại.');
    } finally {
      setExportLoading(prev => ({ ...prev, excel: false }));
    }
  };

  const handleExportPDF = async () => {
    if (!report) return;
    
    try {
      setExportLoading(prev => ({ ...prev, pdf: true }));
      const blob = await exportReportPDF(report.report_id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${report.report_type}-${report.report_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất PDF thành công!');
    } catch (err) {
      console.error('Export PDF error:', err);
      toast.error('Không thể xuất PDF. Vui lòng thử lại.');
    } finally {
      setExportLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sales':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg"><TrendingUp className="h-4 w-4"/>Doanh số</span>;
      case 'debt':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg"><TrendingDown className="h-4 w-4"/>Công nợ</span>;
      case 'inventory':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg"><Package className="h-4 w-4"/>Tồn kho</span>;
      default:
        return null;
    }
  };

  const getReportTitle = (type: string) => {
    switch (type) {
      case 'sales': return 'Báo cáo doanh số';
      case 'debt': return 'Báo cáo công nợ';
      case 'inventory': return 'Báo cáo tồn kho';
      default: return 'Báo cáo';
    }
  };

  const renderSalesData = (salesData: SalesData[]) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-green-600"/>Chi tiết doanh số theo đại lý
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Mã đại lý</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Tên đại lý</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Tổng doanh số</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Số phiếu xuất</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.map((item, index) => (
              <tr key={index} className="hover:bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">DL{item.agency_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.agency_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-700">{formatCurrency(item.total_sales)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.total_issues}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-green-100">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-sm font-bold text-green-800">TỔNG CỘNG</td>
              <td className="px-6 py-4 text-sm text-right font-bold text-green-800">
                {formatCurrency(salesData.reduce((sum, item) => sum + item.total_sales, 0))}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-green-800">
                {salesData.reduce((sum, item) => sum + item.total_issues, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const renderDebtData = (debtData: DebtData[]) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <TrendingDown className="h-5 w-5 text-red-600"/>Chi tiết công nợ theo đại lý
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Mã đại lý</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">Tên đại lý</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Phát sinh</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-red-700 uppercase tracking-wider">Thanh toán</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {debtData.map((item, index) => (
              <tr key={index} className="hover:bg-red-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">DL{item.agency_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.agency_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">{formatCurrency(item.debt_incurred)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">{formatCurrency(item.debt_paid)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-red-100">
            <tr>
              <td colSpan={2} className="px-6 py-4 text-sm font-bold text-red-800">TỔNG CỘNG</td>
              <td className="px-6 py-4 text-sm text-right font-bold text-red-800">
                {formatCurrency(debtData.reduce((sum, item) => sum + item.debt_incurred, 0))}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-red-800">
                {formatCurrency(debtData.reduce((sum, item) => sum + item.debt_paid, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const renderInventoryData = (inventoryData: InventoryData[], totalValue: number) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-600"/>Chi tiết hàng tồn kho
      </h2>
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <p className="text-blue-800 font-semibold">
          Tổng số mặt hàng có tồn kho: <span className="text-xl font-bold">{inventoryData.length}</span> | 
          Tổng giá trị tồn kho: <span className="text-xl font-bold">{formatCurrency(totalValue)}</span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Mã hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Tên hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Đơn vị</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Số lượng tồn</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Đơn giá</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryData.map((item, index) => (
              <tr key={index} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">SP{item.item_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unit_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.stock_quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(item.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-blue-700">{formatCurrency(item.total_value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOldSalesData = (oldData: any) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-green-600"/>Thông tin doanh số (Format cũ)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Tháng</h3>
          <p className="text-2xl font-bold text-green-900">{oldData.month}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Tổng doanh số</h3>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(oldData.total_sales)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Đại lý hàng đầu</h3>
          <p className="text-2xl font-bold text-purple-900">DL{oldData.top_agency_id}</p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 font-semibold">
          ⚠️ Đây là báo cáo với format cũ. Vui lòng tạo báo cáo mới để xem chi tiết đầy đủ.
        </p>
      </div>
    </div>
  );

  const renderGenericOldData = (oldData: any, title: string, icon: React.ReactNode) => (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        {icon}{title} (Format cũ)
      </h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
          {JSON.stringify(oldData, null, 2)}
        </pre>
      </div>
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 font-semibold">
          ⚠️ Đây là báo cáo với format cũ. Vui lòng tạo báo cáo mới để xem chi tiết đầy đủ.
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
          <p className="ml-4 text-xl text-gray-700">Đang tải chi tiết báo cáo...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-center">
          <div>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600">Đã xảy ra lỗi</h1>
            <p className="text-gray-600 mt-2">{error}</p>
            <Link
              to="/reports"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách báo cáo
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-center">
          <div>
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-600">Không tìm thấy báo cáo</h1>
            <Link
              to="/reports"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách báo cáo
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 mb-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-blue-600" />
                <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">
                  {getReportTitle(report.report_type)}
                </h1>
              </div>
              <Link
                to="/reports"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold shadow-md"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                <BadgeCheck className="h-4 w-4" />
                Mã: BC{report.report_id}
              </span>
              {getTypeBadge(report.report_type)}
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200">
                <CheckCircle className="h-4 w-4" />
                Hoàn thành
              </span>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày báo cáo:</span>
                <span className="text-gray-900 font-bold">{new Date(report.report_date).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày tạo:</span>
                <span className="text-gray-900 font-bold">{new Date(report.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Người tạo:</span>
                <span className="text-gray-900 font-bold">ID: {report.created_by}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Loại báo cáo:</span>
                <span className="text-gray-900 font-bold">{getReportTitle(report.report_type)}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-gray-700">Trạng thái:</span>
                <span className="text-emerald-700 font-bold">Hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Chi tiết báo cáo */}
          {/* Sales Report - handle both old and new format */}
          {report.report_type === 'sales' && (
            (report.data.sales && renderSalesData(report.data.sales)) ||
            (Array.isArray(report.data) && renderSalesData(report.data)) ||
            (report.data.month && renderOldSalesData(report.data)) ||
            renderGenericOldData(report.data, 'Báo cáo doanh số', <TrendingUp className="h-5 w-5 text-green-600"/>)
          )}
          {/* Debt Report - handle both old and new format */}
          {report.report_type === 'debt' && (
            (report.data.summary && renderDebtData(report.data.summary)) ||
            (Array.isArray(report.data) && renderDebtData(report.data)) ||
            renderGenericOldData(report.data, 'Báo cáo công nợ', <TrendingDown className="h-5 w-5 text-red-600"/>)
          )}
          {/* Inventory Report - handle both old and new format */}
          {report.report_type === 'inventory' && (
            (report.data.items && renderInventoryData(report.data.items, report.data.total_value || 0)) ||
            (Array.isArray(report.data) && renderInventoryData(report.data, 0)) ||
            renderGenericOldData(report.data, 'Báo cáo tồn kho', <Package className="h-5 w-5 text-blue-600"/>)
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 justify-end">
            <button 
              onClick={handleExportExcel}
              disabled={exportLoading.excel}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {exportLoading.excel ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-5 w-5" />
              )}
              Xuất Excel
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={exportLoading.pdf}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {exportLoading.pdf ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              Xuất PDF
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewReportPage;
