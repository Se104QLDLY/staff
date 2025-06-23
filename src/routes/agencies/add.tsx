import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditAgencyForm from './AddEditAgencyForm';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { UserPlus } from 'lucide-react';

const AddAgencyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <UserPlus className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Thêm đại lý mới</h1>
              <p className="text-gray-600 text-base mt-1">Nhập thông tin để tạo mới một đại lý trong hệ thống.</p>
            </div>
          </div>
          <AddEditAgencyForm onClose={() => navigate('/agencies')} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddAgencyPage;
