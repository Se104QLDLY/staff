import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

interface ExportProduct {
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

interface ExportFormData {
  agency: string;
  exportDate: string;
  note?: string;
  products: ExportProduct[];
  status: 'Hoàn thành' | 'Đang xử lý' | 'Hủy';
}

const productSchema = yup.object({
  productName: yup.string().required('Tên sản phẩm là bắt buộc'),
  unit: yup.string().required('Đơn vị là bắt buộc'),
  quantity: yup.number().required('Số lượng là bắt buộc').min(1, 'Số lượng phải lớn hơn 0'),
  unitPrice: yup.number().required('Đơn giá là bắt buộc').min(1000, 'Đơn giá phải ít nhất 1,000 VND'),
}).required();

const schema = yup.object({
  agency: yup.string().required('Đại lý là bắt buộc'),
  exportDate: yup.string().required('Ngày xuất hàng là bắt buộc'),
  note: yup.string(),
  products: yup.array().of(productSchema).min(1, 'Phải có ít nhất một sản phẩm').required(),
  status: yup.mixed<'Hoàn thành' | 'Đang xử lý' | 'Hủy'>().oneOf(['Hoàn thành', 'Đang xử lý', 'Hủy']).required('Trạng thái là bắt buộc'),
});

const EditExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExportFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      products: [{ productName: '', unit: '', quantity: 1, unitPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  const watchedProducts = watch("products");

  // Mock existing data
  const existingData = {
    id: id || 'PX001',
    agency: 'DL001',
    exportDate: '2024-01-15',
    note: 'Xuất hàng theo đơn đặt hàng tháng 1/2024',
    status: 'Hoàn thành' as const,
    products: [
      {
        productName: 'Sản phẩm A',
        unit: 'Thùng',
        quantity: 80,
        unitPrice: 150000
      },
      {
        productName: 'Sản phẩm B',
        unit: 'Hộp',
        quantity: 120,
        unitPrice: 25000
      }
    ]
  };

  // Load existing data
  useEffect(() => {
    setValue('agency', existingData.agency);
    setValue('exportDate', existingData.exportDate);
    setValue('note', existingData.note);
    setValue('status', existingData.status);
    setValue('products', existingData.products);
  }, [setValue]);

  const onSubmit = async (data: ExportFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updated export data:', data);
      alert('Phiếu xuất đã được cập nhật thành công!');
      navigate('/export');
    } catch (error) {
      console.error('Error updating export:', error);
      alert('Có lỗi xảy ra khi cập nhật phiếu xuất!');
    }
  };

  const calculateTotal = () => {
    return watchedProducts?.reduce((total, product) => {
      return total + (product.quantity || 0) * (product.unitPrice || 0);
    }, 0) || 0;
  };

  const agencies = [
    { code: 'DL001', name: 'Đại lý Minh Anh' },
    { code: 'DL002', name: 'Đại lý Thành Công' },
    { code: 'DL003', name: 'Đại lý Hồng Phúc' }
  ];

  const units = ['Thùng', 'Hộp', 'Chai', 'Gói', 'Kg', 'Lít', 'Cái'];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">
              Chỉnh sửa phiếu xuất
            </h1>
            <p className="text-gray-500">Cập nhật thông tin phiếu xuất {existingData.id}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/export/detail/${id}`}
              className="flex items-center px-4 py-2 text-violet-600 hover:text-violet-800 bg-violet-100 hover:bg-violet-200 rounded-xl transition-colors font-semibold shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Xem
            </Link>
            <Link
              to="/export"
              className="flex items-center px-4 py-2 text-sky-600 hover:text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-xl transition-colors font-semibold shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Quay lại
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h2 className="text-xl font-bold text-amber-800 mb-6">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Đại lý <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('agency')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 shadow-sm"
                >
                  <option value="">Chọn đại lý</option>
                  {agencies.map((agency) => (
                    <option key={agency.code} value={agency.code}>
                      {agency.code} - {agency.name}
                    </option>
                  ))}
                </select>
                {errors.agency && (
                  <span className="text-red-500 text-sm mt-1">{errors.agency.message}</span>
                )}
              </div>
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Ngày lập phiếu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('exportDate')}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 shadow-sm"
                  />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                </div>
                {errors.exportDate && (
                  <span className="text-red-500 text-sm mt-1">{errors.exportDate.message}</span>
                )}
              </div>
              <div>
                <label className="block text-amber-900 font-semibold mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800 shadow-sm"
                >
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Hủy">Hủy</option>
                </select>
                {errors.status && (
                  <span className="text-red-500 text-sm mt-1">{errors.status.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-violet-50 rounded-2xl p-6 border border-violet-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-violet-800">Danh sách sản phẩm</h2>
              <button
                type="button"
                onClick={() => append({ productName: '', unit: '', quantity: 1, unitPrice: 0 })}
                className="flex items-center px-5 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-bold shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Thêm sản phẩm
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-violet-800 uppercase">
                    <th className="py-3 px-4 font-semibold">STT</th>
                    <th className="py-3 px-4 font-semibold">Mặt hàng</th>
                    <th className="py-3 px-4 font-semibold">Đơn vị tính</th>
                    <th className="py-3 px-4 font-semibold">Số lượng</th>
                    <th className="py-3 px-4 font-semibold">Đơn giá</th>
                    <th className="py-3 px-4 font-semibold">Thành tiền</th>
                    <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => {
                    const quantity = watchedProducts?.[index]?.quantity || 0;
                    const unitPrice = watchedProducts?.[index]?.unitPrice || 0;
                    const total = quantity * unitPrice;

                    return (
                      <tr key={field.id} className="border-b border-violet-100 align-top">
                        <td className="px-4 py-4 text-center text-violet-800 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Sản phẩm A"
                            {...register(`products.${index}.productName` as const)}
                            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800 shadow-sm"
                          />
                           {errors.products?.[index]?.productName && (
                            <span className="text-red-500 text-xs mt-1">{errors.products[index]?.productName?.message}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                           <input
                              placeholder="Thùng"
                              {...register(`products.${index}.unit` as const)}
                              className="w-32 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800 shadow-sm"
                            />
                            {errors.products?.[index]?.unit && (
                              <span className="text-red-500 text-xs mt-1">{errors.products[index]?.unit?.message}</span>
                            )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            placeholder="80"
                            {...register(`products.${index}.quantity` as const)}
                            className="w-24 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800 shadow-sm"
                          />
                          {errors.products?.[index]?.quantity && (
                            <span className="text-red-500 text-xs mt-1">{errors.products[index]?.quantity?.message}</span>
                          )}
                        </td>
                         <td className="px-4 py-3">
                          <input
                            type="number"
                            placeholder="150000"
                            {...register(`products.${index}.unitPrice` as const)}
                            className="w-32 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800 shadow-sm"
                          />
                          {errors.products?.[index]?.unitPrice && (
                            <span className="text-red-500 text-xs mt-1">{errors.products[index]?.unitPrice?.message}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-gray-800 font-medium">
                          {total.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 font-semibold bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end items-center gap-4 bg-violet-100 p-4 rounded-xl">
              <span className="text-lg font-bold text-violet-900">Tổng cộng:</span>
              <span className="text-2xl font-extrabold text-violet-900">
                {calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/export')}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-300 font-semibold transition-colors shadow-lg"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditExportPage; 