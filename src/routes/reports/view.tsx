import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

const ViewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - in a real app, this would be fetched from API based on ID
  const reportData = {
    id: id || 'BC001',
    type: 'Doanh số',
    reportDate: '15/01/2024',
    period: 'Hàng tháng',
    amount: 1250000000,
    description: 'Báo cáo doanh số tháng 1/2024',
    details: `Báo cáo tổng hợp doanh số bán hàng trong tháng 1/2024:

1. Tổng quan:
   - Tổng doanh thu: 1,250,000,000 VND
   - Tăng trưởng so với tháng trước: +15%
   - Số đơn hàng: 245 đơn
   - Giá trị đơn hàng trung bình: 5,102,041 VND

2. Phân tích theo sản phẩm:
   - Sản phẩm A: 450,000,000 VND (36%)
   - Sản phẩm B: 320,000,000 VND (25.6%)
   - Sản phẩm C: 280,000,000 VND (22.4%)
   - Các sản phẩm khác: 200,000,000 VND (16%)

3. Phân tích theo khu vực:
   - Khu vực miền Nam: 650,000,000 VND (52%)
   - Khu vực miền Bắc: 400,000,000 VND (32%)
   - Khu vực miền Trung: 200,000,000 VND (16%)

4. Nhận xét và đề xuất:
   - Doanh số tăng trưởng tích cực so với tháng trước
   - Sản phẩm A tiếp tục dẫn đầu về doanh thu
   - Cần tăng cường marketing tại khu vực miền Trung
   - Đề xuất ra mắt chương trình khuyến mãi cho sản phẩm mới`,
    creator: 'Nguyễn Văn A',
    createdDate: '15/01/2024',
    status: 'Đã duyệt'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Doanh thu':
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">Doanh thu</span>
        );
      case 'Công nợ':
        return (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">Công nợ</span>
        );
      case 'Tồn kho':
        return (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">Tồn kho</span>
        );
      case 'Hoạt động':
        return (
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-lg">Hoạt động</span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              CHI TIẾT BÁO CÁO - {reportData.id}
            </h1>
            <Link
              to="/reports"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại danh sách
            </Link>
          </div>
        </div>

        {/* Report Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Mã báo cáo</label>
              <p className="text-gray-900 font-semibold">{reportData.id}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Loại báo cáo</label>
              <div>{getTypeBadge(reportData.type)}</div>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Ngày báo cáo</label>
              <p className="text-gray-900 font-semibold">{reportData.reportDate}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Kỳ báo cáo</label>
              <p className="text-gray-900 font-semibold">{reportData.period}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Số tiền</label>
              <p className="text-gray-900 font-semibold text-lg">{formatCurrency(reportData.amount)}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Trạng thái</label>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                {reportData.status}
              </span>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Người tạo</label>
              <p className="text-gray-900 font-semibold">{reportData.creator}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 font-medium mb-1">Ngày tạo</label>
              <p className="text-gray-900 font-semibold">{reportData.createdDate}</p>
            </div>
          </div>
        </div>

        {/* Report Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả báo cáo</h2>
          <p className="text-gray-700 text-lg">{reportData.description}</p>
        </div>

        {/* Report Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết báo cáo</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {reportData.details}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Xuất PDF
          </button>
          <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
            Xuất Excel
          </button>
          <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors">
            In báo cáo
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewReportPage;
