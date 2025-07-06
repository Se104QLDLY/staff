import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getItems } from '../../api/inventory.api';
import { createReceipt } from '../../api/receipt.api';
import type { Item as InventoryItem } from '../../api/inventory.api';
import { PackagePlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

const AddImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshInventory } = useInventory();
  const [formData, setFormData] = useState<{ importDate: string; products: Array<{ item_id: number; quantity: string }> }>({
    importDate: '',
    products: [{ item_id: 0, quantity: '' }],
  });
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    const currentProduct = updated[index];
    
    if (field === 'quantity') {
      updated[index] = { ...currentProduct, quantity: value as string };
    } else {
      updated[index] = { ...currentProduct, item_id: value as number };
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
    
    if (!formData.importDate) {
      alert('Vui lòng chọn ngày lập phiếu');
      return;
    }

    if (formData.products.some(p => !p.quantity || Number(p.quantity) <= 0)) {
      alert('Vui lòng nhập số lượng hợp lệ cho tất cả sản phẩm');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        agency_id: 1, // Default agency for staff receipts
        receipt_date: formData.importDate,
        items: formData.products.map(p => {
          const item = inventoryItems.find(i => i.item_id === p.item_id);
          return {
            item_id: p.item_id,
            quantity: Number(p.quantity),
            unit_price: item?.price || 0
          };
        }),
      };

      await createReceipt(payload);
      
      // Refresh inventory to update stock quantities
      refreshInventory();
      
      alert('Tạo phiếu nhập thành công!');
      navigate('/import');
    } catch (error) {
      console.error('Error creating receipt:', error);
      alert('Có lỗi xảy ra khi tạo phiếu nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <PackagePlus className="text-blue-600" size={28} />
                Tạo phiếu nhập mới
              </h1>
              <Link
                to="/import"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Trở lại
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày lập phiếu
                </label>
                <input
                  type="date"
                  value={formData.importDate}
                  onChange={(e) => setFormData({ ...formData, importDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh sách sản phẩm</h3>
              <div className="space-y-4">
                {formData.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sản phẩm
                      </label>
                      <select
                        value={product.item_id}
                        onChange={(e) => handleProductChange(index, 'item_id', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value={0}>Chọn sản phẩm</option>
                        {inventoryItems.map(item => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name} - {item.unit_name} - {Number(item.price).toLocaleString('vi-VN')} VND
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        required
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thành tiền
                      </label>
                      <div className="p-2 bg-gray-100 rounded-lg text-right">
                        {(() => {
                          const qty = Number(product.quantity) || 0;
                          const item = inventoryItems.find(i => i.item_id === product.item_id);
                          const price = item?.price || 0;
                          return (qty * price).toLocaleString('vi-VN');
                        })()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      disabled={formData.products.length === 1}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addProduct}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm sản phẩm
              </button>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-xl font-bold text-gray-800">
                Tổng tiền: {calculateTotal().toLocaleString('vi-VN')} VND
              </div>
              <div className="flex gap-4">
                <Link
                  to="/import"
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Đang tạo...' : 'Tạo phiếu nhập'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddImportPage;
