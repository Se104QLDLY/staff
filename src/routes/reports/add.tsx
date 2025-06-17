import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

const initialForm = {
  title: '',
  type: 'Doanh thu',
  period: '',
  description: '',
};

const CreateReportPage: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    // Giả lập gọi API tạo báo cáo
    setTimeout(() => {
      setLoading(false);
      alert('Tạo báo cáo thành công!');
      navigate('/reports');
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">TẠO BÁO CÁO</h1>
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
              {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateReportPage;
