import { Routes, Route } from 'react-router-dom';
import ImportManagementPage from './import';
import AddImportPage from './import/add';
import ViewImportPage from './import/view.tsx';
import EditImportPage from './import/edit';
import ExportPage from './export';
import ExportDetailPage from './export/detail';
import AddExportPage from './export/add';
import EditExportPage from './export/edit';
import PaymentPage from './payment';
import PaymentDetailPage from './payment/detail';
import AddPaymentReceipt from './payment/add';
import EditPaymentReceipt from './payment/edit';
import AgencyPage from './agencies';
import AddAgencyPage from './agencies/add';
import ViewAgencyPage from './agencies/view';
import EditAgencyPage from './agencies/edit';
import NotFound from './NotFound';
import ReportsPage from './reports';
import CreateReportPage from './reports/add';
import ViewReportPage from './reports/view';
import EditReportPage from './reports/edit';
import RegulationsPage from './regulations';
import ViewRegulationPage from './regulations/view';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* All routes are protected - redirect to central login if not authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AgencyPage />} />
        <Route path="/agencies" element={<AgencyPage />} />
        <Route path="/agencies/add" element={<AddAgencyPage />} />
        <Route path="/agencies/view/:id" element={<ViewAgencyPage />} />
        <Route path="/agencies/edit/:id" element={<EditAgencyPage />} />
        
        <Route path="/import" element={<ImportManagementPage />} />
        <Route path="/import/add" element={<AddImportPage />} />
        <Route path="/import/view/:id" element={<ViewImportPage />} />
        <Route path="/import/edit/:id" element={<EditImportPage />} />
        
        <Route path="/export" element={<ExportPage />} />
        <Route path="/export/detail/:id" element={<ExportDetailPage />} />
        <Route path="/export/add" element={<AddExportPage />} />
        <Route path="/export/edit/:id" element={<EditExportPage />} />
        
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/add" element={<AddPaymentReceipt />} />
        <Route path="/payment/detail/:id" element={<PaymentDetailPage />} />
        <Route path="/payment/edit/:id" element={<EditPaymentReceipt />} />
        
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/add" element={<CreateReportPage />} />
        <Route path="/reports/view/:id" element={<ViewReportPage />} />
        <Route path="/reports/edit/:id" element={<EditReportPage />} />
        
        <Route path="/regulations" element={<RegulationsPage />} />
        <Route path="/regulations/view/:key" element={<ViewRegulationPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;