import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getItems, updateItem } from '../../api/inventory.api';
import type { Item as InventoryItem } from '../../api/inventory.api';
import { PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddImportPage: React.FC = () => {
  const [formData, setFormData] = useState<{ importDate: string; products: Array<{ item_id: number; quantity: string }> }>({
    importDate: '',
    products: [{ item_id: 0, quantity: '' }],
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Fetch inventory items
    (async () => {
      try {
        const items = await getItems();
        setInventoryItems(items);
        // initialize first product with blank quantity
        setFormData(prev => ({
          ...prev,
          products: prev.products.map(() => ({ item_id: items[0]?.item_id || 0, quantity: '' })),
        }));
      } catch (error) {
        console.error('Error loading inventory items:', error);
      }
    })();
  }, []);

  const handleProductChange = (index: number, field: 'item_id' | 'quantity', value: number | string) => {
    const updated = [...formData.products];
    if (field === 'quantity') {
      updated[index] = { ...updated[index], quantity: value as string };
    } else {
      updated[index] = { ...updated[index], item_id: value as number };
    }
    setFormData({ ...formData, products: updated });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { item_id: inventoryItems[0]?.item_id || 0, quantity: '' }],
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const calculateTotal = () =>
    formData.products.reduce((sum, p) => {
      const qty = Number(p.quantity) || 0;
      const item = inventoryItems.find(i => i.item_id === p.item_id);
      return sum + (item?.price || 0) * qty;
    }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update stock directly without history
      for (const p of formData.products) {
        const qty = Number(p.quantity) || 0;
        const item = inventoryItems.find(i => i.item_id === p.item_id);
        const newStock = (item?.stock_quantity || 0) + qty;
        await updateItem(p.item_id, { stock_quantity: newStock });
      }
      alert('Nhập kho thành công!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Có lỗi khi cập nhật tồn kho!');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide">Tạo phiếu nhập</h1>
          <Link to="/import" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Quay lại
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày lập phiếu</label>
              <input
                type="date"
                name="importDate"
                value={formData.importDate}
                onChange={(e) => setFormData({ ...formData, importDate: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800">Danh sách sản phẩm nhập</h2>
          <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
            <table className="min-w-full bg-white border border-blue-200">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                <tr className="uppercase text-sm">
                  <th className="py-3 px-4 text-left">STT</th>
                  <th className="py-3 px-4 text-left">Mặt hàng</th>
                  <th className="py-3 px-4 text-left">Đơn vị</th>
                  <th className="py-3 px-4 text-left">Số lượng</th>
                  <th className="py-3 px-4 text-left">Thành tiền</th>
                  <th className="py-3 px-4 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {formData.products.map((product, index) => {
                  const sel = inventoryItems.find(i => i.item_id === product.item_id);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <select
                          value={product.item_id}
                          onChange={(e) => handleProductChange(index, 'item_id', Number(e.target.value))}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {inventoryItems.map(i => (
                            <option key={i.item_id} value={i.item_id}>{i.item_name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">{sel?.unit_name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {(sel?.price || 0 * Number(product.quantity)).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="px-3 py-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 rounded-lg"
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
          <button
            type="button"
            onClick={addProduct}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Thêm sản phẩm
          </button>

          <div className="mt-6 text-right text-lg font-bold text-gray-800">
            Tổng tiền: {calculateTotal().toLocaleString('vi-VN')} đ
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Nhập kho
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddImportPage;
