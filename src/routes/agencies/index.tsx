import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Users, Search, Edit, Eye, BadgeCheck, Info } from 'lucide-react';

const mockAgencies = [
  { id: '1', name: 'Đại lý Minh Anh', code: 'DL001', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM', phone: '0901234567', email: 'minhanh@example.com', approved: true },
  { id: '2', name: 'Đại lý Thành Công', code: 'DL002', address: '456 Lê Lợi, Q.1, TP.HCM', phone: '0902345678', email: 'thanhcong@example.com', approved: true },
  { id: '3', name: 'Đại lý Hồng Phúc', code: 'DL003', address: '789 Trần Hưng Đạo, Q.5, TP.HCM', phone: '0903456789', email: 'hongphuc@example.com', approved: false },
];

const AgencyPage: React.FC = () => {
  const [agencies] = useState(mockAgencies);
  const [search, setSearch] = useState('');

  // Lọc danh sách theo từ khóa
  const filteredAgencies = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase()) ||
    a.address.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  // Thống kê
  const total = agencies.length;
  const approved = agencies.filter(a => a.approved).length;
  const notApproved = total - approved;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Quản lý đại lý</h1>
                <p className="text-gray-600 text-base mt-1">Theo dõi và quản lý thông tin các đại lý trong hệ thống.</p>
              </div>
            </div>
            <Link
              to="/agencies/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-blue-700"
            >
              <Users className="h-5 w-5" /> Thêm đại lý
            </Link>
          </div>

          {/* Thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-gray-700 font-semibold mb-1">Tổng số đại lý</div>
              <div className="text-2xl font-extrabold text-blue-700">{total}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100 flex flex-col items-center">
              <BadgeCheck className="h-8 w-8 text-green-600 mb-2" />
              <div className="text-gray-700 font-semibold mb-1">Đã duyệt</div>
              <div className="text-2xl font-extrabold text-green-700">{approved}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border-2 border-red-100 flex flex-col items-center">
              <Info className="h-8 w-8 text-red-600 mb-2" />
              <div className="text-gray-700 font-semibold mb-1">Chưa duyệt</div>
              <div className="text-2xl font-extrabold text-red-600">{notApproved}</div>
            </div>
          </div>

          {/* Tìm kiếm */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-blue-100 flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="flex items-center w-full sm:w-1/2 bg-blue-50 rounded-xl px-4 py-2 border border-blue-100">
              <Search className="h-5 w-5 text-blue-400 mr-2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm đại lý..."
                className="flex-1 bg-transparent outline-none text-lg text-blue-900"
              />
            </div>
          </div>

          {/* Bảng đại lý */}
          <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
            <table className="min-w-full bg-white border border-blue-200">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                <tr className="uppercase text-sm">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Mã đại lý</th>
                  <th className="py-3 px-4 text-left">Tên đại lý</th>
                  <th className="py-3 px-4 text-left">Địa chỉ</th>
                  <th className="py-3 px-4 text-left">Số điện thoại</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredAgencies.map((agency, idx) => (
                  <tr key={agency.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow">
                        <Users className="h-5 w-5" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-900">{agency.code}</td>
                    <td className="px-4 py-3 text-gray-800">{agency.name}</td>
                    <td className="px-4 py-3 text-gray-800">{agency.address}</td>
                    <td className="px-4 py-3 text-gray-800">{agency.phone}</td>
                    <td className="px-4 py-3 text-gray-800">{agency.email}</td>
                    <td className="px-4 py-3">
                      {agency.approved ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full"><BadgeCheck className="h-4 w-4"/>Đã duyệt</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full"><Info className="h-4 w-4"/>Chưa duyệt</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Link to={`/agencies/view/${agency.id}`} className="p-2 rounded-full bg-blue-50 hover:bg-blue-200 text-blue-600 hover:text-blue-900 transition-colors" title="Xem">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link to={`/agencies/edit/${agency.id}`} className="p-2 rounded-full bg-green-50 hover:bg-green-200 text-green-600 hover:text-green-900 transition-colors" title="Sửa">
                        <Edit className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgencyPage;