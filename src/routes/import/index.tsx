import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PackagePlus, ListChecks, DollarSign, FilePlus2, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchReceipts, deleteReceipt } from '../../api/import.api';
import { getItems } from '../../api/inventory.api';
import type { ReceiptItem } from '../../api/import.api';
import type { Item as InventoryItem } from '../../api/inventory.api';
import { fetchAssignedAgencies } from '../../api/staffAgency.api';

interface ImportRecord {
  id: string;
  importDate: string;
  totalAmount: string;
  agency: string;
  agencyId: number;
}

const ImportManagementPage: React.FC = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ImportRecord | null>(null);
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const { user } = useAuth();
  const [assignedAgencies, setAssignedAgencies] = useState<{agency_id: number; agency_name: string;}[]>([]);

  const agencies = ['Tất cả đại lý', 'Đại lý A', 'Đại lý B', 'Đại lý C'];

  // Fetch inventory items for stock display
  useEffect(() => {
    (async () => {
      try {
        const items = await getItems();
        setInventoryItems(items);
      } catch (error) {
        console.error('Error loading inventory items:', error);
      }
    })();
  }, []);

  // Fetch assigned agencies and import records
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Lấy danh sách agency được phân công
        const agencies = await fetchAssignedAgencies(user.id);
        setAssignedAgencies(agencies);
        const agencyIds = agencies.map(a => a.agency_id);

        // Fetch phiếu nhập
        const data: ReceiptItem[] = await fetchReceipts();
        // Lọc chỉ phiếu nhập của các agency được phân công
        const filtered = data.filter(item => agencyIds.includes(item.agency_id));
        // Map dữ liệu sang ImportRecord
        const records: ImportRecord[] = filtered.map(item => ({
          id: item.receipt_id.toString(),
          importDate: item.receipt_date,
          totalAmount: Number(item.total_amount).toLocaleString('vi-VN'),
          agency: item.agency_name,
          agencyId: item.agency_id
        }));
        setImportRecords(records);
      } catch (error) {
        console.error('Error loading import data:', error);
      }
    })();
  }, [user]);

  // Lọc theo từ khóa và đại lý
  const filteredRecords = importRecords.filter(
    (record) =>
      (!fromDate || new Date(record.importDate) >= new Date(fromDate)) &&
      (!toDate || new Date(record.importDate) <= new Date(toDate)) &&
      (selectedAgency === '' || selectedAgency === 'Tất cả đại lý' || record.agency === selectedAgency) &&
      (
        record.id.toLowerCase().includes(search.toLowerCase()) ||
        record.totalAmount.toLowerCase().includes(search.toLowerCase()) ||
        record.importDate.includes(search)
      )
  );

  // Filtered inventory (optional search)
  const filteredInventory = inventoryItems.filter(item =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (record: ImportRecord) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (recordToDelete) {
      try {
        // Call API to delete
        await deleteReceipt(Number(recordToDelete.id));
        
        // Update local state
        setImportRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
        
        // Close modal and reset
        setShowDeleteModal(false);
        setRecordToDelete(null);
        
        alert(`Đã xóa phiếu nhập ${recordToDelete.id} thành công!`);
      } catch (error) {
        console.error('Error deleting import record:', error);
        alert('Có lỗi xảy ra khi xóa phiếu nhập!');
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  // Thống kê
  const totalImports = filteredRecords.length;
  const totalAmount = filteredRecords.reduce((sum, r) => sum + Number(r.totalAmount.replace(/[^\d]/g, '')), 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6">
        {/* Inventory Stock Table */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-4 border border-blue-200">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 drop-shadow uppercase tracking-wide flex items-center gap-2 mb-4">
            <PackagePlus className="h-7 w-7 text-blue-500 mr-2" /> Tồn kho hiện tại
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-blue-200">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                <tr className="uppercase text-sm">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Tên hàng</th>
                  <th className="px-4 py-2">Đơn vị</th>
                  <th className="px-4 py-2">Tồn kho</th>
                  <th className="px-4 py-2">Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredInventory.map(item => (
                  <tr key={item.item_id} className="hover:bg-blue-50">
                    <td className="px-4 py-2">{item.item_id}</td>
                    <td className="px-4 py-2">{item.item_name}</td>
                    <td className="px-4 py-2">{item.unit_name}</td>
                    <td className="px-4 py-2">{item.stock_quantity}</td>
                    <td className="px-4 py-2">{item.price.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Create Import Button Only */}
        <div className="flex justify-end mb-8">
          <Link
            to="/import/add"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:scale-105 hover:shadow-xl transition-all font-bold text-lg shadow-lg whitespace-nowrap border-2 border-blue-700"
          >
            <FilePlus2 className="h-5 w-5 mr-2" /> Tạo phiếu nhập
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImportManagementPage;