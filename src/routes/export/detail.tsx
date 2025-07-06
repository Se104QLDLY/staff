import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useTabNavigation } from '../../hooks/useTabNavigation';
import { getIssueById } from '../../api/export.api';
import type { Issue } from '../../api/export.api';

interface ProductItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

type ExportTab = 'info' | 'products' | 'finance' | 'delivery' | 'history';

const ExportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeTab, changeTab, isActive } = useTabNavigation<'info'>('info');
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real data
  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;
      try {
        // Nếu id là dạng số trực tiếp thì dùng luôn
        const issueId = Number(id);
        const data = await getIssueById(issueId);
        setIssue(data);
      } catch (error) {
        console.error('Error loading issue detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIssue();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">Đang tải chi tiết phiếu xuất...</div>
      </DashboardLayout>
    );
  }

  // Tính tổng số lượng và tổng tiền
  const totalQuantity = issue?.details?.reduce((sum, d) => sum + d.quantity, 0) || 0;
  
  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-blue-800 mb-2 drop-shadow uppercase tracking-wide">Chi tiết phiếu xuất</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Mã phiếu xuất</label>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-800 font-semibold">
              {issue?.code || (issue?.issue_id ? `PX${issue.issue_id.toString().padStart(3, '0')}` : '')}
            </div>
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Đại lý</label>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-800">{issue?.agency_name || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-blue-700 font-semibold mb-1">Ngày lập phiếu</label>
            <div className="bg-white px-4 py-2 rounded-lg border text-gray-800">{issue?.issue_date ? new Date(issue.issue_date).toLocaleDateString('vi-VN') : ''}</div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white mb-8">
          <table className="min-w-full bg-white border border-blue-200 rounded-2xl">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
              <tr className="uppercase text-sm">
                <th className="py-3 px-4 text-left">STT</th>
                <th className="py-3 px-4 text-left">Mặt hàng</th>
                <th className="py-3 px-4 text-left">Đơn vị tính</th>
                <th className="py-3 px-4 text-left">Số lượng</th>
                <th className="py-3 px-4 text-left">Đơn giá</th>
                <th className="py-3 px-4 text-left">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {issue?.details?.map((d, idx) => (
                <tr key={d.issue_detail_id} className="hover:bg-blue-50">
                  <td className="px-4 py-3 text-blue-700 text-center font-semibold">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{d.item_name}</td>
                  <td className="px-4 py-3 text-gray-700">{/* unit_name nếu có */}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{d.quantity.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{Number(d.unit_price).toLocaleString('vi-VN')} đ</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">{Number(d.line_total).toLocaleString('vi-VN')} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-lg px-8 py-6 min-w-[320px] w-full max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Tổng tiền</span>
              <span className="text-2xl font-bold text-blue-700">
                {Number(issue?.total_amount || (issue?.details?.reduce((sum, d) => sum + Number(d.line_total), 0) || 0)).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExportDetailPage; 