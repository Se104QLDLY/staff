import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface Agency {
  id: string;
  code: string;
  name: string;
  type: {
    id: number;
    name: string;
  };
  district: string;
  address: string;
  phone: string;
  email: string;
  createdDate: string;
  updatedDate: string;
}

const AgencyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data for agencies
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: '1',
      code: 'DL001',
      name: 'Đại lý Minh Anh',
      type: {
        id: 1,
        name: 'Cấp 1'
      },
      district: 'Quận 1',
      address: '123 Nguyễn Huệ',
      phone: '0901234567',
      email: 'minhanh@email.com',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-20'
    },
    {
      id: '2',
      code: 'DL002',
      name: 'Đại lý Thành Công',
      type: {
        id: 2,
        name: 'Cấp 2'
      },
      district: 'Quận 3',
      address: '456 Lê Lợi',
      phone: '0907654321',
      email: 'thanhcong@email.com',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-18'
    }
  ]);

  const filteredAgencies = agencies.filter(agency => 
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.phone.includes(searchTerm) ||
    agency.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">Quản lý đại lý</h1>
        
        {/* Search and Add Button */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm đại lý..."
            className="flex-1 px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow-sm min-w-[220px] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/agencies/add"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-md whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm đại lý
          </Link>
        </div>

        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 drop-shadow">Danh sách đại lý</h2>
        
        {/* Agencies Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
          <table className="min-w-full bg-white border border-blue-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left">Mã đại lý</th>
                <th className="py-3 px-4 text-left">Tên đại lý</th>
                <th className="py-3 px-4 text-left">Địa chỉ</th>
                <th className="py-3 px-4 text-left">Số điện thoại</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{agency.code}</td>
                  <td className="px-4 py-3 text-gray-800">{agency.name}</td>
                  <td className="px-4 py-3 text-gray-800">{agency.address}</td>
                  <td className="px-4 py-3 text-gray-800">{agency.phone}</td>
                  <td className="px-4 py-3 text-gray-800">{agency.email}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Link to={`/agencies/view/${agency.id}`} className="px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Xem</Link>
                    <Link to={`/agencies/edit/${agency.id}`} className="px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">Sửa</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAgencies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Không tìm thấy đại lý nào.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgencyPage;