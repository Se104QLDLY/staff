import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const AddExportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    exportId: '',
    agency: '',
    exportDate: '',
    products: [
      { productName: '', unit: '', quantity: 0, unitPrice: 0, totalPrice: 0 },
    ],
    paidAmount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...formData.products];
    const product = updatedProducts[index] || { productName: '', unit: '', quantity: 0, unitPrice: 0, totalPrice: 0 };
    const newProduct = {
      ...product,
      [field]: value,
    };
    newProduct.totalPrice = (Number(newProduct.quantity) || 0) * (Number(newProduct.unitPrice) || 0);
    updatedProducts[index] = newProduct;
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productName: '', unit: '', quantity: 0, unitPrice: 0, totalPrice: 0 }],
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const calculateTotal = () => {
    return formData.products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow uppercase tracking-wide text-center">Tạo phiếu xuất</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Mã phiếu xuất</label>
              <input
                type="text"
                name="exportId"
                value={formData.exportId}
                onChange={handleChange}
                className="block w-full px-4 py-2 border-2 border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Đại lý</label>
              <select
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                className="block w-full px-4 py-2 border-2 border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="">Chọn đại lý</option>
                <option value="Đại lý A">Đại lý A</option>
                <option value="Đại lý B">Đại lý B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Ngày lập phiếu</label>
              <input
                type="date"
                name="exportDate"
                value={formData.exportDate}
                onChange={handleChange}
                className="block w-full px-4 py-2 border-2 border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
            <table className="min-w-full bg-white border border-blue-200 rounded-2xl">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                <tr className="uppercase text-sm">
                  <th className="py-3 px-4 text-left">STT</th>
                  <th className="py-3 px-4 text-left">Mặt hàng</th>
                  <th className="py-3 px-4 text-left">Đơn vị tính</th>
                  <th className="py-3 px-4 text-left">Số lượng</th>
                  <th className="py-3 px-4 text-left">Đơn giá</th>
                  <th className="py-3 px-4 text-left">Thành tiền</th>
                  <th className="py-3 px-4 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {formData.products.map((product, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-3 font-semibold text-blue-700 text-center">{index + 1}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.unit || ''}
                        onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => handleProductChange(index, 'unitPrice', Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </td>
                    <td className="px-4 py-3 text-blue-800 font-semibold text-right">{product.totalPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="px-3 py-1 text-xs font-bold text-red-600 hover:text-white bg-red-100 hover:bg-red-500 rounded-full transition-colors"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addProduct}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg transition-colors"
          >
            + Thêm sản phẩm
          </button>

          <div className="flex justify-end mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-lg px-8 py-6 min-w-[320px] w-full max-w-md">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Tổng tiền</span>
                  <span className="text-2xl font-bold text-blue-700">{calculateTotal().toLocaleString()} đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Số tiền trả</span>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                    className="w-32 px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-right"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-blue-100 pt-3 mt-2">
                  <span className="text-sm text-gray-600 font-medium">Còn lại</span>
                  <span className="text-2xl font-bold text-red-600">{(calculateTotal() - (formData.paidAmount || 0)).toLocaleString()} đ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold shadow"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg text-lg transition-colors"
            >
              Lưu phiếu xuất
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddExportPage;
