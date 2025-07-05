import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema, type RegisterCredentials } from '../../api/auth.api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      account_role: 'staff' // Default role for staff frontend
    }
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setError(null);
      setIsSubmitting(true);

      // Call register API
      const { register: registerAPI } = await import('../../api/auth.api');
      await registerAPI(data);

      // Auto-login after successful registration
      await login({ username: data.username, password: data.password });
      
      // Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        // Handle validation errors from backend
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object') {
          const errorMessages = Object.values(backendErrors).flat();
          setError(errorMessages.join('. '));
        } else {
          setError('Đăng ký thất bại. Vui lòng thử lại.');
        }
      } else {
        setError('Đăng ký thất bại. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border-2 border-cyan-100">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 mb-2 drop-shadow-lg" />
          <h2 className="text-3xl font-extrabold text-cyan-700 mb-2 drop-shadow">Đăng ký nhân viên</h2>
          <p className="text-cyan-700 font-medium">Tạo tài khoản nhân viên mới để bắt đầu sử dụng hệ thống!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Họ và tên</label>
            <input
              {...register('full_name')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập họ và tên"
            />
            {errors.full_name && (
              <span className="text-red-500 text-sm mt-1">{errors.full_name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Tên đăng nhập</label>
            <input
              {...register('username')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Số điện thoại</label>
            <input
              {...register('phone_number')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập số điện thoại (tùy chọn)"
            />
            {errors.phone_number && (
              <span className="text-red-500 text-sm mt-1">{errors.phone_number.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Địa chỉ</label>
            <input
              {...register('address')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập địa chỉ (tùy chọn)"
            />
            {errors.address && (
              <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Vai trò</label>
            <select
              {...register('account_role')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 bg-cyan-50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg"
            >
              <option value="staff">Nhân viên</option>
              <option value="agent">Đại lý</option>
            </select>
            {errors.account_role && (
              <span className="text-red-500 text-sm mt-1">{errors.account_role.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập mật khẩu (8+ ký tự, có chữ hoa, thường, số)"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label className="block text-cyan-700 font-semibold mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              {...register('confirm_password')}
              className="w-full px-4 py-3 rounded-xl border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-lg bg-cyan-50 placeholder:text-cyan-300"
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirm_password && (
              <span className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</span>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="flex justify-center mt-6 text-sm">
          <Link to="/login" className="text-cyan-600 hover:underline font-semibold">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;