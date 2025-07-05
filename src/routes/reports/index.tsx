import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, FileText, FileSpreadsheet, FilePlus2, Users, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock, User, Eye, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { fetchAssignedAgencies, type AgencyInfo } from '../../api/staffAgency.api';
import { getSalesReport, getDebtReport, type SalesReportItem, type DebtReportData } from '../../api/report.api';

interface Report {
  id: string;
  title: string;
  type: 'Doanh thu' | 'Tồn kho' | 'Công nợ' | 'Hoạt động';
  period: string;
  status: 'Hoàn thành' | 'Đang xử lý' | 'Lỗi';
  creator: string;
  createdDate: string;
  updatedDate: string;
  description?: string;
  amount?: number;
}

const useStaffReports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [topRevenue, setTopRevenue] = useState<{ id: string; name: string; revenue: number }[]>([]);
  const [topDebt, setTopDebt] = useState<{ id: string; name: string; debt: number }[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user) return;
        // Lấy danh sách đại lý nhân viên quản lý
        const agencies: AgencyInfo[] = await fetchAssignedAgencies(user.id);
        if (!agencies.length) {
          setError('Bạn chưa được phân công quản lý đại lý nào.');
          setLoading(false);
          return;
        }

        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        // Fetch song song doanh số và công nợ cho từng đại lý
        const salesPromises = agencies.map(a => getSalesReport({ agency_id: a.agency_id, from: sixMonthsAgo.toISOString().split('T')[0], to: today.toISOString().split('T')[0] }));
        const debtPromises = agencies.map(a => getDebtReport({ agency_id: a.agency_id }));

        const [salesResults, debtResults] = await Promise.all([
          Promise.all(salesPromises),
          Promise.all(debtPromises)
        ]);

        // Tính tổng doanh thu 6 tháng / công nợ hiện tại cho từng đại lý
        const generatedReports: Report[] = [];
        const topRev: { id: string; name: string; revenue: number }[] = [];
        const topDeb: { id: string; name: string; debt: number }[] = [];

        agencies.forEach((agency, idx) => {
          const salesData: SalesReportItem[] = salesResults[idx];
          const debtData: DebtReportData = debtResults[idx];

          const totalRevenue = salesData.reduce((sum, s) => sum + Number(s.total_revenue), 0);
          const totalDebt = Number(debtData.total_debt ?? 0);

          generatedReports.push({
            id: `REV-${agency.agency_id}`,
            title: `Báo cáo doanh thu 6 tháng - ${agency.agency_name}`,
            type: 'Doanh thu',
            period: '6 tháng',
            status: 'Hoàn thành',
            creator: user.full_name || 'Hệ thống',
            createdDate: today.toLocaleDateString('vi-VN'),
            updatedDate: today.toLocaleDateString('vi-VN'),
            amount: totalRevenue
          });

          generatedReports.push({
            id: `DEBT-${agency.agency_id}`,
            title: `Báo cáo công nợ - ${agency.agency_name}`,
            type: 'Công nợ',
            period: today.toLocaleDateString('vi-VN'),
            status: 'Hoàn thành',
            creator: user.full_name || 'Hệ thống',
            createdDate: today.toLocaleDateString('vi-VN'),
            updatedDate: today.toLocaleDateString('vi-VN'),
            amount: totalDebt
          });

          topRev.push({ id: `DL${agency.agency_id}`, name: agency.agency_name, revenue: totalRevenue });
          topDeb.push({ id: `DL${agency.agency_id}`, name: agency.agency_name, debt: totalDebt });
        });

        // Sắp xếp top lists
        topRev.sort((a, b) => b.revenue - a.revenue);
        topDeb.sort((a, b) => b.debt - a.debt);

        setReports(generatedReports);
        setTopRevenue(topRev.slice(0, 5));
        setTopDebt(topDeb.slice(0, 5));
      } catch (err) {
        console.error('Fetch staff reports error', err);
        setError('Không thể tải dữ liệu báo cáo.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  return { reports, topRevenue, topDebt, loading, error };
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + ' VND';

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'Doanh thu':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg"><TrendingUp className="h-4 w-4"/>Doanh thu</span>;
    case 'Công nợ':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg"><TrendingDown className="h-4 w-4"/>Công nợ</span>;
    case 'Tồn kho':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg"><BarChart className="h-4 w-4"/>Tồn kho</span>;
    case 'Hoạt động':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-lg"><Users className="h-4 w-4"/>Hoạt động</span>;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Hoàn thành':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg"><CheckCircle className="h-4 w-4"/>Hoàn thành</span>;
    case 'Đang xử lý':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg"><Clock className="h-4 w-4"/>Đang xử lý</span>;
    case 'Lỗi':
      return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg"><AlertCircle className="h-4 w-4"/>Lỗi</span>;
    default:
      return null;
  }
};

