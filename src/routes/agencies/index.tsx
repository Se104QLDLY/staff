import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Users, Search, Edit, Eye, BadgeCheck, Info, AlertTriangle } from 'lucide-react';
import { getAgencies } from '../../api/agency.api';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const AgencyPage: React.FC = () => {
  const [agencies, setAgencies] = useState<any[]>([]);
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        if (!user) return;

        // Fetch assigned agencies using a direct axios call to avoid baseURL conflict
        const assignedRes = await axios.get('/api/v1/staff-agency/by_staff/', {
          params: { staff_id: user.id },
          withCredentials: true,
        });
        
        console.log('Staff assigned agencies response:', assignedRes.data);
        
        const assignedAgencies = assignedRes.data.agencies || [];
        
        // If no agencies assigned, set empty array
        if (assignedAgencies.length === 0) {
          setAgencies([]);
          return;
        }
        
        const assignedIds = assignedAgencies.map((a: any) => a.id);
        
        // Fetch all agencies and filter only assigned ones
        const data = await getAgencies();
        const filtered = data.results.filter((a: any) => assignedIds.includes(a.id));
        
        console.log('Filtered agencies:', filtered);
        setAgencies(filtered);
      } catch (error) {
        console.error('Error loading agencies:', error);
        // On error, ensure agencies is empty
        setAgencies([]);
      }
    };
    loadAgencies();
  }, [user]);

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
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100 flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-gray-700 font-semibold mb-1">Tổng số đại lý</div>
              <div className="text-2xl font-extrabold text-blue-700">{total}</div>
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

          {/* Thông báo khi chưa được phân công agency */}
          {agencies.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Chưa được phân công quản lý đại lý
                  </h3>
                  <p className="text-yellow-700 mt-1">
                    Bạn chưa được phân công quản lý đại lý nào. Vui lòng liên hệ quản trị viên để được cấp quyền truy cập.
                  </p>
                </div>
              </div>
            </div>
          )}

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