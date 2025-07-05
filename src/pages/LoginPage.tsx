import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../api/auth.api';
import type { LoginCredentials } from '../api/auth.api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError(null);
      await login(data);
      navigate('/');
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Home Icon" className="mx-auto mb-3 h-12 w-12 drop-shadow" />
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent drop-shadow mb-2 flex items-center justify-center gap-2">
            Đăng nhập
          </h2>
          <div className="flex justify-center">
            <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mb-3"></span>
          </div>
          <p className="text-gray-500 text-base font-medium tracking-wide">
            Chào mừng bạn quay lại hệ thống!
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Tên đăng nhập</label>
            <input
              {...register('username')}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50 placeholder:text-blue-300"
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
            )}
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50 placeholder:text-blue-300"
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="flex justify-between mt-6 text-sm">
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">Chưa có tài khoản?</Link>
          <Link to="/forgot-password" className="text-blue-400 hover:underline">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
};