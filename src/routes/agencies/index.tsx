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
    agency.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">Quản lý đại lý</h1>
        
        {/* Search and Add Button */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <input
            type="text"
            placeholder="Tìm kiếm đại lý..."
            className="flex-1 min-w-[220px] px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/agencies/add"
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Thêm đại lý</span>
            <span className="sm:hidden">Thêm</span>
          </Link>
        </div>

        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 drop-shadow">Danh sách đại lý</h2>
        
        {/* Agencies Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
          <table className="min-w-full bg-white border border-blue-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px]">Mã đại lý</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[150px]">Tên đại lý</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px]">Loại đại lý</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px] hidden lg:table-cell">Quận/Huyện</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[200px] hidden xl:table-cell">Địa chỉ</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[130px] hidden md:table-cell">Số điện thoại</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[150px] hidden lg:table-cell">Email</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden xl:table-cell">Ngày tạo</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[100px] hidden xl:table-cell">Cập nhật</th>
                <th className="py-3 px-4 text-left whitespace-nowrap min-w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{agency.code}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    <div className="max-w-[200px] truncate" title={agency.name}>
                      {agency.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-lg ${agency.type.name === 'Cấp 1' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{agency.type.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden lg:table-cell">{agency.district}</td>
                  <td className="px-4 py-3 text-gray-800 hidden xl:table-cell">
                    <div className="max-w-[250px] truncate" title={agency.address}>
                      {agency.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden md:table-cell">{agency.phone}</td>
                  <td className="px-4 py-3 text-gray-800 hidden lg:table-cell">
                    <div className="max-w-[180px] truncate" title={agency.email}>
                      {agency.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden xl:table-cell">{new Date(agency.createdDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-gray-800 whitespace-nowrap hidden xl:table-cell">{new Date(agency.updatedDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <Link
                        to={`/agencies/view/${agency.id}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Xem chi tiết</span>
                        <span className="sm:hidden">Xem</span>
                      </Link>
                      <Link
                        to={`/agencies/edit/${agency.id}`}
                        className="px-2 sm:px-3 py-1 text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                        <span className="sm:hidden">Sửa</span>
                      </Link>
                    </div>
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