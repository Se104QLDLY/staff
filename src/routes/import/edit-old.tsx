import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { FileText, Calendar, DollarSign, Plus, Trash2, Save, ArrowLeft, ChevronDown, CheckCircle, AlertTriangle, XCircle, Package } from 'lucide-react';
import type { SubmitHandler } from 'react-hook-form';

interface ImportProduct {
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

interface ImportFormData {
  importId: string;
  importDate: string;
  note?: string;
  products: ImportProduct[];
  status: 'Hoàn thành' | 'Đang xử lý' | 'Hủy';
}

const productSchema = yup.object({
  productName: yup.string().required('Tên sản phẩm là bắt buộc'),
  unit: yup.string().required('Đơn vị là bắt buộc'),
  quantity: yup.number().typeError('Phải là số').required('Số lượng là bắt buộc').min(1, 'Số lượng phải lớn hơn 0'),
  unitPrice: yup.number().typeError('Phải là số').required('Đơn giá là bắt buộc').min(1000, 'Đơn giá phải lớn hơn 1,000'),
}).required();

const schema: yup.ObjectSchema<ImportFormData> = yup.object({
  importId: yup.string().required('Mã phiếu nhập là bắt buộc'),
  importDate: yup.string().required('Ngày lập phiếu là bắt buộc'),
  note: yup.string(),
  products: yup.array().of(productSchema).min(1, 'Phải có ít nhất một sản phẩm').required(),
  status: yup.mixed<'Hoàn thành' | 'Đang xử lý' | 'Hủy'>().oneOf(['Hoàn thành', 'Đang xử lý', 'Hủy']).required('Trạng thái là bắt buộc'),
});

// --- Helper Components & Functions ---

const CustomStyles = () => (
    <style>{`
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
            transform-origin: top;
        }
    `}</style>
);

const FormInput = ({ label, name, register, error, icon, ...props }: {
  label: string;
  name: string;
  register: any;
  error: any;
  icon: React.ReactNode;
  [key: string]: any;
}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-zinc-600 mb-1.5">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">{icon}</span>
            <input id={name} {...register(name)} {...props} className={`w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-800 shadow-sm transition-all duration-200 ${error ? 'border-red-500 ring-red-200' : ''}`} />
        </div>
        {error && <p className="text-red-600 text-xs mt-1.5">{error.message}</p>}
    </div>
);

const getStatusChip = (status: string) => {
    switch (status) {
        case 'Hoàn thành': return <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full"><CheckCircle size={14}/>{status}</span>;
        case 'Đang xử lý': return <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full"><AlertTriangle size={14}/>{status}</span>;
        case 'Hủy': return <span className="flex items-center gap-1.5 text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full"><XCircle size={14}/>{status}</span>;
        default: return null;
    }
};

const StatusSelector = ({ control, name, error, options, label, placeholder }: {
  control: any;
  name: string;
  error: any;
  options: Array<{value: string; label: string}>;
  label: string;
  placeholder: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { field } = useController({ name, control });
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef}>
             <label htmlFor={name} className="block text-sm font-medium text-zinc-600 mb-1.5">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    id={name}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between text-left px-3.5 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 ${error ? 'border-red-500 ring-red-200' : ''}`}
                >
                    <div className="flex-grow">
                        {getStatusChip(field.value) || <span className="text-zinc-400">{placeholder}</span>}
                    </div>
                    <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                 {isOpen && (
                    <ul className="absolute z-20 w-full mt-1.5 bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden animate-fade-in-down">
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    field.onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className="px-3.5 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center text-sm"
                            >
                                {getStatusChip(opt.value)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {error && <p className="text-red-600 text-xs mt-1.5">{error.message}</p>}
        </div>
    );
};

const EditImportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const statusOptions = [{value: 'Hoàn thành', label: 'Hoàn thành'}, {value: 'Đang xử lý', label: 'Đang xử lý'}, {value: 'Hủy', label: 'Hủy'}];
  
  // Mock existing data
  const existingData = {
    importId: id || 'PN001',
    importDate: '2024-01-15',
    note: 'Nhập hàng theo đơn đặt hàng tháng 1/2024',
    status: 'Hoàn thành' as const,
    products: [
      {
        productName: 'Sản phẩm A',
        unit: 'Thùng',
        quantity: 100,
        unitPrice: 120000
      },
      {
        productName: 'Sản phẩm B',
        unit: 'Hộp',
        quantity: 150,
        unitPrice: 20000
      }
    ]
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ImportFormData>({
    resolver: yupResolver(schema),
    defaultValues: existingData
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  const watchedProducts = watch("products");

  const onSubmit: SubmitHandler<ImportFormData> = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updated import data:', data);
      alert('Phiếu nhập đã được cập nhật thành công!');
      navigate('/import');
    } catch (error) {
      console.error('Error updating import:', error);
      alert('Có lỗi xảy ra khi cập nhật phiếu nhập!');
    }
  };

  const calculateTotal = () => {
    return watchedProducts?.reduce((total, product) => {
      return total + (product.quantity || 0) * (product.unitPrice || 0);
    }, 0) || 0;
  };

  return (
    <DashboardLayout>
      <CustomStyles />
      <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-zinc-800">Chỉnh sửa Phiếu Nhập</h1>
                <p className="text-zinc-500 text-base mt-1">Cập nhật thông tin phiếu nhập mã <span className="font-semibold text-zinc-600">#{id}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/import" className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-200 font-semibold gap-2 text-sm">
                <ArrowLeft size={16} /><span>Quay lại</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200/80">
                <h2 className="text-xl font-bold text-zinc-800 mb-6">Thông tin chung</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <FormInput 
                    label="Mã phiếu nhập" 
                    name="importId" 
                    register={register} 
                    error={errors.importId} 
                    icon={<FileText size={18}/>} 
                  />
                  <FormInput 
                    label="Ngày lập phiếu" 
                    name="importDate" 
                    register={register} 
                    error={errors.importDate} 
                    type="date" 
                    icon={<Calendar size={18}/>} 
                  />
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 overflow-hidden">
                <div className="flex justify-between items-center p-6">
                  <h2 className="text-xl font-bold text-zinc-800">Danh sách sản phẩm</h2>
                  <button 
                    type="button" 
                    onClick={() => append({ productName: '', unit: '', quantity: 1, unitPrice: 1000 })} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md shadow-blue-500/20"
                  >
                    <Plus size={16} />Thêm sản phẩm
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-blue-900/80 bg-blue-100/60">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-center w-16">STT</th>
                        <th className="px-6 py-4 font-semibold min-w-[200px] max-w-xs break-words whitespace-normal">Mặt hàng</th>
                        <th className="px-6 py-4 font-semibold min-w-[120px] max-w-[180px] break-words whitespace-normal">Đơn vị tính</th>
                        <th className="px-6 py-4 font-semibold text-center w-28">Số lượng</th>
                        <th className="px-6 py-4 font-semibold w-40">Đơn giá</th>
                        <th className="px-6 py-4 font-semibold text-right w-48">Thành tiền</th>
                        <th className="px-6 py-4 font-semibold text-center w-20">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => (
                        <tr key={field.id} className="border-t border-zinc-200 align-top hover:bg-zinc-50/50 transition-colors duration-150">
                          <td className="px-6 py-4 text-center font-medium text-zinc-500">{index + 1}</td>
                          <td className="px-6 py-4 min-w-[200px] max-w-xs break-words whitespace-normal">
                            <input
                              {...register(`products.${index}.productName`)}
                              placeholder="Tên sản phẩm"
                              className="w-full bg-transparent focus:outline-none font-semibold text-zinc-800 p-1 -m-1 rounded-md focus:bg-zinc-100 transition-colors duration-200 break-words whitespace-normal"
                            />
                            {errors.products?.[index]?.productName && (
                              <p className="text-red-600 text-xs mt-1.5">{errors.products[index]?.productName?.message}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 min-w-[120px] max-w-[180px] break-words whitespace-normal">
                            <input
                              {...register(`products.${index}.unit`)}
                              placeholder="VD: Thùng, Hộp..."
                              className="w-full bg-transparent focus:outline-none text-zinc-500 p-1 -m-1 rounded-md focus:bg-zinc-100 transition-colors duration-200 break-words whitespace-normal"
                            />
                            {errors.products?.[index]?.unit && (
                              <p className="text-red-600 text-xs mt-1.5">{errors.products[index]?.unit?.message}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <input 
                              type="number" 
                              {...register(`products.${index}.quantity`, { valueAsNumber: true })} 
                              placeholder="0" 
                              className="w-20 bg-zinc-100 text-zinc-800 text-center rounded-lg py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                            {errors.products?.[index]?.quantity && (
                              <p className="text-red-600 text-xs mt-1.5 w-20">{errors.products[index]?.quantity?.message}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number" 
                              {...register(`products.${index}.unitPrice`, { valueAsNumber: true })} 
                              placeholder="0" 
                              className="w-32 bg-zinc-100 text-zinc-800 rounded-lg py-2 px-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                            {errors.products?.[index]?.unitPrice && (
                              <p className="text-red-600 text-xs mt-1.5 w-32">{errors.products[index]?.unitPrice?.message}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-semibold text-blue-600">
                              {((watchedProducts?.[index]?.quantity || 0) * (watchedProducts?.[index]?.unitPrice || 0)).toLocaleString('vi-VN')}
                            </span>
                            <span className="text-zinc-500 ml-1">VND</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              type="button" 
                              onClick={() => remove(index)} 
                              className="text-zinc-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {errors.products?.message && (
                    <p className="text-red-600 text-sm p-4 text-center bg-red-50/50">{errors.products.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar / Summary */}
            <div className="lg:col-span-1 max-w-sm w-full mx-auto">
              <div className="sticky top-8 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200/80">
                  <h3 className="text-xl font-bold text-zinc-800 mb-6">Hoàn tất & Ghi chú</h3>
                  <div className="space-y-5">
                    <StatusSelector 
                      label="Trạng thái phiếu" 
                      name="status" 
                      control={control} 
                      error={errors.status} 
                      options={statusOptions} 
                      placeholder="Chọn trạng thái" 
                    />
                    <div>
                      <label htmlFor="note" className="block text-sm font-medium text-zinc-600 mb-1.5">Ghi chú</label>
                      <textarea 
                        id="note" 
                        {...register('note')} 
                        rows={3} 
                        placeholder="Thêm ghi chú cho phiếu nhập..." 
                        className="w-full p-3 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-zinc-800 shadow-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-sky-500 text-white rounded-xl p-6 shadow-lg shadow-blue-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-sky-100">Tổng cộng</h3>
                    <DollarSign size={24} className="text-sky-200"/>
                  </div>
                  <p className="text-4xl font-bold tracking-tight">
                    {calculateTotal().toLocaleString('vi-VN')} <span className="text-2xl font-semibold text-sky-200">VND</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button" 
                    onClick={() => navigate('/import')} 
                    className="w-full flex items-center justify-center px-4 py-3 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300/70 font-semibold transition-all duration-200"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow-md shadow-blue-500/20"
                  >
                    {isSubmitting ? (
                      <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Đang lưu...</>
                    ) : (
                      <><Save size={16} className="mr-2"/>Lưu thay đổi</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditImportPage; 