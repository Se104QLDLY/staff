import React, { useState } from 'react';
import { apiClient } from '../../api/axiosClient';
import { useToast } from '../../components/common';

const AddEditAgencyForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    createdDate: '',
    updatedDate: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.createAgency(formData);
      toast.show('Thêm đại lý thành công!', 'success');
      onClose();
    } catch (err: any) {
      toast.show('Có lỗi xảy ra khi thêm đại lý!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border-2 border-blue-100 max-w-3xl w-full mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Mã đại lý <span className='text-red-500'>*</span></label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="VD: DL001"
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-900 text-base transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Tên đại lý <span className='text-red-500'>*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên đại lý"
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-900 text-base transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Loại đại lý <span className='text-red-500'>*</span></label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-base transition-all duration-200"
            required
          >
            <option value="">Chọn loại đại lý</option>
            <option value="Cấp 1">Cấp 1</option>
            <option value="Cấp 2">Cấp 2</option>
          </select>
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Quận/Huyện</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Nhập quận/huyện"
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-900 text-base transition-all duration-200"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-base font-semibold text-blue-700 mb-2">Địa chỉ <span className='text-red-500'>*</span></label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-900 text-base transition-all duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-900 text-base transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 text-gray-900 text-base transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Ngày tạo</label>
          <input
            type="date"
            name="createdDate"
            value={formData.createdDate}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-base transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-700 mb-2">Ngày cập nhật</label>
          <input
            type="date"
            name="updatedDate"
            value={formData.updatedDate}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-base transition-all duration-200"
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-6 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-7 py-2.5 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200 transition-all duration-200 shadow-sm text-base"
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-7 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center"><span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>Đang lưu...</span>
            ) : (
              'Lưu'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditAgencyForm;
