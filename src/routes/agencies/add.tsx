import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEditAgencyForm from './AddEditAgencyForm';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const AddAgencyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <AddEditAgencyForm onClose={() => navigate('/agencies')} />
      </div>
    </DashboardLayout>
  );
};

export default AddAgencyPage;
