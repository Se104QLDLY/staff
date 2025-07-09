import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth.api';
import type { User, LoginCredentials } from '../api/auth.api';

// Định nghĩa kiểu cho AuthContext
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  session: number;
}

// Tạo Context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(0);

  // Kiểm tra session khi component được mount lần đầu
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await getMe();
        console.log('Staff app: Successfully authenticated user:', currentUser);
        
        // Kiểm tra xem có phải user mới không bằng cách compare với localStorage
        const lastUserId = localStorage.getItem('lastUserId');
        const lastUserRole = localStorage.getItem('lastUserRole');
        
        if (lastUserId && lastUserId !== currentUser.id.toString()) {
          console.log('Staff app: Detected user ID change, forcing page reload');
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
          return;
        }
        
        if (lastUserRole && lastUserRole !== currentUser.account_role) {
          console.log('Staff app: Detected user role change, forcing page reload');
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
          return;
        }
        
        // Lưu current user info để detect thay đổi lần sau
        localStorage.setItem('lastUserId', currentUser.id.toString());
        localStorage.setItem('lastUserRole', currentUser.account_role || 'unknown');
        setUser(currentUser);
      } catch (error) {
        console.log('Staff app: Authentication check failed:', error);
        localStorage.removeItem('lastUserId');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // First, call login to set HttpOnly cookies
    await apiLogin(credentials);
    // Then fetch the full current user profile
    const currentUser = await getMe();
    console.log('Staff app: User logged in successfully:', currentUser);
    
    // Clear old cache và set new user info
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('lastUserId', currentUser.id.toString());
    localStorage.setItem('lastUserRole', currentUser.account_role || 'unknown');
    
    setUser(currentUser);
    setSession(prev => prev + 1);
  };

  const logout = async () => {
    console.log('Staff app: User logging out');
    await apiLogout();
    
    // Clear tất cả cache khi logout
    localStorage.clear();
    sessionStorage.clear();
    
    setUser(null);
    setSession(prev => prev + 1);
    
    // Redirect về admin site homepage sau khi logout (not login page)
    const adminSiteUrl = import.meta.env.VITE_ADMIN_SITE_URL || 'http://localhost:5178';
    window.location.href = adminSiteUrl;
  };

  const value = { user, isLoading, login, logout, session };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Tạo custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};