const StaffReportsPage: React.FC = () => {
  const { reports, topRevenue, topDebt, loading, error } = useStaffReports();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
        <p className="ml-4 text-xl text-gray-700">Đang tải dữ liệu báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-center">
        <div>
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600">Đã xảy ra lỗi</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 mb-8 flex flex-col gap-2 items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-2 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 drop-shadow uppercase tracking-wide">LẬP BÁO CÁO</h1>
          <p className="text-gray-600 text-lg text-center max-w-2xl">Tổng hợp, thống kê và quản lý các báo cáo doanh thu, tồn kho, công nợ và hoạt động của đại lý.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100 flex flex-col items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-2"/>
            <h3 className="text-gray-700 font-semibold mb-1">Tổng doanh thu</h3>
            <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(reports.filter(r => r.type === 'Doanh thu').reduce((sum, r) => sum + (r.amount || 0), 0))}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-red-100 flex flex-col items-center">
            <TrendingDown className="h-8 w-8 text-red-600 mb-2"/>
            <h3 className="text-gray-700 font-semibold mb-1">Tổng công nợ</h3>
            <p className="text-2xl font-extrabold text-red-600">{formatCurrency(reports.filter(r => r.type === 'Công nợ').reduce((sum, r) => sum + (r.amount || 0), 0))}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center">
            <FileText className="h-8 w-8 text-blue-600 mb-2"/>
            <h3 className="text-gray-700 font-semibold mb-1">Số lượng báo cáo</h3>
            <p className="text-2xl font-extrabold text-blue-800">{reports.length}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-800 drop-shadow flex items-center gap-2"><FileSpreadsheet className="h-6 w-6 text-blue-600"/>Danh sách báo cáo</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Chức năng đang phát triển')} 
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-base shadow-md"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Xuất Excel
            </button>
            <button 
              onClick={() => alert('Chức năng đang phát triển')} 
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold text-base shadow-md"
            >
              <FileText className="h-5 w-5 mr-2" />
              Xuất PDF
            </button>
            <Link 
              to="/reports/add" 
              className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
            >
              <FilePlus2 className="h-6 w-6 mr-2" />
              Lập báo cáo
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Mã báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Kỳ báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Dữ liệu chính</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Người tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(report.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.type === 'Doanh thu' && <span>Doanh số: {formatCurrency(report.amount || 0)}</span>}
                      {report.type === 'Công nợ' && <span>Số tiền công nợ: {formatCurrency(report.amount || 0)}</span>}
                      {report.type === 'Tồn kho' && <span>Số lượng tồn: {report.amount || 0}</span>}
                      {report.type === 'Hoạt động' && <span>Mô tả: {report.description || '-'}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2"><User className="h-4 w-4 text-blue-400"/>{report.creator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/reports/view/${report.id}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1"><Eye className="h-4 w-4"/>Xem chi tiết</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Thêm 2 card thống kê dưới danh sách báo cáo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Hàng 1: Doanh số */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-600"/>Danh sách đại lý có doanh số cao nhất</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">MÃ ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">TÊN ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-right text-blue-700 font-semibold">DOANH SỐ</th>
                  </tr>
                </thead>
                <tbody>
                  {topRevenue.map((agency) => (
                    <tr key={agency.id} className="border-b last:border-0">
                      <td className="py-2 px-4 font-bold text-blue-900 whitespace-nowrap">{agency.id}</td>
                      <td className="py-2 px-4 text-gray-800 whitespace-nowrap">{agency.name}</td>
                      <td className="py-2 px-4 text-right font-semibold text-blue-700 whitespace-nowrap">{agency.revenue.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Biểu đồ doanh số theo thời gian – đã lược bỏ */}
          {/* Hàng 2: Công nợ */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><TrendingDown className="h-5 w-5 text-red-600"/>Danh sách đại lý có công nợ cao nhất</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">MÃ ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-left text-blue-700 font-semibold">TÊN ĐẠI LÝ</th>
                    <th className="py-2 px-4 text-right text-blue-700 font-semibold">SỐ TIỀN CÔNG NỢ</th>
                  </tr>
                </thead>
                <tbody>
                  {topDebt.map((agency) => (
                    <tr key={agency.id} className="border-b last:border-0">
                      <td className="py-2 px-4 font-bold text-blue-900 whitespace-nowrap">{agency.id}</td>
                      <td className="py-2 px-4 text-gray-800 whitespace-nowrap">{agency.name}</td>
                      <td className="py-2 px-4 text-right font-semibold text-blue-700 whitespace-nowrap">{agency.debt.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Biểu đồ công nợ theo thời gian – đã lược bỏ */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffReportsPage;