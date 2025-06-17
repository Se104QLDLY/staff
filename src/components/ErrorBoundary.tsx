import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
          <div className="text-center px-6 max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            
            <h1 className="text-3xl font-bold text-red-700 mb-4">
              Oops! Có lỗi xảy ra
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Rất tiếc, ứng dụng đã gặp phải lỗi không mong muốn. 
              Hãy thử làm mới trang hoặc quay về trang chủ.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="font-semibold text-red-700 mb-2">Chi tiết lỗi:</h3>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all font-semibold"
              >
                Làm mới trang
              </button>
              
              <Link
                to="/"
                className="px-6 py-3 border-2 border-red-600 text-red-700 rounded-xl hover:bg-red-50 transition-all font-semibold text-center"
              >
                Về trang chủ
              </Link>
            </div>
            
            <div className="mt-8">
              <p className="text-sm text-gray-500">
                Nếu vấn đề vẫn tiếp tục, vui lòng 
                <a href="mailto:support@example.com" className="text-red-600 hover:underline ml-1">
                  liên hệ hỗ trợ
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 