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
});

const schema = yup.object({
  agency: yup.string().required('Đại lý là bắt buộc'),
  exportDate: yup.string().required('Ngày xuất hàng là bắt buộc'),
  note: yup.string(),
  products: yup.array().of(productSchema).min(1, 'Phải có ít nhất một sản phẩm'),
  status: yup.string().required('Trạng thái là bắt buộc'),
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
            <p className="text-gray-600">Cập nhật thông tin phiếu xuất {existingData.id}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/export/detail/${id}`}
              className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Xem
            </Link>
            <Link
              to="/export"
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors font-semibold"
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
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-100">
            <h2 className="text-xl font-bold text-orange-800 mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-orange-700 font-semibold mb-2">
                  Đại lý <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('agency')}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg shadow-sm"
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
                <label className="block text-orange-700 font-semibold mb-2">
                  Ngày xuất hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('exportDate')}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg shadow-sm"
                />
                {errors.exportDate && (
                  <span className="text-red-500 text-sm mt-1">{errors.exportDate.message}</span>
                )}
              </div>

              <div>
                <label className="block text-orange-700 font-semibold mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg shadow-sm"
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Hủy">Hủy</option>
                </select>
                {errors.status && (
                  <span className="text-red-500 text-sm mt-1">{errors.status.message}</span>
                )}
              </div>

              <div className="lg:col-span-3">
                <label className="block text-orange-700 font-semibold mb-2">Ghi chú</label>
                <textarea
                  {...register('note')}
                  rows={3}
                  placeholder="Ghi chú về phiếu xuất (tùy chọn)"
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg shadow-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-800">Danh sách sản phẩm</h2>
              <button
                type="button"
                onClick={() => append({ productName: '', unit: '', quantity: 1, unitPrice: 0 })}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white p-4 rounded-lg border-2 border-purple-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-purple-800">Sản phẩm {index + 1}</h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-purple-700 font-semibold mb-1">
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register(`products.${index}.productName`)}
                        placeholder="Nhập tên sản phẩm"
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {errors.products?.[index]?.productName && (
                        <span className="text-red-500 text-xs mt-1">{errors.products[index]?.productName?.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-purple-700 font-semibold mb-1">
                        Đơn vị <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register(`products.${index}.unit`)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Chọn đơn vị</option>
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                      {errors.products?.[index]?.unit && (
                        <span className="text-red-500 text-xs mt-1">{errors.products[index]?.unit?.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-purple-700 font-semibold mb-1">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                        min="1"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {errors.products?.[index]?.quantity && (
                        <span className="text-red-500 text-xs mt-1">{errors.products[index]?.quantity?.message}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-purple-700 font-semibold mb-1">
                        Đơn giá (VND) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`products.${index}.unitPrice`, { valueAsNumber: true })}
                        min="1000"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {errors.products?.[index]?.unitPrice && (
                        <span className="text-red-500 text-xs mt-1">{errors.products[index]?.unitPrice?.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-purple-700 font-semibold">
                      Thành tiền: {((watchedProducts?.[index]?.quantity || 0) * (watchedProducts?.[index]?.unitPrice || 0)).toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {errors.products && typeof errors.products.message === 'string' && (
              <span className="text-red-500 text-sm mt-2">{errors.products.message}</span>
            )}

            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-purple-800 font-bold text-lg">Tổng cộng:</span>
                <span className="text-purple-600 font-bold text-xl">
                  {calculateTotal().toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all text-lg border-2 border-transparent hover:border-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Đang cập nhật...
                </div>
              ) : (
                'Cập nhật phiếu xuất'
              )}
            </button>
            <Link
              to="/export"
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all text-lg text-center"
            >
              Hủy bỏ
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditExportPage; 