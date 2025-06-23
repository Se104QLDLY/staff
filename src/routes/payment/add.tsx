import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, User, MapPin, Phone, Mail, CalendarDays, BadgeDollarSign, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow uppercase tracking-wide">Lập phiếu thu tiền</h1>
              <p className="text-gray-600 text-base mt-1">Nhập thông tin để tạo mới phiếu thu cho đại lý.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                <User className="text-blue-500 h-6 w-6" /> Đại lý
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
                <MapPin className="text-cyan-500 h-6 w-6" /> Địa chỉ
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
                  <Phone className="text-green-500 h-6 w-6" /> Điện thoại
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
                  <Mail className="text-purple-500 h-6 w-6" /> Email
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
                  <CalendarDays className="text-orange-500 h-6 w-6" /> Ngày thu tiền
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
                  <BadgeDollarSign className="text-green-600 h-6 w-6" /> Số tiền thu
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-blue-100 text-gray-700 rounded-2xl hover:bg-blue-200 transition-colors font-bold text-lg shadow"
              >
                <ArrowLeft className="h-5 w-5" /> Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all font-bold text-lg shadow-lg"
              >
                <DollarSign className="h-5 w-5" /> Lưu phiếu thu
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPaymentReceipt;
