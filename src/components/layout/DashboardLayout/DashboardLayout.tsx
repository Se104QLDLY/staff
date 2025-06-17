import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { useUserAccount } from '../../../hooks/useUserAccount';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const UserAccount: React.FC = () => {
  const { user, isOpen, toggleMenu, handleLogout } = useUserAccount();
  
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
        aria-label="Tài khoản người dùng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Nhân viên' : 'Khách hàng'}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

// Mobile header component
const MobileHeader: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  return (
    <header className="md:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600"
        aria-label="Mở menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        <span className="text-lg font-bold text-blue-800">Staff</span>
      </div>
      
      <UserAccount />
    </header>
  );
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 relative">
            {/* Desktop user account */}
            <div className="hidden md:block absolute top-4 right-4 z-20">
              <UserAccount />
            </div>
            
            {/* Content with proper spacing */}
            <div className="md:pt-10">
              <div className="max-w-full">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 