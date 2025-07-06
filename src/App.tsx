import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/common';
import { InventoryProvider } from './context/InventoryContext';
import './utils/debugInventory'; // Import debug utility

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <InventoryProvider>
              <AppRoutes />
            </InventoryProvider>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
