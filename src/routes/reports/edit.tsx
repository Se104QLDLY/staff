import React, { useState } from 'react';
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

const EditReportPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = mockReports.find(r => r.id === id);
  const [form, setForm] = useState(report || {
    id: '', title: '', type: 'Doanh thu', period: '', status: 'Đang xử lý', creator: '', createdDate: '', updatedDate: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.period) {
      setError('Vui lòng nhập đầy đủ tiêu đề và kỳ báo cáo.');
      return;
    }
    setLoading(true);
    // Giả lập gọi API cập nhật báo cáo
    setTimeout(() => {
      setLoading(false);
      alert('Cập nhật báo cáo thành công!');
      navigate('/reports');
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">CHỈNH SỬA BÁO CÁO</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Tiêu đề báo cáo <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
              placeholder="Nhập tiêu đề báo cáo"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Loại báo cáo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
            >
              <option value="Doanh thu">Doanh thu</option>
              <option value="Tồn kho">Tồn kho</option>
              <option value="Công nợ">Công nợ</option>
              <option value="Hoạt động">Hoạt động</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Kỳ báo cáo <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="period"
              value={form.period}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm"
              placeholder="Ví dụ: Tháng 6/2025, Quý 2/2025..."
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-blue-700">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-sm min-h-[80px]"
              placeholder="Nhập mô tả chi tiết (nếu có)"
            />
          </div>
          {error && <div className="text-red-600 font-semibold">{error}</div>}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold text-lg"
              onClick={() => navigate('/reports')}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-lg"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditReportPage;
