import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="text-center px-6">
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-red-200 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">😵</div>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-red-700 mb-4">
          Trang không tìm thấy
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. 
          Hãy kiểm tra lại URL hoặc quay về trang chủ.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all font-semibold text-lg"
          >
            Về trang chủ
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-block px-8 py-3 border-2 border-red-600 text-red-700 rounded-xl hover:bg-red-50 transition-all font-semibold text-lg"
          >
            Quay lại
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Nếu bạn nghĩ đây là lỗi, vui lòng 
            <a href="mailto:support@example.com" className="text-red-600 hover:underline ml-1">
              liên hệ với chúng tôi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 