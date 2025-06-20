import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUser, HiLocationMarker, HiPhone, HiMail, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const AddPaymentReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agency: '',
    address: '',
    phone: '',
    email: '',
    paymentDate: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl shadow-2xl p-12 border-4 border-blue-200 max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 drop-shadow flex items-center gap-3 justify-center uppercase tracking-wide">
          <HiCurrencyDollar className="text-blue-500 text-4xl" />
          Lập phiếu thu tiền
        </h1>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
              <HiUser className="text-blue-400" /> Đại lý
            </label>
            <input
              type="text"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow transition-all duration-200 bg-white hover:border-cyan-400"
              placeholder="Nhập tên đại lý..."
              required
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
              <HiLocationMarker className="text-blue-400" /> Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow transition-all duration-200 bg-white hover:border-cyan-400"
              placeholder="Nhập địa chỉ đại lý..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                <HiPhone className="text-blue-400" /> Điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow transition-all duration-200 bg-white hover:border-cyan-400"
                placeholder="Nhập số điện thoại..."
                required
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                <HiMail className="text-blue-400" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow transition-all duration-200 bg-white hover:border-cyan-400"
                placeholder="Nhập email đại lý..."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                <HiCalendar className="text-blue-400" /> Ngày thu tiền
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow transition-all duration-200 bg-white hover:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                <HiCurrencyDollar className="text-blue-400" /> Số tiền thu
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-lg shadow transition-all duration-200 bg-white hover:border-cyan-400"
                placeholder="Nhập số tiền thu..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/payment')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-bold text-lg shadow"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all font-bold text-lg shadow-lg"
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
