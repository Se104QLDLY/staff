import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, FileText, FileSpreadsheet, FilePlus2, Users, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock, User, Eye, Loader2, Download } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { fetchAssignedAgencies, type AgencyInfo } from '../../api/staffAgency.api';
import { getSalesReport, getDebtReport, exportReportExcel, exportReportPDF, type SalesReportItem, type DebtReportData } from '../../api/report.api';
import axios from 'axios';

// Create direct axios instance with correct backend URL
const backendApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
});
import toast from 'react-hot-toast';

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
  reportId?: number; // Add this for export functionality
}

interface AgencyStats {
  id: string;
  name: string;
  revenue: number;
  debt: number;
}

const useStaffReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [assignedAgencies, setAssignedAgencies] = useState<AgencyInfo[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [topRevenue, setTopRevenue] = useState<AgencyStats[]>([]);
  const [topDebt, setTopDebt] = useState<AgencyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách đại lý mà staff quản lý
        const agencies = await fetchAssignedAgencies(user.id);
        setAssignedAgencies(agencies);

        if (agencies.length === 0) {
          setReports([]);
          setTotalRevenue(0);
          setTotalDebt(0);
          setTopRevenue([]);
          setTopDebt([]);
          return;
        }

        // Tính tổng công nợ từ debt_amount của các đại lý
        const totalDebtAmount = agencies.reduce((sum, agency) => sum + agency.debt_amount, 0);
        setTotalDebt(totalDebtAmount);

        // Lấy doanh thu thực từ issues của các đại lý
        let totalRevenueAmount = 0;
        const agencyRevenueData: { [key: number]: number } = {};

        for (const agency of agencies) {
          try {
            // Lấy tất cả issues của agency này
            const issuesResponse = await backendApi.get(`/inventory/issues/`, {
              params: { agency_id: agency.agency_id }
            });
            
            const issues = issuesResponse.data.results || issuesResponse.data;
            const agencyRevenue = issues.reduce((sum: number, issue: any) => {
              // Chỉ tính các issue đã hoàn thành (delivered)
              if (issue.status === 'delivered') {
                return sum + parseFloat(issue.total_amount || 0);
              }
              return sum;
            }, 0);

            agencyRevenueData[agency.agency_id] = agencyRevenue;
            totalRevenueAmount += agencyRevenue;
          } catch (err) {
            console.error(`Error fetching issues for agency ${agency.agency_id}:`, err);
            agencyRevenueData[agency.agency_id] = 0;
          }
        }

        setTotalRevenue(totalRevenueAmount);

        // Tạo danh sách top doanh thu
        const topRevenueList = agencies
          .map(agency => ({
            id: `DL${agency.agency_id}`,
            name: agency.agency_name,
            revenue: agencyRevenueData[agency.agency_id] || 0,
            debt: agency.debt_amount
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setTopRevenue(topRevenueList);

        // Tạo danh sách top công nợ
        const topDebtList = agencies
          .map(agency => ({
            id: `DL${agency.agency_id}`,
            name: agency.agency_name,
            revenue: agencyRevenueData[agency.agency_id] || 0,
            debt: agency.debt_amount
          }))
          .sort((a, b) => b.debt - a.debt)
          .slice(0, 5);

        setTopDebt(topDebtList);

        // Lấy báo cáo đã tạo từ backend (để hiển thị danh sách)
        try {
          const response = await backendApi.get('/finance/reports/');
          const realReports = response.data.results || response.data;
          
          // Transform backend reports to frontend format
          const transformedReports: Report[] = realReports.map((report: any) => ({
            id: `BC${report.report_id}`,
            title: getReportTitle(report.report_type),
            type: getReportTypeDisplay(report.report_type),
            period: new Date(report.report_date).toLocaleDateString('vi-VN'),
            status: 'Hoàn thành',
            creator: report.created_by_name || report.created_by_username || `User ${report.created_by}`,
            createdDate: new Date(report.created_at).toLocaleDateString('vi-VN'),
            updatedDate: new Date(report.created_at).toLocaleDateString('vi-VN'),
            amount: calculateReportAmount(report),
            reportId: report.report_id
          }));

          setReports(transformedReports);
        } catch (err) {
          console.error('Error fetching reports:', err);
          setReports([]);
        }

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return {
    reports,
    assignedAgencies,
    totalRevenue,
    totalDebt,
    topRevenue,
    topDebt,
    loading,
    error
  };
};

const getReportTitle = (type: string) => {
  switch (type) {
    case 'sales': return 'Báo cáo doanh số';
    case 'debt': return 'Báo cáo công nợ';
    case 'inventory': return 'Báo cáo tồn kho';
    default: return 'Báo cáo';
  }
};

const getReportTypeDisplay = (type: string) => {
  switch (type) {
    case 'sales': return 'Doanh thu';
    case 'debt': return 'Công nợ';
    case 'inventory': return 'Tồn kho';
    default: return 'Hoạt động';
  }
};

const calculateReportAmount = (report: any) => {
  if (!report.data) return 0;
  
  if (report.report_type === 'sales' && report.data.sales) {
    return report.data.sales.reduce((sum: number, item: any) => sum + (item.total_sales || 0), 0);
  }
  
  if (report.report_type === 'debt' && report.data.summary) {
    return report.data.summary.reduce((sum: number, item: any) => sum + (item.debt_ending || 0), 0);
  }
  
  if (report.report_type === 'inventory' && report.data.total_value) {
    return report.data.total_value;
  }
  
  return 0;
};

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
  const { reports, assignedAgencies, totalRevenue, totalDebt, topRevenue, topDebt, loading, error } = useStaffReports();
  const [exportLoading, setExportLoading] = useState<{ [key: string]: boolean }>({});

  const handleExportExcel = async (reportId: number, reportType: string) => {
    const loadingKey = `excel-${reportId}`;
    try {
      setExportLoading(prev => ({ ...prev, [loadingKey]: true }));
      const response = await backendApi.get(`/finance/reports/${reportId}/export_excel/`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${reportType}-${reportId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công!');
    } catch (err) {
      console.error('Export Excel error:', err);
      toast.error('Không thể xuất Excel. Vui lòng thử lại.');
    } finally {
      setExportLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleExportPDF = async (reportId: number, reportType: string) => {
    const loadingKey = `pdf-${reportId}`;
    try {
      setExportLoading(prev => ({ ...prev, [loadingKey]: true }));
      const response = await backendApi.get(`/finance/reports/${reportId}/export_pdf/`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { 
        type: 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-${reportType}-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất PDF thành công!');
    } catch (err) {
      console.error('Export PDF error:', err);
      toast.error('Không thể xuất PDF. Vui lòng thử lại.');
    } finally {
      setExportLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lập báo cáo</h1>
            <p className="text-gray-600 mt-2">Tổng hợp, thống kê và quản lý các báo cáo doanh thu, tồn kho, công nợ và hoạt động của đại lý.</p>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Tổng doanh thu</h3>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="h-12 w-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Tổng công nợ</h3>
                <p className="text-3xl font-bold mt-2">{formatCurrency(totalDebt)}</p>
              </div>
              <TrendingDown className="h-12 w-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Số lượng đại lý</h3>
                <p className="text-3xl font-bold mt-2">{assignedAgencies.length}</p>
              </div>
              <Users className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Danh sách báo cáo */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Danh sách báo cáo ({reports.length})
              </h2>
              <Link
                to="/reports/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                <FilePlus2 className="h-6 w-6 mr-2" />
                Lập báo cáo
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Mã báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Kỳ báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Trạng thái</th>
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
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/reports/view/${report.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Xem báo cáo"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        {report.reportId && (
                          <>
                            <button
                              onClick={() => handleExportExcel(report.reportId!, report.type.toLowerCase())}
                              disabled={exportLoading[`excel-${report.reportId}`]}
                              className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                              title="Xuất Excel"
                            >
                              {exportLoading[`excel-${report.reportId}`] ? 
                                <Loader2 className="h-4 w-4 animate-spin" /> : 
                                <FileSpreadsheet className="h-4 w-4" />
                              }
                            </button>
                            
                            <button
                              onClick={() => handleExportPDF(report.reportId!, report.type.toLowerCase())}
                              disabled={exportLoading[`pdf-${report.reportId}`]}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              title="Xuất PDF"
                            >
                              {exportLoading[`pdf-${report.reportId}`] ? 
                                <Loader2 className="h-4 w-4 animate-spin" /> : 
                                <Download className="h-4 w-4" />
                              }
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Thống kê đại lý */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Doanh số cao nhất */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600"/>
              Danh sách đại lý có doanh số cao nhất
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-100">
                    <th className="text-left py-2 px-4 font-semibold text-blue-700">MÃ ĐẠI LÝ</th>
                    <th className="text-left py-2 px-4 font-semibold text-blue-700">TÊN ĐẠI LÝ</th>
                    <th className="text-right py-2 px-4 font-semibold text-blue-700">DOANH SỐ</th>
                  </tr>
                </thead>
                <tbody>
                  {topRevenue.map((item, index) => (
                    <tr key={item.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                      <td className="py-2 px-4 text-sm font-medium text-blue-900">{item.id}</td>
                      <td className="py-2 px-4 text-sm text-gray-900">{item.name}</td>
                      <td className="py-2 px-4 text-sm text-right font-semibold text-green-600">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Công nợ cao nhất */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600"/>
              Danh sách đại lý có công nợ cao nhất
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-100">
                    <th className="text-left py-2 px-4 font-semibold text-blue-700">MÃ ĐẠI LÝ</th>
                    <th className="text-left py-2 px-4 font-semibold text-blue-700">TÊN ĐẠI LÝ</th>
                    <th className="text-right py-2 px-4 font-semibold text-blue-700">CÔNG NỢ</th>
                  </tr>
                </thead>
                <tbody>
                  {topDebt.map((item, index) => (
                    <tr key={item.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                      <td className="py-2 px-4 text-sm font-medium text-blue-900">{item.id}</td>
                      <td className="py-2 px-4 text-sm text-gray-900">{item.name}</td>
                      <td className="py-2 px-4 text-sm text-right font-semibold text-red-600">{formatCurrency(item.debt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};



export default StaffReportsPage;