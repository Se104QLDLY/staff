import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ImportPage from './import';
import AddImportPage from './import/add';
import ViewImportPage from './import/view';
import EditImportPage from './import/edit';
import ExportPage from './export';
import ExportDetailPage from './export/detail';
import AddExportPage from './export/add';
import EditExportPage from './export/edit';
import SearchPage from './search';
import PaymentPage from './payment';
import PaymentDetailPage from './payment/detail';
import AddPaymentReceipt from './payment/add';
import AgencyPage from './agencies';
import AddAgencyPage from './agencies/add';
import ViewAgencyPage from './agencies/view';
import EditAgencyPage from './agencies/edit';
import NotFound from './NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AgencyPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Staff main routes */}
      <Route path="/agencies" element={<AgencyPage />} />
      <Route path="/agencies/add" element={<AddAgencyPage />} />
      <Route path="/agencies/view/:id" element={<ViewAgencyPage />} />
      <Route path="/agencies/edit/:id" element={<EditAgencyPage />} />
      
      <Route path="/import" element={<ImportPage />} />
      <Route path="/import/add" element={<AddImportPage />} />
      <Route path="/import/view/:id" element={<ViewImportPage />} />
      <Route path="/import/edit/:id" element={<EditImportPage />} />
      
      <Route path="/export" element={<ExportPage />} />
      <Route path="/export/detail/:id" element={<ExportDetailPage />} />
      <Route path="/export/add" element={<AddExportPage />} />
      <Route path="/export/edit/:id" element={<EditExportPage />} />
      
      <Route path="/search" element={<SearchPage />} />
      
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment/detail/:id" element={<PaymentDetailPage />} />
      <Route path="/payment/add" element={<AddPaymentReceipt />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;