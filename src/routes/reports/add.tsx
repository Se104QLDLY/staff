import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout/DashboardLayout';

interface ReportFormInputs {
  type: 'sales' | 'debt' | 'stock';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  notes?: string;
}

interface SalesRow { agency: string; numExport: string; totalValue: string; ratio: string; }
interface DebtRow { agency: string; debtStart: string; incurred: string; debtEnd: string; }
interface StockRow { agency: string; stockStart: string; import: string; export: string; stockEnd: string; }

const schema = yup.object().shape({
  type: yup.string().required('Vui lòng chọn loại báo cáo'),
  period: yup.string().required('Vui lòng chọn kỳ báo cáo'),
  startDate: yup.string().required('Vui lòng chọn ngày bắt đầu'),
  endDate: yup.string().required('Vui lòng chọn ngày kết thúc'),
  notes: yup.string().max(500, 'Ghi chú không được vượt quá 500 ký tự')
});

const AddReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('');
  const [salesRows, setSalesRows] = useState<SalesRow[]>([{ agency: '', numExport: '', totalValue: '', ratio: '' }]);
  const [debtRows, setDebtRows] = useState<DebtRow[]>([{ agency: '', debtStart: '', incurred: '', debtEnd: '' }]);
  const [stockRows, setStockRows] = useState<StockRow[]>([{ agency: '', stockStart: '', import: '', export: '', stockEnd: '' }]);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ReportFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<ReportFormInputs> = async (data) => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    navigate('/reports');
  };

  const addRow = (type: string) => {
    if (type === 'sales') setSalesRows([...salesRows, { agency: '', numExport: '', totalValue: '', ratio: '' }]);
    if (type === 'debt') setDebtRows([...debtRows, { agency: '', debtStart: '', incurred: '', debtEnd: '' }]);
    if (type === 'stock') setStockRows([...stockRows, { agency: '', stockStart: '', import: '', export: '', stockEnd: '' }]);
  };
  const removeRow = (type: string, idx: number) => {
    if (type === 'sales') setSalesRows(salesRows.filter((_, i) => i !== idx));
    if (type === 'debt') setDebtRows(debtRows.filter((_, i) => i !== idx));
    if (type === 'stock') setStockRows(stockRows.filter((_, i) => i !== idx));
  };
  const handleTableChange = (type: string, idx: number, field: string, value: string) => {
    if (type === 'sales') setSalesRows(salesRows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
    if (type === 'debt') setDebtRows(debtRows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
    if (type === 'stock') setStockRows(stockRows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
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
                onChange={e => { setReportType(e.target.value); setValue('type', e.target.value); }}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-lg bg-blue-50"
              >
                <option value="">Chọn loại báo cáo</option>
                <option value="sales">Báo cáo doanh số</option>
                <option value="debt">Báo cáo công nợ</option>
                <option value="stock">Báo cáo tồn kho</option>
              </select>
              {errors.type && (
                <span className="text-red-500 text-sm mt-1">{errors.type.message}</span>
              )}
          </div>
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
          {/* Hiển thị bảng nhập liệu theo loại báo cáo */}
          {reportType === 'sales' && (
            <div className="mt-8">
              <div className="font-bold text-lg mb-2">BM6.1 - Báo Cáo Doanh Số</div>
              <table className="min-w-full border border-blue-200 rounded-xl overflow-hidden">
                <thead className="bg-blue-200 text-blue-900">
                  <tr>
                    <th className="px-3 py-2">STT</th>
                    <th className="px-3 py-2">Đại Lý</th>
                    <th className="px-3 py-2">Số Phiếu Xuất</th>
                    <th className="px-3 py-2">Tổng Trị Giá</th>
                    <th className="px-3 py-2">Tỷ Lệ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {salesRows.map((row, idx) => (
                    <tr key={idx} className="bg-blue-50">
                      <td className="px-3 py-2 text-center">{idx + 1}</td>
                      <td className="px-3 py-2"><input value={row.agency} onChange={e => handleTableChange('sales', idx, 'agency', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.numExport} onChange={e => handleTableChange('sales', idx, 'numExport', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.totalValue} onChange={e => handleTableChange('sales', idx, 'totalValue', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.ratio} onChange={e => handleTableChange('sales', idx, 'ratio', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><button type="button" onClick={() => removeRow('sales', idx)} className="text-red-500 font-bold">X</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => addRow('sales')} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">+ Thêm dòng</button>
            </div>
          )}
          {reportType === 'debt' && (
            <div className="mt-8">
              <div className="font-bold text-lg mb-2">BM6.2 - Báo Cáo Công Nợ Đại Lý</div>
              <table className="min-w-full border border-blue-200 rounded-xl overflow-hidden">
                <thead className="bg-blue-200 text-blue-900">
                  <tr>
                    <th className="px-3 py-2">STT</th>
                    <th className="px-3 py-2">Đại Lý</th>
                    <th className="px-3 py-2">Nợ Đầu</th>
                    <th className="px-3 py-2">Phát Sinh</th>
                    <th className="px-3 py-2">Nợ Cuối</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {debtRows.map((row, idx) => (
                    <tr key={idx} className="bg-blue-50">
                      <td className="px-3 py-2 text-center">{idx + 1}</td>
                      <td className="px-3 py-2"><input value={row.agency} onChange={e => handleTableChange('debt', idx, 'agency', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.debtStart} onChange={e => handleTableChange('debt', idx, 'debtStart', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.incurred} onChange={e => handleTableChange('debt', idx, 'incurred', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.debtEnd} onChange={e => handleTableChange('debt', idx, 'debtEnd', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><button type="button" onClick={() => removeRow('debt', idx)} className="text-red-500 font-bold">X</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => addRow('debt')} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">+ Thêm dòng</button>
            </div>
          )}
          {reportType === 'stock' && (
            <div className="mt-8">
              <div className="font-bold text-lg mb-2">BM6.3 - Báo Cáo Tồn Kho Đại Lý</div>
              <table className="min-w-full border border-blue-200 rounded-xl overflow-hidden">
                <thead className="bg-blue-200 text-blue-900">
                  <tr>
                    <th className="px-3 py-2">STT</th>
                    <th className="px-3 py-2">Đại Lý</th>
                    <th className="px-3 py-2">Tồn Đầu</th>
                    <th className="px-3 py-2">Nhập</th>
                    <th className="px-3 py-2">Xuất</th>
                    <th className="px-3 py-2">Tồn Cuối</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stockRows.map((row, idx) => (
                    <tr key={idx} className="bg-blue-50">
                      <td className="px-3 py-2 text-center">{idx + 1}</td>
                      <td className="px-3 py-2"><input value={row.agency} onChange={e => handleTableChange('stock', idx, 'agency', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.stockStart} onChange={e => handleTableChange('stock', idx, 'stockStart', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.import} onChange={e => handleTableChange('stock', idx, 'import', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.export} onChange={e => handleTableChange('stock', idx, 'export', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><input value={row.stockEnd} onChange={e => handleTableChange('stock', idx, 'stockEnd', e.target.value)} className="w-full rounded border px-2" /></td>
                      <td className="px-3 py-2"><button type="button" onClick={() => removeRow('stock', idx)} className="text-red-500 font-bold">X</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => addRow('stock')} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">+ Thêm dòng</button>
            </div>
          )}
          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo báo cáo...
                </div>
              ) : (
                'Tạo báo cáo'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddReportPage;
