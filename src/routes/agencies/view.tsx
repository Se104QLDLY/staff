import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Users, BadgeCheck, AlertCircle, Edit, Trash2, ArrowLeft, Info } from 'lucide-react';

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
  manager?: string;
  debt?: number;
  creditLimit?: number;
  status: 'Hoạt động' | 'Tạm dừng' | 'Ngừng hợp tác';
}

const ViewAgencyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - trong thực tế sẽ fetch từ API
  const agency: Agency = {
    id: id || '1',
    code: 'DL001',
    name: 'Đại lý Minh Anh',
    type: {
      id: 1,
      name: 'Cấp 1'
    },
    district: 'Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '0901234567',
    email: 'minhanh@email.com',
    manager: 'Nguyễn Minh Anh',
    debt: 2500000,
    creditLimit: 10000000,
    status: 'Hoạt động',
    createdDate: '2024-01-15',
    updatedDate: '2024-01-20'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động': return 'bg-green-100 text-green-800';
      case 'Tạm dừng': return 'bg-yellow-100 text-yellow-800';
      case 'Ngừng hợp tác': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (typeName: string) => {
    switch (typeName) {
      case 'Cấp 1': return 'bg-blue-100 text-blue-800';
      case 'Cấp 2': return 'bg-green-100 text-green-800';
      case 'Cấp 3': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="max-w-5xl w-full mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Chi tiết đại lý</h1>
              <p className="text-gray-600 text-base mt-1">Xem thông tin chi tiết và thao tác với đại lý {agency.code}.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
                <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-blue-500"/>Thông tin cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Mã đại lý</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{agency.code}</p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Loại đại lý</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getTypeColor(agency.type.name)}`}>
                      {agency.type.name}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-blue-700 font-semibold mb-1">Tên đại lý</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">{agency.name}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-blue-700 font-semibold mb-1">Địa chỉ</label>
                    <p className="bg-white px-4 py-3 rounded-lg border text-gray-700 leading-relaxed">{agency.address}</p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Quận/Huyện</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">{agency.district}</p>
                  </div>
                  <div>
                    <label className="block text-blue-700 font-semibold mb-1">Người quản lý</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-gray-800">{agency.manager || 'Chưa có thông tin'}</p>
                  </div>
                </div>
              </div>
              {/* Contact Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-green-500"/>Thông tin liên hệ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-green-700 font-semibold mb-1">Số điện thoại</label>
                    <div className="bg-white px-4 py-2 rounded-lg border">
                      <a href={`tel:${agency.phone}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        {agency.phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-green-700 font-semibold mb-1">Email</label>
                    <div className="bg-white px-4 py-2 rounded-lg border">
                      <a href={`mailto:${agency.email}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        {agency.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Financial Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100">
                <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-yellow-500"/>Thông tin tài chính</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-700 font-semibold mb-1">Nợ hiện tại</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-red-600 font-bold text-lg">
                      {agency.debt?.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                  <div>
                    <label className="block text-yellow-700 font-semibold mb-1">Hạn mức tín dụng</label>
                    <p className="bg-white px-4 py-2 rounded-lg border text-green-600 font-bold text-lg">
                      {agency.creditLimit?.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-yellow-700 font-semibold mb-1">Tình trạng nợ</label>
                    <div className="bg-white px-4 py-2 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Đã sử dụng:</span>
                        <span className="font-bold">
                          {((agency.debt || 0) / (agency.creditLimit || 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            (agency.debt || 0) / (agency.creditLimit || 1) > 0.8 
                              ? 'bg-red-500' 
                              : (agency.debt || 0) / (agency.creditLimit || 1) > 0.6 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${((agency.debt || 0) / (agency.creditLimit || 1) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-gray-500"/>Trạng thái</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Tình trạng:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(agency.status)} flex items-center gap-1`}>
                      {agency.status === 'Hoạt động' && <BadgeCheck className="h-4 w-4" />}
                      {agency.status === 'Tạm dừng' && <AlertCircle className="h-4 w-4" />}
                      {agency.status === 'Ngừng hợp tác' && <Trash2 className="h-4 w-4" />}
                      {agency.status}
                    </span>
                  </div>
                </div>
              </div>
              {/* Dates Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-gray-500"/>Thời gian</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Ngày tạo</label>
                    <p className="text-blue-600 font-semibold">{new Date(agency.createdDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Cập nhật lần cuối</label>
                    <p className="text-gray-800">{new Date(agency.updatedDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>
              {/* Actions Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-gray-500"/>Thao tác</h3>
                <div className="space-y-3">
                  <Link
                    to={`/agencies/edit/${agency.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold gap-2"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                  </Link>
                  <Link
                    to="/agencies"
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold gap-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewAgencyPage; 