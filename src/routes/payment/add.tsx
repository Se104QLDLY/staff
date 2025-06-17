import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const AddPaymentReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiptId: '',
    agency: '',
    paymentDate: '',
    amount: '',
    creator: '',
    createdDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/payment');
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide">Tạo phiếu thu</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Mã phiếu thu</label>
            <input
              type="text"
              name="receiptId"
              value={formData.receiptId}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Đại lý</label>
            <select
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              required
            >
              <option value="">Chọn đại lý</option>
              <option value="Đại lý Hà Nội">Đại lý Hà Nội</option>
              <option value="Đại lý Hồ Chí Minh">Đại lý Hồ Chí Minh</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Ngày thu</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Số tiền</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Người tạo</label>
            <input
              type="text"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Ngày tạo</label>
            <input
              type="date"
              name="createdDate"
              value={formData.createdDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="px-5 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-bold text-lg shadow-lg"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
            >
              Lưu phiếu thu
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPaymentReceipt;
