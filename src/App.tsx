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
        <AuthProvider>
          <InventoryProvider>
            <AppRoutes />
          </InventoryProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
