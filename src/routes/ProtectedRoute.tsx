import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're done loading AND there's no user
    if (!isLoading && !user) {
      console.log('Staff app: No user found, redirecting to central login');
      window.location.href = 'http://localhost:5179'; // Fixed: Login page port
      return;
    }

    // If authenticated but wrong role, redirect to appropriate app
    if (!isLoading && user && user.account_role !== 'staff') {
      console.log('Staff app: Wrong role, redirecting to appropriate app');
      switch (user.account_role) {
        case 'admin':
          window.location.href = 'http://localhost:5178'; // Fixed: Admin port is 5178
          break;
        case 'agent':
          window.location.href = 'http://localhost:5175/';
          break;
        default:
          window.location.href = 'http://localhost:5179'; // Fixed: Login page is 5179
      }
      return;
    }
  }, [user, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  // Show loading while redirecting
  if (!user || user.account_role !== 'staff') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg">Đang chuyển hướng...</div>
      </div>
    );
  }

  console.log('Staff app: User authenticated and has correct role');
  // If authenticated and correct role, render the protected route
  return <Outlet />;
};