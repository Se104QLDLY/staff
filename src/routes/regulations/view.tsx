import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRegulationDetail, type Regulation } from '../../api/regulation.api';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

const RegulationDetailPage: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (key) {
      setLoading(true);
      setError(null);
      getRegulationDetail(key)
        .then(data => {
          setRegulation(data);
        })
        .catch(err => {
          console.error('Error fetching regulation:', err);
          setError('Không thể tải thông tin quy định');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [key]);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/regulations" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách quy định
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Chi tiết quy định</h1>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
                <Link 
                  to="/regulations" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Quay lại danh sách
                </Link>
              </div>
            ) : regulation ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã quy định
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <code className="text-blue-600 font-mono text-sm">{regulation.regulation_key}</code>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá trị
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <span className="text-gray-900">{regulation.regulation_value}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border min-h-[80px]">
                      <span className="text-gray-900">
                        {regulation.description || 'Chưa có mô tả'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày cập nhật
                    </label>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="text-blue-800 font-medium">
                        {new Date(regulation.updated_at).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {regulation.last_updated_by_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Người cập nhật
                      </label>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <span className="text-green-800 font-medium">
                          {regulation.last_updated_by_name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">Lưu ý</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Bạn chỉ có quyền xem thông tin quy định. 
                          Để thay đổi giá trị, vui lòng liên hệ quản trị viên.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">Không tìm thấy quy định</div>
                <Link 
                  to="/regulations" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Quay lại danh sách
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegulationDetailPage; 