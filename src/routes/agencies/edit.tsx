import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Edit, ArrowLeft } from 'lucide-react';

interface AgencyFormData {
  code: string;
  name: string;
  typeId: number;
  district: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  creditLimit: number;
  status: 'Hoạt động' | 'Tạm dừng' | 'Ngừng hợp tác';
}

const schema = yup.object({
  code: yup
    .string()
    .required('Mã đại lý là bắt buộc')
    .matches(/^DL\d{3,}$/, 'Mã đại lý phải có định dạng DL001, DL002...'),
  name: yup
    .string()
    .required('Tên đại lý là bắt buộc')
    .min(3, 'Tên đại lý phải có ít nhất 3 ký tự')
    .max(100, 'Tên đại lý không được vượt quá 100 ký tự'),
  typeId: yup
    .number()
    .required('Loại đại lý là bắt buộc'),
  district: yup
    .string()
    .required('Quận/Huyện là bắt buộc'),
  address: yup
    .string()
    .required('Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^0\d{9}$/, 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ'),
  manager: yup
    .string()
    .required('Người quản lý là bắt buộc')
    .max(50, 'Tên người quản lý không được vượt quá 50 ký tự'),
  creditLimit: yup
    .number()
    .required('Hạn mức tín dụng là bắt buộc')
    .min(1000000, 'Hạn mức tối thiểu là 1,000,000 VND')
    .max(100000000, 'Hạn mức tối đa là 100,000,000 VND'),
  status: yup
    .string()
    .required('Trạng thái là bắt buộc')
    .oneOf(['Hoạt động', 'Tạm dừng', 'Ngừng hợp tác'] as const, 'Trạng thái không hợp lệ'),
});

const EditAgencyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AgencyFormData>({
    resolver: yupResolver(schema) as any,
  });

  // Mock data - trong thực tế sẽ fetch từ API
  const existingAgency = {
    id: id || '1',
    code: 'DL001',
    name: 'Đại lý Minh Anh',
    typeId: 1,
    district: 'Quận 1',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '0901234567',
    email: 'minhanh@email.com',
    manager: 'Nguyễn Minh Anh',
    creditLimit: 10000000,
    status: 'Hoạt động' as const,
  };

  // Load existing data into form
  useEffect(() => {
    if (existingAgency) {
      setValue('code', existingAgency.code);
      setValue('name', existingAgency.name);
      setValue('typeId', existingAgency.typeId);
      setValue('district', existingAgency.district);
      setValue('address', existingAgency.address);
      setValue('phone', existingAgency.phone);
      setValue('email', existingAgency.email);
      setValue('manager', existingAgency.manager || '');
      setValue('creditLimit', existingAgency.creditLimit);
      setValue('status', existingAgency.status);
    }
  }, [setValue]);

  const onSubmit: (data: AgencyFormData) => Promise<void> = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updated agency data:', data);
      
      // Show success message and redirect
      alert('Đại lý đã được cập nhật thành công!');
      navigate('/agencies');
    } catch (error) {
      console.error('Error updating agency:', error);
      alert('Có lỗi xảy ra khi cập nhật đại lý!');
    }
  };

  const agencyTypes = [
    { id: 1, name: 'Cấp 1' },
    { id: 2, name: 'Cấp 2' },
    { id: 3, name: 'Cấp 3' }
  ];

  const districts = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình',
    'Quận Tân Phú', 'Quận Thủ Đức', 'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Nhà Bè'
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-400/30">
                <Edit className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">Chỉnh sửa đại lý</h1>
                <p className="text-blue-600 text-base mt-1">Cập nhật thông tin đại lý {existingAgency.code}</p>
              </div>
            </div>
            <Link to="/agencies" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-semibold shadow-md">
              <ArrowLeft className="h-5 w-5" /> Quay lại
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mã đại lý */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Mã đại lý <span className="text-red-500">*</span>
              </label>
              <input
                {...register('code')}
                placeholder="Ví dụ: DL001"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.code && (
                <span className="text-red-500 text-sm mt-1">{errors.code.message}</span>
              )}
            </div>

            {/* Loại đại lý */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Loại đại lý <span className="text-red-500">*</span>
              </label>
              <select
                {...register('typeId')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              >
                <option value="">Chọn loại đại lý</option>
                {agencyTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.typeId && (
                <span className="text-red-500 text-sm mt-1">{errors.typeId.message}</span>
              )}
            </div>

            {/* Tên đại lý */}
            <div className="lg:col-span-2">
              <label className="block text-blue-700 font-semibold mb-2">
                Tên đại lý <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                placeholder="Nhập tên đại lý"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
              )}
            </div>

            {/* Quận/Huyện */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                {...register('district')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && (
                <span className="text-red-500 text-sm mt-1">{errors.district.message}</span>
              )}
            </div>

            {/* Người quản lý */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Người quản lý
              </label>
              <input
                {...register('manager')}
                placeholder="Tên người quản lý (tùy chọn)"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.manager && (
                <span className="text-red-500 text-sm mt-1">{errors.manager.message}</span>
              )}
            </div>

            {/* Địa chỉ */}
            <div className="lg:col-span-2">
              <label className="block text-blue-700 font-semibold mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('address')}
                rows={3}
                placeholder="Nhập địa chỉ chi tiết"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm resize-none"
              />
              {errors.address && (
                <span className="text-red-500 text-sm mt-1">{errors.address.message}</span>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone')}
                placeholder="0901234567"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm mt-1">{errors.phone.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
              )}
            </div>

            {/* Hạn mức tín dụng */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Hạn mức tín dụng (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('creditLimit')}
                placeholder="10000000"
                min="1000000"
                max="100000000"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
              {errors.creditLimit && (
                <span className="text-red-500 text-sm mt-1">{errors.creditLimit.message}</span>
              )}
            </div>

            {/* Trạng thái */}
            <div className="lg:col-span-1">
              <label className="block text-blue-700 font-semibold mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm dừng">Tạm dừng</option>
                <option value="Ngừng hợp tác">Ngừng hợp tác</option>
              </select>
              {errors.status && (
                <span className="text-red-500 text-sm mt-1">{errors.status.message}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="lg:col-span-2 flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg shadow-md transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  <>
                    <Edit className="h-5 w-5" /> Cập nhật đại lý
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/agencies')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 font-bold text-lg shadow-md transition-all"
              >
                <ArrowLeft className="h-5 w-5" /> Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditAgencyPage; 