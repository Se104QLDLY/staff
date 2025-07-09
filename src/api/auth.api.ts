import axiosClient from './axiosClient';
import { z } from 'zod';

// Định nghĩa kiểu dữ liệu cho thông tin đăng nhập, sử dụng Zod
export const loginSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập không được để trống'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

// Định nghĩa schema cho đăng ký
export const registerSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
  confirm_password: z.string(),
  full_name: z.string().min(1, 'Họ và tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  account_role: z.enum(['admin', 'staff', 'agent']).default('staff'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirm_password"],
});

// Suy ra kiểu TypeScript từ Zod schema
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;

// Định nghĩa kiểu dữ liệu cho User
export interface User {
  id: number;
  username?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  account_role?: string;
  agency_id?: number; // For agency users
}

interface LoginResponse {
  user: User;
}

/**
 * Hàm gọi API để đăng nhập
 * @param credentials - Username và password của người dùng
 * @returns Promise chứa thông tin user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<LoginResponse>('/auth/login/', credentials);
  return data;
};

/**
 * Hàm gọi API để lấy thông tin user hiện tại (dựa vào cookie)
 * @returns Promise chứa thông tin user
 */
export const getMe = async (): Promise<User> => {
  const { data } = await axiosClient.get<any>('/auth/me/', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Thêm timestamp để tránh cache
    params: {
      '_t': Date.now()
    }
  });
  console.log('Staff app: Raw API response for getMe:', data);
  
  const normalizedUser: User = {
    id: data.user_id,
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    phone_number: data.phone_number,
    address: data.address,
    account_role: data.account_role,
    agency_id: data.agency_id,
  };
  
  console.log('Staff app: Normalized user data:', normalizedUser);
  return normalizedUser;
};

/**
 * Hàm gọi API để đăng xuất
 */
export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout/');
};

/**
 * Hàm gọi API để đăng ký
 * @param credentials - Thông tin đăng ký
 * @returns Promise chứa thông tin user
 */
export const register = async (credentials: RegisterCredentials): Promise<LoginResponse> => {
  const { data } = await axiosClient.post<LoginResponse>('/auth/register/', credentials);
  return data;
};