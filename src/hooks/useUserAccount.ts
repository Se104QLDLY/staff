import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  // Trong thực tế, sẽ lấy từ context/redux/api
  const user = mockUser;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    // Xử lý logic đăng xuất thực tế
    // Ví dụ: xóa token, xóa thông tin người dùng, v.v.
    setIsOpen(false);
    navigate('/login');
  };
  
  return {
    user,
    isOpen,
    setIsOpen,
    toggleMenu,
    handleLogout
  };
}; 