import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';
import { FileText, User, Calendar, BadgeCheck, Layers, ArrowLeft, DollarSign, Info, ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';

const ViewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - in a real app, this would be fetched from API based on ID
  const reportData = {
    id: id || 'BC001',
    type: 'Doanh thu',
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
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg"><DollarSign className="h-4 w-4"/>Doanh thu</span>;
      case 'Công nợ':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg"><AlertCircle className="h-4 w-4"/>Công nợ</span>;
      case 'Tồn kho':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg"><Layers className="h-4 w-4"/>Tồn kho</span>;
      case 'Hoạt động':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-lg"><ClipboardList className="h-4 w-4"/>Hoạt động</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 mb-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-blue-600" />
                <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Chi tiết báo cáo</h1>
              </div>
              <Link
                to="/reports"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold shadow-md"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                <BadgeCheck className="h-4 w-4" />
                Mã: {reportData.id}
              </span>
              {getTypeBadge(reportData.type)}
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200">
                <CheckCircle className="h-4 w-4" />
                {reportData.status}
              </span>
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Người tạo:</span>
                <span className="text-gray-900 font-bold">{reportData.creator}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày tạo:</span>
                <span className="text-gray-900 font-bold">{reportData.createdDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày báo cáo:</span>
                <span className="text-gray-900 font-bold">{reportData.reportDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Kỳ báo cáo:</span>
                <span className="text-gray-900 font-bold">{reportData.period}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-700">Số tiền:</span>
                <span className="text-2xl font-extrabold text-green-700">{formatCurrency(reportData.amount)}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-gray-700">Trạng thái:</span>
                <span className="text-emerald-700 font-bold">{reportData.status}</span>
              </div>
            </div>
          </div>

          {/* Mô tả báo cáo */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><Info className="h-5 w-5 text-blue-500"/>Mô tả báo cáo</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{reportData.description}</p>
          </div>

          {/* Chi tiết báo cáo */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-500"/>Chi tiết báo cáo</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 overflow-x-auto">
              <pre className="text-gray-700 whitespace-pre-wrap font-mono text-base leading-relaxed">
                {reportData.details}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
              <FileText className="h-5 w-5" /> Xuất PDF
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md flex items-center gap-2">
              <Layers className="h-5 w-5" /> Xuất Excel
            </button>
            <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-md flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> In báo cáo
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewReportPage;
