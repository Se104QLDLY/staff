import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

interface ForgotPasswordInputs {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    console.log('Reset password for:', data.email);
    // Xử lý gửi email reset password ở đây
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border-2 border-green-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Email đã được gửi!</h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã gửi hướng dẫn reset mật khẩu đến email <br />
              <strong>{getValues('email')}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để tìm email từ chúng tôi.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-center"
              >
                Quay về đăng nhập
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border-2 border-blue-100">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Quên mật khẩu?</h2>
          <p className="text-gray-600">
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn reset mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-blue-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50 placeholder:text-blue-300"
              placeholder="Nhập email của bạn"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg"
          >
            Gửi hướng dẫn reset
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            ← Quay về đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 