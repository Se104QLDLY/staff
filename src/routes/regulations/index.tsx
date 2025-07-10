import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';
import { getRegulations } from '../../api/regulation.api';
import { Link } from 'react-router-dom';

interface Regulation {
  regulation_key: string;
  regulation_value: string;
  description: string;
  updated_at: string;
  last_updated_by: number | null;
  last_updated_by_name: string | null;
}

const RegulationsPage: React.FC = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRegulations().then(data => {
      setRegulations(data);
      setLoading(false);
    });
  }, []);

  const filtered = regulations.filter(r =>
    r.regulation_key.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Danh sách quy định</h1>
        <input
          className="border rounded px-3 py-2 mb-4 w-full max-w-md"
          placeholder="Tìm kiếm quy định..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left">Mã quy định</th>
                <th className="px-6 py-3 border-b text-left">Nội dung</th>
                <th className="px-6 py-3 border-b text-left">Mô tả</th>
                <th className="px-6 py-3 border-b text-left">Cập nhật lần cuối</th>
                <th className="px-6 py-3 border-b text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">Không có quy định nào</td></tr>
              ) : (
                filtered.map(reg => (
                  <tr key={reg.regulation_key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{reg.regulation_key}</td>
                    <td className="px-6 py-4 border-b">{reg.regulation_value}</td>
                    <td className="px-6 py-4 border-b">{reg.description}</td>
                    <td className="px-6 py-4 border-b">{new Date(reg.updated_at).toLocaleString('vi-VN')}</td>
                    <td className="px-6 py-4 border-b">
                      <Link to={`/regulations/view/${reg.regulation_key}`} className="text-blue-600 hover:underline">Xem</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegulationsPage; 