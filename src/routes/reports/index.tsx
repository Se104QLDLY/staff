import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

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

const ReportsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT001',
      title: 'Báo cáo doanh thu tháng 1/2024',
      type: 'Doanh thu',
      period: 'Tháng 1/2024',
      status: 'Hoàn thành',
      creator: 'Nguyễn Văn A',
      createdDate: '2024-01-31',
      updatedDate: '2024-01-31',
      description: 'Báo cáo tổng hợp doanh thu tháng 1',
      amount: 1250000000
    },
    {
      id: 'RPT002',
      title: 'Báo cáo tồn kho quý 4/2023',
      type: 'Tồn kho',
      period: 'Quý 4/2023',
      status: 'Hoàn thành',
      creator: 'Trần Thị B',
      createdDate: '2024-01-05',
      updatedDate: '2024-01-05',
      description: 'Thống kê tồn kho cuối quý 4',
      amount: 890000000
    },
    {
      id: 'RPT003',
      title: 'Báo cáo công nợ đại lý',
      type: 'Công nợ',
      period: 'Tháng 1/2024',
      status: 'Đang xử lý',
      creator: 'Lê Văn C',
      createdDate: '2024-01-30',
      updatedDate: '2024-01-30',
      description: 'Tình hình công nợ các đại lý',
      amount: 458000000
    }
  ]);

  // Thống kê
  const totalRevenue = reports.filter(r => r.type === 'Doanh thu').reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalDebt = reports.filter(r => r.type === 'Công nợ').reduce((sum, r) => sum + (r.amount || 0), 0);
  const reportCount = reports.length;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + ' VND';

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Doanh thu':
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
            Doanh thu
          </span>
        );
      case 'Công nợ':
        return (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
            Công nợ
          </span>
        );
      case 'Tồn kho':
        return (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
            Tồn kho
          </span>
        );
      case 'Hoạt động':
        return (
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-lg">
            Hoạt động
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
            Hoàn thành
          </span>
        );
      case 'Đang xử lý':
        return (
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-lg">
            Đang xử lý
          </span>
        );
      case 'Lỗi':
        return (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
            Lỗi
          </span>
        );
      default:
        return null;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (reportToDelete) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setReports(reports.filter(r => r.id !== reportToDelete.id));
        setShowDeleteModal(false);
        setReportToDelete(null);
        alert(`Đã xóa báo cáo ${reportToDelete.id} thành công!`);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Có lỗi xảy ra khi xóa báo cáo!');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setReportToDelete(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Doanh thu': return 'bg-green-100 text-green-800';
      case 'Tồn kho': return 'bg-blue-100 text-blue-800';
      case 'Công nợ': return 'bg-orange-100 text-orange-800';
      case 'Hoạt động': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Đang xử lý': return 'bg-yellow-100 text-yellow-800';
      case 'Lỗi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6" style={{ overflow: 'visible' }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
            LẬP BÁO CÁO
          </h1>
          <p className="text-gray-600 text-lg">
            Tổng hợp, thống kê và quản lý các báo cáo doanh thu, tồn kho, công nợ và hoạt động của đại lý.
          </p>
        </div>
        {/* Card thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <h3 className="text-gray-700 font-semibold mb-2">Tổng doanh thu</h3>
            <p className="text-2xl font-extrabold text-blue-700">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-red-100">
            <h3 className="text-gray-700 font-semibold mb-2">Tổng công nợ</h3>
            <p className="text-2xl font-extrabold text-red-600">{formatCurrency(totalDebt)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-gray-700 font-semibold mb-2">Số lượng báo cáo</h3>
            <p className="text-2xl font-extrabold text-blue-800">{reportCount}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-800 drop-shadow">Danh sách báo cáo</h2>
          <Link
            to="/reports/add"
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Lập báo cáo
          </Link>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Dữ liệu báo cáo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Người tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(report.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(report.amount || 0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.creator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/reports/detail/${report.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Xem chi tiết
                      </Link>
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
            <h3 className="text-xl font-bold text-blue-800 mb-4">Danh sách đại lý có doanh số cao nhất</h3>
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
                  {[
                    { id: 'DL101', name: 'Đại lý 1', revenue: 45000000 },
                    { id: 'DL102', name: 'Đại lý 2', revenue: 40000000 },
                    { id: 'DL103', name: 'Đại lý 3', revenue: 35000000 },
                    { id: 'DL104', name: 'Đại lý 4', revenue: 30000000 },
                    { id: 'DL105', name: 'Đại lý 5', revenue: 25000000 }
                  ].map((agency) => (
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
          {/* Biểu đồ doanh số theo thời gian */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Biểu đồ doanh số theo thời gian</h3>
            <svg viewBox="0 0 420 240" width="100%" height="240" className="mx-auto">
              {/* Legend */}
              <rect x="80" y="15" width="18" height="12" fill="#60a5fa" />
              <text x="105" y="25" fontSize="15" fill="#2563eb" fontWeight="bold">Doanh số (Triệu VND)</text>
              {/* Title */}
              <text x="210" y="50" textAnchor="middle" fontSize="18" fill="#334155" fontWeight="bold">Biểu đồ doanh số theo thời gian</text>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="50" x2="380" y1={70 + i*40} y2={70 + i*40} stroke="#e5e7eb" strokeWidth="1" />
              ))}
              {/* Y axis */}
              <line x1="50" y1="70" x2="50" y2="230" stroke="#94a3b8" strokeWidth="2" />
              {/* X axis */}
              <line x1="50" y1="230" x2="380" y2="230" stroke="#94a3b8" strokeWidth="2" />
              {/* Bars: Doanh số */}
              {[
                { x: 80, height: 100, value: 100, label: '01/2024' },
                { x: 150, height: 70, value: 150, label: '02/2024' },
                { x: 220, height: 40, value: 180, label: '04/2024' },
                { x: 290, height: 20, value: 200, label: '05/2024' }
              ].map((bar) => (
                <rect key={bar.label} x={bar.x} y={bar.height+70} width="40" height={160-bar.height} rx="6" fill="#60a5fa" />
              ))}
              {/* X labels */}
              {['01/2024', '02/2024', '04/2024', '05/2024'].map((label, idx) => (
                <text
                  key={label}
                  x={100 + idx * 80}
                  y="235"
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="bold"
                  fill="#1e293b"
                  stroke="#fff"
                  strokeWidth="0.8"
                  paintOrder="stroke"
                  style={{ letterSpacing: 1 }}
                >
                  {label}
                </text>
              ))}
              {/* Y labels */}
              {[0, 50, 100, 150, 200].map((v, i) => (
                <text key={v} x="40" y={230-40*i+5} textAnchor="end" fontSize="13" fill="#64748b">{v}</text>
              ))}
              {/* Value labels on top of bars */}
              {[
                { x: 80, height: 100, value: 100 },
                { x: 150, height: 70, value: 150 },
                { x: 220, height: 40, value: 180 },
                { x: 290, height: 20, value: 200 }
              ].map((bar, idx) => (
                <text key={bar.x} x={bar.x+20} y={bar.height+65} textAnchor="middle" fontSize="13" fill="#2563eb" fontWeight="bold">{bar.value}</text>
              ))}
            </svg>
          </div>
          {/* Hàng 2: Công nợ */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Danh sách đại lý có công nợ cao nhất</h3>
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
                  {[
                    { id: 'DL101', name: 'Đại lý 1', debt: 45000000 },
                    { id: 'DL102', name: 'Đại lý 2', debt: 40000000 },
                    { id: 'DL103', name: 'Đại lý 3', debt: 35000000 },
                    { id: 'DL104', name: 'Đại lý 4', debt: 30000000 },
                    { id: 'DL105', name: 'Đại lý 5', debt: 25000000 }
                  ].map((agency) => (
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
          {/* Biểu đồ công nợ theo thời gian */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Biểu đồ công nợ theo thời gian</h3>
            <svg viewBox="0 0 420 240" width="100%" height="240" className="mx-auto">
              {/* Legend */}
              <rect x="80" y="15" width="18" height="12" fill="#fb7185" />
              <text x="105" y="25" fontSize="15" fill="#be123c" fontWeight="bold">Công nợ (Triệu VND)</text>
              {/* Title */}
              <text x="210" y="50" textAnchor="middle" fontSize="18" fill="#334155" fontWeight="bold">Biểu đồ công nợ theo thời gian</text>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="50" x2="380" y1={70 + i*40} y2={70 + i*40} stroke="#e5e7eb" strokeWidth="1" />
              ))}
              {/* Y axis */}
              <line x1="50" y1="70" x2="50" y2="230" stroke="#94a3b8" strokeWidth="2" />
              {/* X axis */}
              <line x1="50" y1="230" x2="380" y2="230" stroke="#94a3b8" strokeWidth="2" />
              {/* Bars: Công nợ */}
              {[
                { x: 80, height: 120, value: 80, label: '01/2024' },
                { x: 150, height: 90, value: 120, label: '02/2024' },
                { x: 220, height: 60, value: 150, label: '04/2024' },
                { x: 290, height: 40, value: 180, label: '05/2024' }
              ].map((bar) => (
                <rect key={bar.label} x={bar.x} y={bar.height+70} width="40" height={160-bar.height} rx="6" fill="#fb7185" />
              ))}
              {/* X labels */}
              {['01/2024', '02/2024', '04/2024', '05/2024'].map((label, idx) => (
                <text
                  key={label}
                  x={100 + idx * 80}
                  y="235"
                  textAnchor="middle"
                  fontSize="17"
                  fontWeight="bold"
                  fill="#1e293b"
                  stroke="#fff"
                  strokeWidth="0.8"
                  paintOrder="stroke"
                  style={{ letterSpacing: 1 }}
                >
                  {label}
                </text>
              ))}
              {/* Y labels */}
              {[0, 50, 100, 150, 200].map((v, i) => (
                <text key={v} x="40" y={230-40*i+5} textAnchor="end" fontSize="13" fill="#64748b">{v}</text>
              ))}
              {/* Value labels on top of bars */}
              {[
                { x: 80, height: 120, value: 80 },
                { x: 150, height: 90, value: 120 },
                { x: 220, height: 60, value: 150 },
                { x: 290, height: 40, value: 180 }
              ].map((bar, idx) => (
                <text key={bar.x} x={bar.x+20} y={bar.height+65} textAnchor="middle" fontSize="13" fill="#be123c" fontWeight="bold">{bar.value}</text>
              ))}
            </svg>
          </div>
        </div>
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
                <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa báo cáo</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa báo cáo <strong>{reportToDelete?.id} - {reportToDelete?.title}</strong>?
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
                    Xóa báo cáo
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

export default ReportsPage;
