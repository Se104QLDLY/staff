import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';
import { getAgencies, generateReport, type AgencyOption } from '../../api/report.api';
import axios from 'axios';

// Create direct axios instance with correct backend URL  
const backendApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
});
import { toast } from 'react-hot-toast';

interface ReportFormInputs {
  type: 'sales' | 'debt' | 'inventory';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  agency_id?: number;
  notes?: string;
}

const schema: yup.ObjectSchema<ReportFormInputs> = yup.object().shape({
  type: yup.mixed<'sales' | 'debt' | 'inventory'>().oneOf(['sales', 'debt', 'inventory']).required('Vui lòng chọn loại báo cáo'),
  period: yup.mixed<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>().oneOf(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).required('Vui lòng chọn kỳ báo cáo'),
  startDate: yup.string().required('Vui lòng chọn ngày bắt đầu'),
  endDate: yup.string().required('Vui lòng chọn ngày kết thúc'),
  agency_id: yup.number().optional(),
  notes: yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự')
});

type ReportType = 'sales' | 'debt' | 'inventory' | '';

const AddReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('');
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ReportFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  // Load danh sách đại lý khi component mount
  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setLoadingAgencies(true);
        const response = await backendApi.get('/finance/reports/agencies/');
        setAgencies(response.data);
      } catch (error) {
        console.error('Error loading agencies:', error);
        toast.error('Không thể tải danh sách đại lý');
      } finally {
        setLoadingAgencies(false);
      }
    };

    loadAgencies();
  }, []);

  const onSubmit: SubmitHandler<ReportFormInputs> = async (data) => {
    setIsGenerating(true);
    try {
      const payload: any = {
        report_type: data.type,
        start_date: data.startDate,
        end_date: data.endDate,
      };
      if (data.agency_id) {
        payload.agency_id = data.agency_id;
      }
      console.log('Payload gửi lên backend:', payload);
      const response = await backendApi.post('/finance/reports/generate/', payload);
      
      console.log('Report created:', response.data);
      toast.success(`Báo cáo ${data.type === 'sales' ? 'doanh số' : data.type === 'debt' ? 'công nợ' : 'tồn kho'} đã được tạo thành công!`);
      navigate('/reports');
    } catch (error: any) {
      console.error('Error generating report:', error);
      const errorMsg = error.response?.data?.error || 'Có lỗi xảy ra khi tạo báo cáo';
      toast.error(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setReportType(type as ReportType);
    setValue('type', type as 'sales' | 'debt' | 'inventory');
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">
            Lập báo cáo mới
          </h1>
          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors font-semibold"
          >
            ← Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Type */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">Loại báo cáo *</label>
              <select
                {...register('type')}
                value={reportType}
                onChange={e => handleTypeChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50"
              >
                <option value="">Chọn loại báo cáo</option>
                <option value="sales">Báo cáo doanh số</option>
                <option value="debt">Báo cáo công nợ</option>
                <option value="inventory">Báo cáo tồn kho</option>
              </select>
              {errors.type && (
                <span className="text-red-500 text-sm mt-1">{errors.type.message}</span>
              )}
            </div>

            {/* Agency Selection - Only for sales and debt reports */}
            {(reportType === 'sales' || reportType === 'debt') && (
              <div>
                <label className="block text-blue-700 font-semibold mb-2">Đại lý</label>
                <select
                  {...register('agency_id')}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50"
                  disabled={loadingAgencies}
                >
                  <option value="">Tất cả đại lý</option>
                  {agencies.map((agency) => (
                    <option key={agency.agency_id} value={agency.agency_id}>
                      {agency.agency_name}
                    </option>
                  ))}
                </select>
                {loadingAgencies && (
                  <span className="text-blue-500 text-sm mt-1">Đang tải danh sách đại lý...</span>
                )}
              </div>
            )}

            {/* Report Period */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">Kỳ báo cáo *</label>
              <select
                {...register('period')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50"
              >
                <option value="">Chọn kỳ báo cáo</option>
                <option value="daily">Theo ngày</option>
                <option value="weekly">Theo tuần</option>
                <option value="monthly">Theo tháng</option>
                <option value="quarterly">Theo quý</option>
                <option value="yearly">Theo năm</option>
              </select>
              {errors.period && (
                <span className="text-red-500 text-sm mt-1">{errors.period.message}</span>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">Ngày bắt đầu *</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50"
              />
              {errors.startDate && (
                <span className="text-red-500 text-sm mt-1">{errors.startDate.message}</span>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">Ngày kết thúc *</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50"
              />
              {errors.endDate && (
                <span className="text-red-500 text-sm mt-1">{errors.endDate.message}</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-blue-700 font-semibold mb-2">Ghi chú</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50 resize-none"
              placeholder="Ghi chú thêm về báo cáo..."
            />
            {errors.notes && (
              <span className="text-red-500 text-sm mt-1">{errors.notes.message}</span>
            )}
          </div>

          {/* Report Description */}
          {reportType && (
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Mô tả báo cáo</h3>
              {reportType === 'sales' && (
                <p className="text-blue-700">
                  Báo cáo doanh số bao gồm: số phiếu xuất, tổng doanh thu, tỷ lệ đóng góp của mỗi đại lý.
                </p>
              )}
              {reportType === 'debt' && (
                <p className="text-blue-700">
                  Báo cáo công nợ bao gồm: nợ đầu kỳ, phát sinh trong kỳ, thanh toán trong kỳ, nợ cuối kỳ.
                  <br />
                  <strong>Công thức:</strong> Nợ cuối kỳ = Nợ đầu kỳ + Phát sinh - Thanh toán
                </p>
              )}
              {reportType === 'inventory' && (
                <p className="text-blue-700">
                  Báo cáo tồn kho chỉ hiển thị các mặt hàng có số lượng tồn kho lớn hơn 0.
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="px-6 py-3 text-blue-600 bg-blue-100 rounded-xl hover:bg-blue-200 transition-colors font-semibold"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Đang tạo báo cáo...' : 'Tạo báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddReportPage;
