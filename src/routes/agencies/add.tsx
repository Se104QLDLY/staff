import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditAgencyForm from './AddEditAgencyForm';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { UserPlus } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';

const AddAgencyPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400 flex items-center justify-center shadow-2xl shadow-blue-400/30 mb-2">
              <UserPlus className="h-10 w-10 text-white drop-shadow-xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg uppercase tracking-wide text-center">
              Thêm đại lý mới
            </h1>
            <p className="text-lg text-blue-700/80 mt-2 text-center max-w-xl font-medium">
              Nhập thông tin để tạo mới một đại lý trong hệ thống.
            </p>
          </div>
          <AddEditAgencyForm onClose={() => { toast.show('Thêm đại lý thành công!', 'success'); navigate('/agencies'); }} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddAgencyPage;
