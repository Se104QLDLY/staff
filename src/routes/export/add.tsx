import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { exportApi } from '../../api/export.api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { fetchAssignedAgencies } from '../../api/staffAgency.api';
import { useAuth } from '../../hooks/useAuth';

interface Agency {
  agency_id: number;
  agency_name: string;
}

interface Item {
  item_id: number;
  item_name: string;
  unit: number;
  unit_name: string;
  price: string;
  stock_quantity: number;
}

interface ProductForm {
  item_id: number;
  item_name: string;
  unit_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const AddExportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [formData, setFormData] = useState({
    issue_id: '',
    agency_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    products: [
      { item_id: 0, item_name: '', unit_name: '', quantity: 0, unit_price: 0, total_price: 0 } as ProductForm,
    ],
    paid_amount: 0,
  });

  // Load agencies and items on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        let agenciesResponse: Agency[] = [];
        if (user && user.id) {
          agenciesResponse = await fetchAssignedAgencies(user.id);
        }
        const itemsResponse = await exportApi.getItems();
        setAgencies(agenciesResponse || []);
        setItems(itemsResponse.results || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Không thể tải dữ liệu');
      }
    };

    loadData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...formData.products];
    const product = updatedProducts[index];
    
    if (!product) return; // Safety check
    
    if (field === 'item_id') {
      // When item is selected, populate item details
      const selectedItem = items.find(item => item.item_id === Number(value));
      if (selectedItem) {
        product.item_id = selectedItem.item_id;
        product.item_name = selectedItem.item_name;
        product.unit_name = selectedItem.unit_name;
        // Apply 102% markup on import price (item.price is 100% import price)
        const basePrice = Number(selectedItem.price);
        const exportPrice = Math.round(basePrice * 1.02); // 102% of import price
        product.unit_price = exportPrice;
      }
    } else {
      (product as any)[field] = value;
    }
    
    // Recalculate total price
    product.total_price = (Number(product.quantity) || 0) * (Number(product.unit_price) || 0);
    
    updatedProducts[index] = product;
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { item_id: 0, item_name: '', unit_name: '', quantity: 0, unit_price: 0, total_price: 0 }],
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const calculateTotal = () => {
    return formData.products.reduce((sum, product) => sum + product.total_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agency_id) {
      toast.error('Vui lòng chọn đại lý');
      return;
    }

    if (!formData.issue_date) {
      toast.error('Vui lòng chọn ngày lập phiếu');
      return;
    }

    const validProducts = formData.products.filter(p => p.item_id && p.quantity > 0);
    if (validProducts.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    setLoading(true);
    
    try {
      const createData = {
        agency_id: Number(formData.agency_id),
        issue_date: formData.issue_date,
        paid_amount: formData.paid_amount || 0,
        items: validProducts.map(product => ({
          item_id: product.item_id,
          quantity: product.quantity,
          unit_price: product.unit_price
        }))
      };

      await exportApi.createIssue(createData);
      toast.success('Tạo phiếu xuất thành công!');
      navigate('/export');
    } catch (error: any) {
      console.error('Error creating export:', error);
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi tạo phiếu xuất');
    } finally {
      setLoading(false);
    }
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
                name="issue_id"
                value={formData.issue_id}
                onChange={handleChange}
                placeholder="Để trống để tự động tạo"
                className="block w-full px-4 py-2 border-2 border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Đại lý *</label>
              <select
                name="agency_id"
                value={formData.agency_id}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border-2 border-blue-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="">Chọn đại lý</option>
                {agencies.map((agency) => (
                  <option key={agency.agency_id} value={agency.agency_id}>
                    {agency.agency_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-1">Ngày lập phiếu *</label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
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
                      <select
                        value={product.item_id || ''}
                        onChange={(e) => handleProductChange(index, 'item_id', e.target.value)}
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      >
                        <option value="">Chọn mặt hàng</option>
                        {items.map((item) => (
                          <option key={`item-${item.item_id}`} value={item.item_id}>
                            {item.item_name} (Tồn: {item.stock_quantity})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.unit_name || ''}
                        readOnly
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-base"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                        min="0"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.unit_price}
                        onChange={(e) => handleProductChange(index, 'unit_price', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </td>
                    <td className="px-4 py-3 text-blue-800 font-semibold text-right">{product.total_price.toLocaleString()}</td>
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
                    value={formData.paid_amount}
                    onChange={e => setFormData({ ...formData, paid_amount: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                    className="w-32 px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-right"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-blue-100 pt-3 mt-2">
                  <span className="text-sm text-gray-600 font-medium">Còn lại</span>
                  <span className="text-2xl font-bold text-red-600">{(calculateTotal() - (formData.paid_amount || 0)).toLocaleString()} đ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/export')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold shadow"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg text-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu phiếu xuất'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddExportPage;
