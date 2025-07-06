import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ArrowLeft, Package, Calendar, User, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { getReceiptById, updateReceipt, getItems, type Receipt } from '../../api/receipt.api';
import { type Item } from '../../api/export.api';

interface ReceiptFormData {
  receipt_date: string;
  items: Array<{
    item_id: number;
    quantity: number;
    unit_price: number;
  }>;
}

interface ReceiptItem {
  item_id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
}

const EditImportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  const [receiptDate, setReceiptDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Fetch receipt data and items in parallel
        const [receiptData, itemsData] = await Promise.all([
          getReceiptById(parseInt(id)),
          getItems({ limit: 1000 }) // Get all items
        ]);

        setReceipt(receiptData);
        setItems(itemsData.results);
        setReceiptDate(receiptData.receipt_date);
        
        // Convert receipt details to form format
        if (receiptData.details) {
          const formattedItems = receiptData.details.map(detail => ({
            item_id: detail.item,
            item_name: detail.item_name,
            quantity: detail.quantity,
            unit_price: parseFloat(detail.unit_price)
          }));
          setReceiptItems(formattedItems);
        }
      } catch (err) {
        setError('Không thể tải thông tin phiếu nhập');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddItem = () => {
    if (items.length === 0) return;
    
    const firstItem = items[0];
    const newItem = {
      item_id: firstItem.item_id,
      item_name: firstItem.item_name,
      quantity: 1,
      unit_price: parseFloat(firstItem.price)
    };
    setReceiptItems([...receiptItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setReceiptItems(receiptItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...receiptItems];
    const currentItem = updatedItems[index];
    
    if (!currentItem) return;
    
    if (field === 'item_id') {
      const selectedItem = items.find(item => item.item_id === parseInt(value));
      if (selectedItem) {
        updatedItems[index] = {
          item_id: selectedItem.item_id,
          item_name: selectedItem.item_name,
          unit_price: parseFloat(selectedItem.price),
          quantity: currentItem.quantity // Keep existing quantity
        };
      }
    } else {
      const numValue = field === 'quantity' || field === 'unit_price' ? parseFloat(value) || 0 : value;
      updatedItems[index] = {
        ...currentItem,
        [field]: numValue
      } as ReceiptItem;
    }
    
    setReceiptItems(updatedItems);
  };

  const handleSave = async () => {
    if (!receipt) return;
    
    if (receiptItems.length === 0) {
      setError('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload: ReceiptFormData = {
        receipt_date: receiptDate,
        items: receiptItems.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      };

      await updateReceipt(receipt.receipt_id, payload);
      navigate('/import');
    } catch (err) {
      setError('Không thể cập nhật phiếu nhập');
      console.error('Error updating receipt:', err);
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = receiptItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-zinc-600">Đang tải thông tin phiếu nhập...</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !receipt) {
    return (
      <DashboardLayout>
        <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Link 
                  to="/import" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Quay lại
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-zinc-50 font-sans p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-zinc-800">Chỉnh sửa Phiếu Nhập</h1>
                <p className="text-zinc-500 text-base mt-1">Cập nhật thông tin phiếu nhập #{receipt?.receipt_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold gap-2 text-sm shadow-sm hover:shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
              <Link 
                to={`/import/view/${receipt?.receipt_id}`}
                className="flex items-center justify-center px-4 py-2.5 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 hover:border-zinc-400 transition-all duration-200 font-semibold gap-2 text-sm"
              >
                <ArrowLeft size={16} />
                <span>Quay lại</span>
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 p-6 mb-8">
            <h2 className="text-xl font-bold text-zinc-800 mb-6">Thông tin phiếu nhập</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">
                  Ngày nhập hàng
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
                  <input
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">
                  Nhà cung cấp
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
                  <input
                    type="text"
                    value={receipt?.agency_name || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-500"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-800">Danh sách sản phẩm</h3>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} />
                  Thêm sản phẩm
                </button>
              </div>

              <div className="space-y-4">
                {receiptItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg">
                    <div className="flex-1">
                      <select
                        value={item.item_id}
                        onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {items.map(availableItem => (
                          <option key={availableItem.item_id} value={availableItem.item_id}>
                            {availableItem.item_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="SL"
                      />
                    </div>
                    
                    <div className="w-32">
                      <input
                        type="number"
                        min="1000"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Đơn giá"
                      />
                    </div>
                    
                    <div className="w-40 text-right font-semibold text-zinc-800">
                      {(item.quantity * item.unit_price).toLocaleString('vi-VN')} VND
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-zinc-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-zinc-800">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalAmount.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditImportPage;
