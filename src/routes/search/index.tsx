import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface Agency {
  id: string;
  name: string;
  code: string;
  district: string;
  ward: string;
  address: string;
  phone: string;
  email: string;
  type: {
    id: number;
    name: string;
  }
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Mock data
  const agencies: Agency[] = [
    {
      id: '1',
      name: 'Đại lý Phương Nam',
      code: 'DL001',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      address: '123 Nguyễn Huệ, Phường Bến Nghé',
      phone: '028 1234 5678',
      email: 'phuongnam@email.com',
      type: {
        id: 1,
        name: 'Cấp 1'
      }
    },
    {
      id: '2',
      name: 'Đại lý Miền Tây',
      code: 'DL002',
      district: 'Quận 5',
      ward: 'Phường 6',
      address: '456 Trần Hưng Đạo, Phường 6',
      phone: '028 8765 4321',
      email: 'mientay@email.com',
      type: {
        id: 2,
        name: 'Cấp 2'
      }
    }
  ];

  const filteredAgencies = agencies.filter(agency => {
    if (searchTerm && !agency.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !agency.code.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'all' && agency.type.name !== typeFilter) {
      return false;
    }
    if (districtFilter !== 'all' && agency.district !== districtFilter) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">Tra cứu đại lý</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã đại lý..."
            className="flex-1 min-w-[220px] px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại đại lý</option>
            <option value="Cấp 1">Cấp 1</option>
            <option value="Cấp 2">Cấp 2</option>
          </select>
          <select
            className="px-4 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option value="all">Tất cả quận/huyện</option>
            <option value="Quận 1">Quận 1</option>
            <option value="Quận 5">Quận 5</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgencies.map((agency) => (
            <div key={agency.id} className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-2 border-blue-200 rounded-2xl shadow-xl p-6 hover:scale-105 hover:shadow-2xl transition-all flex flex-col gap-3">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-blue-600 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-1">{agency.name}</h2>
                  <span className="text-base font-semibold text-gray-600">{agency.code}</span>
                </div>
                <span className={`ml-auto px-4 py-1 rounded-full text-sm font-bold shadow-lg ${agency.type.name === 'Cấp 1' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{agency.type.name}</span>
              </div>
              <div className="flex flex-col gap-1 text-gray-700 text-base">
                <span><b>Quận/Huyện:</b> {agency.district}</span>
                <span><b>Địa chỉ:</b> {agency.address}</span>
                <span><b>Điện thoại:</b> {agency.phone}</span>
                <span><b>Email:</b> {agency.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;