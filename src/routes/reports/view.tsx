import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

// Giả lập dữ liệu báo cáo (có thể thay bằng API thực tế)
const mockReports = [
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
];

const ViewReportPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = mockReports.find(r => r.id === id);

  if (!report) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mt-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy báo cáo</h2>
          <button onClick={() => navigate('/reports')} className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg">Quay lại danh sách</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 mt-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">CHI TIẾT BÁO CÁO</h1>
        <div className="space-y-4 text-lg">
          <div><span className="font-semibold text-blue-700">Mã báo cáo:</span> {report.id}</div>
          <div><span className="font-semibold text-blue-700">Tiêu đề:</span> {report.title}</div>
          <div><span className="font-semibold text-blue-700">Loại báo cáo:</span> {report.type}</div>
          <div><span className="font-semibold text-blue-700">Kỳ báo cáo:</span> {report.period}</div>
          <div><span className="font-semibold text-blue-700">Trạng thái:</span> {report.status}</div>
          <div><span className="font-semibold text-blue-700">Người tạo:</span> {report.creator}</div>
          <div><span className="font-semibold text-blue-700">Ngày tạo:</span> {report.createdDate}</div>
          <div><span className="font-semibold text-blue-700">Cập nhật:</span> {report.updatedDate}</div>
          <div><span className="font-semibold text-blue-700">Mô tả:</span> {report.description || 'Không có'}</div>
        </div>
        <div className="flex justify-end mt-8">
          <button onClick={() => navigate('/reports')} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold text-lg mr-2">Quay lại</button>
          <button onClick={() => navigate(`/reports/edit/${report.id}`)} className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg">Chỉnh sửa</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewReportPage;
