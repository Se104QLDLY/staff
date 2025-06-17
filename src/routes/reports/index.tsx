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
      description: 'Báo cáo tổng hợp doanh thu tháng 1'
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
      description: 'Thống kê tồn kho cuối quý 4'
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
      description: 'Tình hình công nợ các đại lý'
    }
  ]);

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
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">
          LẬP BÁO CÁO
        </h1>
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            className="flex-1 min-w-[220px] px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
          >
            <option value="all">Tất cả loại báo cáo</option>
            <option value="Doanh thu">Doanh thu</option>
            <option value="Tồn kho">Tồn kho</option>
            <option value="Công nợ">Công nợ</option>
            <option value="Hoạt động">Hoạt động</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Lỗi">Lỗi</option>
          </select>
          <Link
            to="/reports/add"
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Tạo báo cáo</span>
            <span className="sm:hidden">Thêm</span>
          </Link>
        </div>
        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 drop-shadow">Danh sách báo cáo</h2>
        {/* Reports Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
          <table className="min-w-full bg-white border border-blue-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Mã Báo Cáo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[200px]">Tiêu Đề</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Loại Báo Cáo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px] hidden lg:table-cell">Kỳ Báo Cáo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px]">Trạng Thái</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden md:table-cell">Người Tạo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden xl:table-cell">Ngày Tạo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{report.id}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    <div className="max-w-[200px] truncate" title={report.title}>
                      {report.title}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getTypeColor(report.type)}`}>
                      <span className="hidden sm:inline">{report.type}</span>
                      <span className="sm:hidden">{report.type === 'Doanh thu' ? 'DT' : report.type === 'Tồn kho' ? 'TK' : report.type === 'Công nợ' ? 'CN' : 'HĐ'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden lg:table-cell">{report.period}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getStatusColor(report.status)}`}>
                      <span className="hidden sm:inline">{report.status}</span>
                      <span className="sm:hidden">{report.status === 'Hoàn thành' ? 'OK' : report.status === 'Đang xử lý' ? 'XL' : 'E'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 hidden md:table-cell">
                    <div className="max-w-[100px] truncate" title={report.creator}>
                      {report.creator}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden xl:table-cell">{new Date(report.createdDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Link
                        to={`/reports/view/${report.id}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        Xem
                      </Link>
                      <Link
                        to={`/reports/edit/${report.id}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                        <span className="sm:hidden">Sửa</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(report)}
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
        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không tìm thấy báo cáo nào.</p>
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
