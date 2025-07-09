import { useState } from 'react';

type UserRole = 'admin' | 'client';

interface User {
  username: string;
  role: UserRole;
  avatar: string;
}

// Thông tin user mẫu - sẽ được thay thế bằng dữ liệu thực từ API/context
const mockUser: User = {
  username: 'staff',
  role: 'admin',
  avatar: 'S'  // Chữ cái đầu của username
};

interface UseUserAccountReturn {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
  handleLogout: () => void;
}

export const useUserAccount = (): UseUserAccountReturn => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Trong thực tế, sẽ lấy từ context/redux/api
  const user = mockUser;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    // Xử lý logic đăng xuất thực tế
    // Ví dụ: xóa token, xóa thông tin người dùng, v.v.
    setIsOpen(false);
    // Redirect về admin site homepage sau khi logout (not login page)
    const adminSiteUrl = import.meta.env.VITE_ADMIN_SITE_URL || 'http://localhost:5178';
    window.location.href = adminSiteUrl;
  };
  
  return {
    user,
    isOpen,
    setIsOpen,
    toggleMenu,
    handleLogout
  };
}; 